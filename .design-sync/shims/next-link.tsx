// design-sync shim: next/link without the Next router runtime.
import * as React from 'react';

type LinkProps = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  href: string | { pathname?: string };
  prefetch?: boolean;
  replace?: boolean;
  scroll?: boolean;
};

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { href, prefetch: _prefetch, replace: _replace, scroll: _scroll, ...rest },
  ref,
) {
  const url = typeof href === 'string' ? href : (href.pathname ?? '#');
  return <a ref={ref} href={url} {...rest} />;
});

export default Link;
