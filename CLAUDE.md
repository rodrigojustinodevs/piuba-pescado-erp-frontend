## Frontend
- Siga vercel-react-best-practices e vercel-composition-patterns em todo código React/Next.
- Rode web-design-guidelines antes de considerar uma tela pronta.
- Modais de visualização de item usam `@/shared/components/detailsDialog` (referência: `src/features/tank/components/TankDetailsDialog.tsx`). Não criar novos `*ViewDialogContent` com `DetailItem`; status vira um `DetailTone`, sem cores próprias.
