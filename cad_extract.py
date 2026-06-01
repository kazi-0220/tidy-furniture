#!/usr/bin/env python3
"""
cad_extract_v2.py — Improved: aggressive merging, better thresholds, noise filtering.
"""
from PIL import Image
import numpy as np
import json
import math
import os

def load_binary(filepath, threshold=80):
    img = Image.open(filepath).convert("L")
    arr = np.array(img, dtype=np.float32)
    h, w = arr.shape
    binary = arr > threshold
    return binary, w, h, arr

def detect_and_merge(binary, min_len=8, merge_stack=3):
    """
    Detect line segments by row/col scan, then merge adjacent overlapping ones.
    merge_stack: how many adjacent rows/cols to consider for merging (thick lines).
    """
    h, w = binary.shape
    h_segs, v_segs = [], []

    # ── Horizontal ──
    for y in range(h):
        row = binary[y, :]
        regions = []
        start = -1
        for x in range(w):
            if row[x]:
                if start < 0: start = x
            elif start >= 0:
                rlen = x - start
                if rlen >= min_len: regions.append((start, x-1, rlen))
                start = -1
        if start >= 0 and w - start >= min_len:
            regions.append((start, w-1, w-start))
        for (s, e, rlen) in regions:
            h_segs.append([s, y, e, y, rlen])

    # ── Vertical ──
    for x in range(w):
        col = binary[:, x]
        regions = []
        start = -1
        for y in range(h):
            if col[y]:
                if start < 0: start = y
            elif start >= 0:
                rlen = y - start
                if rlen >= min_len: regions.append((start, y-1, rlen))
                start = -1
        if start >= 0 and h - start >= min_len:
            regions.append((start, h-1, h-start))
        for (s, e, rlen) in regions:
            v_segs.append([x, s, x, e, rlen])

    # ── Merge overlapping parallel segments ──
    def merge_parallel(segs, axis):
        """Merge segments that overlap in (x1,x2) and are stacked consecutively."""
        if not segs: return []
        # Sort: for H, sort by (x1, y); for V, sort by (y1, x)
        if axis == 'h':
            segs.sort(key=lambda s: (s[1], s[0]))  # by y, then x1
        else:
            segs.sort(key=lambda s: (s[0], s[2]))  # by x, then y1

        # Group by overlapping range on the orthogonal axis
        merged = []
        used = [False] * len(segs)
        for i in range(len(segs)):
            if used[i]: continue
            x1, y1, x2, y2, rlen = segs[i]
            group = [segs[i]]
            used[i] = True
            for j in range(i+1, len(segs)):
                if used[j]: continue
                if axis == 'h':
                    ox1, oy1, ox2, oy2, _ = segs[j]
                    # Must be on overlapping x range AND within merge_stack rows
                    x_overlap = max(x1, ox1) <= min(x2, ox2)
                    y_close = abs(oy1 - y1) <= merge_stack
                    if x_overlap and y_close:
                        group.append(segs[j])
                        used[j] = True
                        x1 = min(x1, ox1)
                        x2 = max(x2, ox2)
                        y1 = min(y1, oy1)
                        y2 = max(y2, oy2)
                else:  # vertical
                    oy1, ox1, oy2, ox2, _ = segs[j]
                    y_overlap = max(y1, oy1) <= min(y2, oy2)
                    x_close = abs(ox1 - x1) <= merge_stack
                    if y_overlap and x_close:
                        group.append(segs[j])
                        used[j] = True
                        y1 = min(y1, oy1)
                        y2 = max(y2, oy2)
                        x1 = min(x1, ox1)
                        x2 = max(x2, ox2)

            # Take the representative: use the widest x-range for h, widest y-range for v
            if axis == 'h':
                rep_y = int(sum(s[1] for s in group) / len(group))
                merged.append([x1, rep_y, x2, rep_y, x2 - x1 + 1])
            else:
                rep_x = int(sum(s[0] for s in group) / len(group))
                merged.append([rep_x, y1, rep_x, y2, y2 - y1 + 1])
        return merged

    h_merged = merge_parallel(h_segs, 'h')
    v_merged = merge_parallel(v_segs, 'v')

    # Combine and return
    result = []
    for (x1, y1, x2, y2, rlen) in h_merged:
        result.append({'x1': x1, 'y1': y1, 'x2': x2, 'y2': y2, 'axis': 'h', 'len': rlen})
    for (x1, y1, x2, y2, rlen) in v_merged:
        result.append({'x1': x1, 'y1': y1, 'x2': x2, 'y2': y2, 'axis': 'v', 'len': rlen})
    return result

def classify(segments, w, h):
    """Classify each segment by position and length."""
    if not segments:
        return []

    xs = [s['x1'] for s in segments] + [s['x2'] for s in segments]
    ys = [s['y1'] for s in segments] + [s['y2'] for s in segments]
    min_x, max_x = min(xs), max(xs)
    min_y, max_y = min(ys), max(ys)

    margin = max(15, (max_x - min_x) * 0.04)
    result = []

    for s in segments:
        x1, y1, x2, y2, length = s['x1'], s['y1'], s['x2'], s['y2'], s['len']
        axis = s['axis']

        near_edge = (
            min(x1, x2) <= min_x + margin or max(x1, x2) >= max_x - margin or
            min(y1, y2) <= min_y + margin or max(y1, y2) >= max_y - margin
        )

        if length >= 60:
            style = 'outline'
        elif length >= 25:
            if axis == 'h' or axis == 'v':
                style = 'dim'
            else:
                style = 'outline'
        elif length >= 12:
            if near_edge:
                style = 'dim'
            else:
                style = 'tenon'
        else:
            style = 'tenon'  # short lines = tenon slots or text (we filter text later)

        result.append({
            'type': 'line',
            'x1': x1, 'y1': y1, 'x2': x2, 'y2': y2,
            'style': style,
            'len': length,
        })
    return result

def trace_contours_as_path(edge_binary, min_chain=30, simplify_eps=3.0):
    """Trace edge contours and return SVG path strings."""
    h, w = edge_binary.shape
    visited = np.zeros_like(edge_binary, dtype=bool)
    paths = []

    # BFS 8-neighbor to find connected edge components
    for y0 in range(0, h, 2):
        for x0 in range(0, w, 2):
            if edge_binary[y0, x0] and not visited[y0, x0]:
                comp = []
                stack = [(x0, y0)]
                visited[y0, x0] = True
                while stack:
                    x, y = stack.pop()
                    comp.append((x, y))
                    for dy in (-1, 0, 1):
                        ny = y + dy
                        if ny < 0 or ny >= h: continue
                        for dx in (-1, 0, 1):
                            if dx == 0 and dy == 0: continue
                            nx = x + dx
                            if nx < 0 or nx >= w: continue
                            if edge_binary[ny, nx] and not visited[ny, nx]:
                                visited[ny, nx] = True
                                stack.append((nx, ny))

                if len(comp) < min_chain:
                    continue

                # Order by nearest neighbor
                ordered = [comp[0]]
                rest = set(comp[1:])
                cur = comp[0]
                while rest:
                    cx, cy = cur
                    best, best_d = None, float('inf')
                    for p in list(rest)[:200]:  # limit search for perf
                        d = abs(p[0]-cx) + abs(p[1]-cy)
                        if d < best_d:
                            best_d, best = d, p
                    ordered.append(best)
                    rest.discard(best)
                    cur = best

                # Simplify with RDP
                def rdp(pts, eps):
                    if len(pts) <= 2: return pts
                    max_d, max_i = 0, 0
                    xa, ya = pts[0]; xb, yb = pts[-1]
                    dx, dy = xb - xa, yb - ya
                    den = dx*dx + dy*dy
                    for i in range(1, len(pts)-1):
                        if den == 0:
                            d = abs(pts[i][0]-xa) + abs(pts[i][1]-ya)
                        else:
                            num = abs(dy*pts[i][0] - dx*pts[i][1] + xb*ya - yb*xa)
                            d = num / den**0.5
                        if d > max_d:
                            max_d, max_i = d, i
                    if max_d > eps:
                        left = rdp(pts[:max_i+1], eps)
                        right = rdp(pts[max_i:], eps)
                        return left[:-1] + right
                    return [pts[0], pts[-1]]

                simplified = rdp(ordered, simplify_eps)
                if len(simplified) < 3:
                    continue

                # Build path
                parts = [f"M {simplified[0][0]} {simplified[0][1]}"]
                for i in range(1, len(simplified)):
                    parts.append(f"L {simplified[i][0]} {simplified[i][1]}")
                d = " ".join(parts)

                # Compute path length
                plen = 0
                for i in range(1, len(simplified)):
                    plen += math.hypot(
                        simplified[i][0] - simplified[i-1][0],
                        simplified[i][1] - simplified[i-1][1])

                paths.append({'type': 'path', 'd': d, 'style': 'outline-curve', 'len': plen})

    return paths

def extract(filepath, name):
    binary, w, h, arr = load_binary(filepath)
    print(f"\n{'='*60}")
    print(f"Extracting: {name} ({w}x{h})")

    # Scanline detection with improved params
    segs = detect_and_merge(binary, min_len=8, merge_stack=3)
    print(f"Raw segments after merge: {len(segs)}")

    # Classify
    classified = classify(segs, w, h)

    # Count by style
    styles = {}
    for s in classified:
        styles[s['style']] = styles.get(s['style'], 0) + 1
    print(f"Classified: {styles}")

    # Edge contour for curves
    grad = np.abs(np.diff(arr, axis=0, append=arr[-1:, :])) + \
           np.abs(np.diff(arr, axis=1, append=arr[:, -1:]))
    edge_binary = grad > 25
    paths = trace_contours_as_path(edge_binary, min_chain=80, simplify_eps=2.5)
    print(f"Contour paths: {len(paths)}")

    # Combine: paths first, then lines sorted by style
    all_segs = paths + classified
    style_order = {'outline-curve': 0, 'outline': 1, 'dim': 2, 'tenon': 3}
    all_segs.sort(key=lambda s: style_order.get(s['style'], 4))

    print(f"Total: {len(all_segs)}")

    return {
        'name': name,
        'viewBox': [0, 0, w, h],
        'segments': all_segs,
    }

if __name__ == '__main__':
    images = {
        'ceban': '/Users/kazi/Desktop/tidy-furniture/public/images/侧板.png',
        'diban': '/Users/kazi/Desktop/tidy-furniture/public/images/底板.png',
        'kaobei': '/Users/kazi/Desktop/tidy-furniture/public/images/靠板.png',
    }

    all_data = {}
    for key, path in images.items():
        if not os.path.exists(path):
            print(f"ERROR: not found: {path}")
            continue
        all_data[key] = extract(path, key)

    out = '/Users/kazi/Desktop/tidy-furniture/data/cad_segments.json'
    with open(out, 'w') as f:
        json.dump(all_data, f, ensure_ascii=False, indent=2)

    total = sum(len(d['segments']) for d in all_data.values())
    print(f"\nOutput: {out} ({total} total segments)")
