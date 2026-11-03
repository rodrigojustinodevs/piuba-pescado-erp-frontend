import { CloseIcon } from 'piuba-pescado-erp';

export const Tamanhos = () => (
  <div className="flex items-center gap-4 text-foreground">
    <CloseIcon className="h-4 w-4" />
    <CloseIcon className="h-6 w-6" />
    <CloseIcon className="h-10 w-10" />
  </div>
);

export const Cores = () => (
  <div className="flex items-center gap-4">
    <CloseIcon className="h-8 w-8 text-primary" />
    <CloseIcon className="h-8 w-8 text-muted-foreground" />
    <CloseIcon className="h-8 w-8 text-destructive" />
  </div>
);
