// design-sync shim: next/image as a plain <img>.
import * as React from 'react';

type ImageProps = Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> & {
  src: string | { src: string };
  fill?: boolean;
  priority?: boolean;
  quality?: number;
  placeholder?: string;
  unoptimized?: boolean;
};

export default function Image({ src, fill, priority: _p, quality: _q, placeholder: _ph, unoptimized: _u, style, alt, ...rest }: ImageProps) {
  const url = typeof src === 'string' ? src : src.src;
  const fillStyle: React.CSSProperties | undefined = fill
    ? { position: 'absolute', inset: 0, width: '100%', height: '100%' }
    : undefined;
  return <img src={url} alt={alt ?? ''} style={{ ...fillStyle, ...style }} {...rest} />;
}
