import type { ReactNode, SVGProps } from 'react';

export type StrokeIconProps = { className?: string };

type IconBaseProps = {
  children: ReactNode;
  className?: string;
};

const IconBase = ({ children, className = 'w-5 h-5' }: IconBaseProps) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    {children}
  </svg>
);

type IconPathProps = Omit<
  SVGProps<SVGPathElement>,
  'strokeLinecap' | 'strokeLinejoin' | 'strokeWidth'
> & {
  d: string;
};

const IconPath = ({ d, ...rest }: IconPathProps) => (
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={d} {...rest} />
);

export function createStrokeIcon(paths: string | string[]) {
  const ds = Array.isArray(paths) ? paths : [paths];
  return function StrokeIcon({ className }: StrokeIconProps) {
    return (
      <IconBase className={className}>
        {ds.map((d, idx) => (
          <IconPath key={idx} d={d} />
        ))}
      </IconBase>
    );
  };
}

export function createStrokeIconNoProps(paths: string | string[]) {
  const Icon = createStrokeIcon(paths);
  return function StrokeIconNoProps() {
    return <Icon />;
  };
}
