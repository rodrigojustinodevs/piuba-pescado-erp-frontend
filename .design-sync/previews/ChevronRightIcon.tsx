import { ChevronRightIcon } from 'piuba-pescado-erp';

export const Tamanhos = () => (
  <div className="flex items-center gap-4 text-foreground">
    <ChevronRightIcon className="h-4 w-4" />
    <ChevronRightIcon className="h-6 w-6" />
    <ChevronRightIcon className="h-10 w-10" />
  </div>
);

export const Cores = () => (
  <div className="flex items-center gap-4">
    <ChevronRightIcon className="h-8 w-8 text-primary" />
    <ChevronRightIcon className="h-8 w-8 text-muted-foreground" />
    <ChevronRightIcon className="h-8 w-8 text-destructive" />
  </div>
);
