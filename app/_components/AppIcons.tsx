"use client";

import type { ReactNode, SVGProps } from "react";

type IconBaseProps = {
  children: ReactNode;
  className?: string;
};

const IconBase = ({ children, className = "w-5 h-5" }: IconBaseProps) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    {children}
  </svg>
);

type IconPathProps = Omit<SVGProps<SVGPathElement>, "strokeLinecap" | "strokeLinejoin" | "strokeWidth"> & {
  d: string;
};

const IconPath = ({ d, ...rest }: IconPathProps) => (
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    d={d}
    {...rest}
  />
);

type StrokeIconProps = { className?: string };

function createStrokeIcon(paths: string | string[]) {
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

export const SpinnerIcon = createStrokeIcon(
  "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
);

export const PencilIcon = createStrokeIcon(
  "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
);

export const TrashIcon = createStrokeIcon(
  "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
);

export const TankDocumentIcon = createStrokeIcon([
  "M3 7h18M6 7V5a2 2 0 012-2h8a2 2 0 012 2v2M6 7v14a2 2 0 002 2h8a2 2 0 002-2V7",
  "M9 11h6M9 15h6",
]);

export const BuildingIcon = createStrokeIcon(
  "M4 21V5a2 2 0 012-2h6a2 2 0 012 2v16M4 21h16M10 9h2M10 13h2M10 17h2M14 21V7a2 2 0 012-2h2a2 2 0 012 2v14"
);

export const PhotoPlaceholderIcon = createStrokeIcon([
  "M3 7h18M5 7l2-3h10l2 3M5 7v13a1 1 0 001 1h12a1 1 0 001-1V7",
  "M12 11a3 3 0 100 6 3 3 0 000-6z",
]);

export const PlusIcon = createStrokeIcon("M12 4v16m8-8H4");

export const SearchIcon = createStrokeIcon("M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z");

export const ChevronDownIcon = createStrokeIcon("M19 9l-7 7-7-7");

export const ChevronLeftIcon = createStrokeIcon("M15 19l-7-7 7-7");

export const ChevronRightIcon = createStrokeIcon("M9 5l7 7-7 7");

export const DoubleChevronLeftIcon = createStrokeIcon("M11 19l-7-7 7-7m8 14l-7-7 7-7");

export const DoubleChevronRightIcon = createStrokeIcon("M13 5l7 7-7 7M5 5l7 7-7 7");

export const FilterIcon = createStrokeIcon(
  "M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
);

export const EyeIcon = createStrokeIcon([
  "M15 12a3 3 0 11-6 0 3 3 0 016 0z",
  "M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z",
]);

export function CircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
    </svg>
  );
}

