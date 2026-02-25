import Link from 'next/link';

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbProps = {
  items: BreadcrumbItem[];
  className?: string;
};

export function Breadcrumb({ items, className }: Readonly<BreadcrumbProps>) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={`mb-4 text-sm text-slate-600 ${className ?? ''}`.trim()}
    >
      <ol className="flex flex-wrap items-center">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={`${item.label}-${index}`} className="flex items-center">
              {item.href && !isLast ? (
                <Link href={item.href} className="hover:text-slate-800 transition-colors">
                  {item.label}
                </Link>
              ) : (
                <span className={isLast ? 'text-slate-700' : undefined}>{item.label}</span>
              )}
              {!isLast && <span className="mx-2 text-slate-400">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
