# Vectorization Reference

Use this file when choosing or tuning vectorization. Keep the source PNG and every candidate SVG so the final choice is reversible.

## Preferred Options

### Vectorizer.AI or Vectorizer.io

Use a premium web vectorizer when available. These usually produce cleaner grouped shapes and better flat-color illustration results than basic local tracing.

Recommended settings:
- mode suited to logos/illustrations, not photos
- color output, not monochrome
- limit detail/noise where the UI exposes that control
- transparent background if the PNG has alpha
- SVG output, not PDF/EPS

After downloading, rename the result with the tool name:

```text
asset-name-vectorizer-ai.svg
asset-name-vectorizer-io.svg
```

### VTracer Local Fallback

Use VTracer when browser-based vectorizers are unavailable or when the project must stay local. Install according to the current VTracer instructions for the machine, then run a conservative color trace:

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

## Last Resort

Avoid naive potrace color-mask pipelines for multi-color website art. They often create bloated, layered, brittle SVGs with poor edges. Use only when:
- VTracer and premium web vectorizers are unavailable
- the image has very few flat colors
- the result is manually inspected and still beats the PNG

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
asset-name-vectorizer-ai.svg
asset-name-vectorizer-io.svg
asset-name-vtracer.svg
asset-name.svg
asset-name.png
```

`asset-name.svg` is the selected production candidate. `asset-name.png` is the preserved fallback.
