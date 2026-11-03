import { PlusIcon } from 'piuba-pescado-erp';

export const Tamanhos = () => (
  <div className="flex items-center gap-4 text-foreground">
    <PlusIcon className="h-4 w-4" />
    <PlusIcon className="h-6 w-6" />
    <PlusIcon className="h-10 w-10" />
  </div>
);

export const Cores = () => (
  <div className="flex items-center gap-4">
    <PlusIcon className="h-8 w-8 text-primary" />
    <PlusIcon className="h-8 w-8 text-muted-foreground" />
    <PlusIcon className="h-8 w-8 text-destructive" />
  </div>
);
