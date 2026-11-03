import { Avatar, AvatarFallback, AvatarImage } from 'piuba-pescado-erp';

export const Iniciais = () => (
  <Avatar>
    <AvatarFallback>RJ</AvatarFallback>
  </Avatar>
);

export const ImagemComFallback = () => (
  <Avatar>
    <AvatarImage src="/nao-existe.png" alt="Rodrigo" />
    <AvatarFallback>RJ</AvatarFallback>
  </Avatar>
);

export const Tamanhos = () => (
  <div className="flex items-center gap-3">
    <Avatar className="h-8 w-8"><AvatarFallback>AB</AvatarFallback></Avatar>
    <Avatar><AvatarFallback>CD</AvatarFallback></Avatar>
    <Avatar className="h-14 w-14"><AvatarFallback>EF</AvatarFallback></Avatar>
  </div>
);
