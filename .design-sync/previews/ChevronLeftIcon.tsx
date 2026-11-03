import { ChevronLeftIcon } from 'piuba-pescado-erp';

export const Tamanhos = () => (
  <div className="flex items-center gap-4 text-foreground">
    <ChevronLeftIcon className="h-4 w-4" />
    <ChevronLeftIcon className="h-6 w-6" />
    <ChevronLeftIcon className="h-10 w-10" />
  </div>
);

export const Cores = () => (
  <div className="flex items-center gap-4">
    <ChevronLeftIcon className="h-8 w-8 text-primary" />
    <ChevronLeftIcon className="h-8 w-8 text-muted-foreground" />
    <ChevronLeftIcon className="h-8 w-8 text-destructive" />
  </div>
);
