// design-sync shim: next/navigation hooks with static values (no App Router).
export const usePathname = () => '/dashboard';
export const useSearchParams = () => new URLSearchParams();
export const useParams = () => ({});
export const useRouter = () => ({
  push: () => {},
  replace: () => {},
  back: () => {},
  forward: () => {},
  refresh: () => {},
  prefetch: () => {},
});
export const redirect = () => {};
export const notFound = () => {};
