/**
 * Padrão do projeto para modais de "visualizar item".
 * Referência de uso: src/features/tank/components/TankDetailsDialog.tsx
 *
 * Estrutura:
 *   <DetailsDialog>
 *     <DetailsDialogBody>
 *       <DetailsHero icon tone title> <DetailsStatusBadge/> <DetailsCopyId/> </DetailsHero>
 *       <DetailsGrid> <DetailsTile/>… </DetailsGrid>
 *       <DetailsTimestamps/>
 *     </DetailsDialogBody>
 *     <DetailsDialogFooter onClose onEdit/>
 *   </DetailsDialog>
 */
export {
  DetailsDialog,
  DetailsDialogBody,
  DetailsHero,
  DetailsStatusBadge,
  DetailsCopyId,
  DetailsGrid,
  DetailsTile,
  DetailsSection,
  DetailsTimestamps,
  DetailsDialogFooter,
  DetailsDialogSkeleton,
} from './DetailsDialog';
export { wasUpdatedAfterCreation } from './utils';
export type {
  DetailsDialogProps,
  DetailsHeroProps,
  DetailsTileProps,
  DetailsDialogFooterProps,
} from './DetailsDialog';
export { DETAIL_TONES, getStatusTone } from './tones';
export type { DetailTone, DetailToneClasses } from './tones';
