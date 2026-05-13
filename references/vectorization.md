# Vectorization Reference

Use this file when tuning local vectorization. Keep the source PNG and every candidate SVG so the final choice is reversible.

## Local Tool Only

Use the Cargo-installed VTracer CLI for this workflow.

Check for VTracer before tracing:

```bash
vtracer --version
```

If it is missing, ask before installing or updating it with Cargo:

```bash
cargo install vtracer
```

## Baseline Command

Run a conservative color trace from the alpha PNG when available:

```bash
vtracer \
  --input asset-name-alpha.png \
  --output asset-name-vtracer.svg \
  --colormode color \
  --hierarchical stacked \
  --mode spline \
  --filter_speckle 4 \
  --color_precision 6 \
  --path_precision 8 \
  --corner_threshold 60 \
  --segment_length 4
```

Tune from there:
- Increase `--filter_speckle` to remove tiny islands.
- Lower `--color_precision` if the SVG has too many near-duplicate colors.
- Increase `--segment_length` if path count is too high.
- Use the source with alpha when available; otherwise use the flat intended background and confirm it does not become unwanted shapes.

## Variants Worth Keeping

Create named variants only when a setting change is meaningful:

```bash
vtracer --input asset-name-alpha.png --output asset-name-vtracer-clean.svg \
  --colormode color --hierarchical stacked --mode spline \
  --filter_speckle 8 --color_precision 5 --path_precision 8 \
  --corner_threshold 60 --segment_length 6

vtracer --input asset-name-alpha.png --output asset-name-vtracer-detailed.svg \
  --colormode color --hierarchical stacked --mode spline \
  --filter_speckle 2 --color_precision 7 --path_precision 8 \
  --corner_threshold 60 --segment_length 3
```

If VTracer cannot produce an acceptable result, keep the PNG fallback.

## Comparison Checklist

Compare candidates on the actual intended background:

- Visual quality at final rendered size
- Visual quality at 2x or zoomed browser preview
- File size versus PNG fallback
- Path/shape count and number of embedded rasters
- Edge quality around transparent regions
- Background remnants or accidental opaque rectangles
- Tiny speckles, holes, and fractured shapes
- Whether CSS sizing/import patterns stay simple in the host project

Prefer a slightly larger SVG if it looks materially better and remains reasonable for the page. Prefer PNG when the SVG is bloated, fragile, or visibly worse.

## Final Asset Naming

Suggested naming:

```text
asset-name-source.png
asset-name-alpha.png
asset-name-vtracer.svg
asset-name-vtracer-clean.svg
asset-name-vtracer-detailed.svg
asset-name.svg
asset-name.png
```

`asset-name.svg` is the selected production candidate. `asset-name.png` is the preserved fallback.
