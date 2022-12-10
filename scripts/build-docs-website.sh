npx typedoc --json docs/output.json src/**/*.ts
cp README.md docs/README.md
node ./scripts/docs-json-to-md.js