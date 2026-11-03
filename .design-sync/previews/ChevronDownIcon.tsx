import { ChevronDownIcon } from 'piuba-pescado-erp';

export const Tamanhos = () => (
  <div className="flex items-center gap-4 text-foreground">
    <ChevronDownIcon className="h-4 w-4" />
    <ChevronDownIcon className="h-6 w-6" />
    <ChevronDownIcon className="h-10 w-10" />
  </div>
);

export const Cores = () => (
  <div className="flex items-center gap-4">
    <ChevronDownIcon className="h-8 w-8 text-primary" />
    <ChevronDownIcon className="h-8 w-8 text-muted-foreground" />
    <ChevronDownIcon className="h-8 w-8 text-destructive" />
  </div>
);
