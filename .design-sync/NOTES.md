# design-sync notes (piuba-pescado-erp)

Project: https://claude.ai/design/p/c82fdf32-3ec6-4213-9d39-30a3affb067a

## How the build works here (this is an app, not a published package)
- No dist/, no Storybook, no .d.ts tree -> converter runs in synth-entry mode from `src/shared/components` (`srcDir`).
- Run the build with `--entry ./.design-sync/.cache/none.js` (a deliberately MISSING file): it makes PKG_DIR resolve to the repo root and triggers the synth entry. Prints a harmless `[NO_DIST]`.
- Full command (repo root):
  `node .design-sync/build-css.mjs && node .ds-sync/package-build.mjs --config .design-sync/config.json --node-modules ./node_modules --entry ./.design-sync/.cache/none.js --out ./ds-bundle`
- Styles: Tailwind v4 is compiled from `app/globals.css` by `.design-sync/build-css.mjs` into `.design-sync/.cache/compiled.css` (`cssEntry`). Re-run it before every build (it is `buildCmd`).
- `next/link`, `next/image`, `next/navigation` are replaced by stubs in `.design-sync/shims/` via `.design-sync/tsconfig.json` paths. Without them Next internals read `process.env` and every preview throws `process is not defined`.
- Barrel dirs imported via the `@/` alias (`ui`, `Table`, `Alert`) need EXACT entries in `.design-sync/tsconfig.json` paths: the converter's paths plugin treats a bare directory as a file. A new barrel import that fails with "is a directory" needs the same entry.
- `.design-sync/overrides/source-kit.mjs` is a fork (declared in `libOverrides`): (1) emits explicit re-exports for names exported by 2+ files (prefers `ui/`, then `icons/`), because `export *` drops ambiguous names; (2) always unions src-derived components with `componentSrcMap` pins. Needs `ln -sfn ../.ds-sync/node_modules .design-sync/node_modules` on a fresh clone.
- Render check: no playwright browser cache; use system Chrome: `DS_CHROMIUM_PATH=/usr/bin/google-chrome`. The validate reuses/limits nothing by itself, but delete `ds-bundle/.render-check.json` to force a full pass.
- Conflicts resolved to `ui/`: Alert, Card, Select. Hidden duplicates (not on window.PiubaDS): `Alert/Alert.tsx`, `Cards/Card.tsx`, `form/Select/Select.tsx`. Icons resolved to `icons/AppIcons.tsx`: SpinnerIcon, TrashIcon, BuildingIcon, ChevronLeftIcon, ChevronRightIcon, EyeIcon.

## Known render warns
- The 33 components that rendered blank with minimal props now have authored previews in `.design-sync/previews/` (all graded good): Card*/Avatar/Badge/Progress/PageHeader/Sidebar* parts/Table cells/ListHeader/ListEmptyState/NotFoundState/MetricCard/EntityDetailShell/Checkbox/DropdownMenuLabel/Chevron, Close and Plus icons.
- ~40 `[RENDER_THIN]`: single-SVG icons with no text - legitimate.
- Previews gotchas: Sidebar parts need `<SidebarProvider className="min-h-0 h-full">` + `<Sidebar collapsible="none">` or the min-h-svh clips them; DropdownMenuLabel needs an open menu (`cfg.overrides.cardMode=single`); ListHeader uses `cardMode=column`.

## Re-sync risks
- Geist fonts come from `next/font/google` at runtime; no @font-face ships in the bundle, so previews use the fallback font. Not yet wired (`runtimeFontPrefixes`/`extraFonts`).
- `guidelines/docs/manual-*.md` are the app's user manuals copied by the default `docs/*.md` guidelinesGlob - not design guidelines; consider narrowing `guidelinesGlob`.
- Only 55 files / 12 components were pushed as the first batch; the rest of the upload (close-out) is still pending. The remaining 177 components are floor cards or clean-by-default renders; every authored preview is in `.design-sync/previews/`.
- Emitted `.d.ts` are weak (`[key: string]: unknown`) because there is no shipped types tree; fix with `cfg.dtsPropsFor` for the components the design agent uses most.
