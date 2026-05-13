#!/usr/bin/env node
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const args = process.argv.slice(2);

function usage() {
  console.error(
    "Usage: node scripts/audit-vector-candidates.mjs [--background <css-color>] [--out preview.html] <candidate.svg>..."
  );
  process.exit(1);
}

let background = "#ffffff";
let outPath = "";
const files = [];

for (let i = 0; i < args.length; i += 1) {
  const arg = args[i];
  if (arg === "--background") {
    background = args[++i] ?? usage();
  } else if (arg === "--out") {
    outPath = args[++i] ?? usage();
  } else if (arg.startsWith("--")) {
    usage();
  } else {
    files.push(arg);
  }
}

if (files.length === 0) usage();

function countMatches(source, pattern) {
  return source.match(pattern)?.length ?? 0;
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

const rows = [];

for (const file of files) {
  const svg = await readFile(file, "utf8");
  rows.push({
    file,
    name: path.basename(file),
    bytes: Buffer.byteLength(svg),
    paths: countMatches(svg, /<path\b/gi),
    groups: countMatches(svg, /<g\b/gi),
    shapes:
      countMatches(svg, /<(circle|ellipse|line|polygon|polyline|rect)\b/gi) +
      countMatches(svg, /<path\b/gi),
    images: countMatches(svg, /<image\b/gi),
    gradients: countMatches(svg, /<(linearGradient|radialGradient)\b/gi),
  });
}

const table = rows.map((row) => ({
  file: row.file,
  size: formatBytes(row.bytes),
  paths: row.paths,
  shapes: row.shapes,
  groups: row.groups,
  images: row.images,
  gradients: row.gradients,
}));

console.table(table);

if (outPath) {
  const cards = rows
    .map((row) => {
      const href = path.relative(path.dirname(outPath), row.file).replaceAll(path.sep, "/");
      return `
        <figure>
          <div class="preview"><img src="${escapeHtml(href)}" alt="${escapeHtml(row.name)}"></div>
          <figcaption>
            <strong>${escapeHtml(row.name)}</strong>
            <span>${formatBytes(row.bytes)} | ${row.paths} paths | ${row.shapes} shapes | ${row.images} images</span>
          </figcaption>
        </figure>`;
    })
    .join("\n");

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Vector Candidate Preview</title>
  <style>
    :root {
      color-scheme: light;
      font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      background: ${background};
      color: #171717;
    }
    body {
      margin: 0;
      padding: 32px;
      background: ${background};
    }
    main {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 24px;
      align-items: start;
    }
    figure {
      margin: 0;
    }
    .preview {
      display: grid;
      place-items: center;
      min-height: 260px;
      border: 1px solid rgba(0, 0, 0, 0.16);
      background: ${background};
    }
    img {
      max-width: 90%;
      max-height: 240px;
    }
    figcaption {
      display: grid;
      gap: 4px;
      margin-top: 10px;
      font-size: 13px;
      line-height: 1.35;
    }
    span {
      color: #555;
    }
  </style>
</head>
<body>
  <main>
${cards}
  </main>
</body>
</html>
`;

  await writeFile(outPath, html);
  console.log(`Wrote preview: ${outPath}`);
}
