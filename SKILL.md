---
name: 1-shot-svg
description: Generate production-quality SVG-like website assets in one shot by creating isolated flat-color PNGs, removing chroma-key backgrounds when needed, vectorizing locally with the Cargo-installed VTracer CLI, comparing quality/file size/path count, preserving PNG fallbacks, and wiring the selected SVG into a project. Use for corporate Memphis, editorial, SaaS, landing-page, hero, spot, and decorative web assets that should look vector-native but benefit from image generation.
license: MIT
compatibility: Requires an image generation tool for source PNGs and the local VTracer CLI installed with Cargo for SVG conversion.
---

# 1-Shot SVG

Use this skill when a project needs a polished website asset that feels like SVG/vector illustration but should be generated as a bitmap first, then vectorized. The target output is usually an SVG plus a preserved PNG fallback.

## Core Workflow

1. Inspect the intended placement before generating:
   - target dimensions and aspect ratio
   - background color or gradient behind the asset
   - desired density, stroke/shape style, and nearby UI
   - final import path and component/CSS conventions

2. Generate exactly one isolated source PNG with the available image generation tool:
   - exact intended dimensions
   - one asset only, centered with generous padding
   - flat corporate Memphis, modern editorial vector, geometric SaaS, or similar flat-color style
   - explicitly say this PNG will be converted to SVG with VTracer, so the generator should use large simple color regions
   - no text, labels, letters, watermarks, UI chrome, logos, or mock brand marks
   - clean flat fills, crisp edges, limited palette, minimal texture
   - avoid tiny details, fine lines, dense wheel spokes, feather texture, stippling, gradients, and small disconnected islands
   - no shadows unless the final design explicitly needs them

3. If transparency is needed, use a removable chroma-key source:
   - request a perfectly flat solid background such as `#00ff00` or `#ff00ff`
   - forbid that key color inside the subject
   - forbid shadows, gradients, floor planes, reflections, or lighting variation in the background
   - remove the key locally with the available chroma-key removal helper, using soft matte/despill settings for antialiased edges

4. Preserve named candidate assets:
   - `asset-name-source.png`
   - `asset-name-alpha.png` when chroma-key removal is used
   - `asset-name-vtracer.svg` or named VTracer setting variants such as `asset-name-vtracer-low-detail.svg`
   - `asset-name.png` as the fallback if the vector result is too heavy or visually worse

5. Vectorize and compare candidates:
   - Use the local Cargo-installed VTracer CLI.
   - For VTracer setup, commands, and tuning, read [references/vectorization.md](references/vectorization.md).

6. Audit the candidates:
   - preview on the actual intended page background
   - compare visual quality at final size and at 2x
   - compare file size
   - count path/shape complexity
   - inspect edges, tiny islands, banding, holes, and accidental background shapes

7. Wire only the selected final asset into the project:
   - keep the best SVG in the project asset directory
   - keep the PNG fallback next to it or in the established fallback asset location
   - update imports, image tags, CSS backgrounds, or component props using the project's existing patterns
   - store every project-referenced asset inside the project, not in a generator cache or temporary output folder

## Image Prompt Template

Use a compact, production-oriented prompt like this:

```text
Use case: logo-brand
Asset type: website illustration asset
Primary request: one isolated <subject> for <placement/context>
Canvas: exactly <width>x<height>
Style/medium: flat-color corporate Memphis / modern editorial vector illustration, clean geometric shapes, crisp edges, limited palette
Vectorization constraints: this PNG will be converted to SVG with VTracer; use large flat color regions only, roughly 8 to 12 total colors, crisp hard edges, no texture, no gradients, no tiny detail, no fine lines, no small disconnected islands
Composition/framing: single centered asset, generous transparent-safe padding, no crop
Background: perfectly flat solid <key color> chroma-key background for removal
Lighting/mood: no realistic lighting, no cast shadow, no contact shadow
Text: none
Constraints: one asset only; no labels, letters, watermark, logo, UI, mockup frame, texture, gradients in the background, or extra decorative scene
Avoid: using <key color> anywhere in the subject
```

If the final SVG will sit on a non-transparent background, replace the chroma-key background line with the exact intended background color and still keep it flat.

## Decision Rules

- If the SVG is visually worse than the PNG at final size, ship the PNG and keep the SVG candidate only as a named experiment.
- If the SVG is much larger than the PNG and offers no scaling/editing benefit, prefer the PNG fallback.
- If the SVG has excessive tiny paths, holes, or background remnants, retry vectorization settings before regenerating the image.
- If the generated source contains text or multiple assets, regenerate rather than repairing it.
- If the asset is simple enough to draw directly as repo-native SVG, do that instead of using this workflow.

## Candidate Audit Script

Run this after collecting SVG candidates:

```bash
node scripts/audit-vector-candidates.mjs --background "#f7f5ef" --out preview.html path/to/*.svg
```

The script reports file size and SVG node counts, then writes an HTML preview on the chosen background. Use the report as a filter, not as the final judge; visual quality in context wins.
