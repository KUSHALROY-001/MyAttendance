import { useMemo } from "react";

/**
 * Skeleton/placeholder lists have no real data, so there's nothing to key
 * them by except the array index — but using the index directly as a React
 * `key` is a lint-flagged anti-pattern (it can cause React to misassociate
 * state/DOM across re-renders when list length changes). Since these lists
 * are purely decorative and never reordered, a stable id generated once per
 * mount is enough: it's still a plain string, just not the raw index.
 *
 * Returns an array of `count` unique string ids, memoized so they stay
 * stable across re-renders and only regenerate if `count` itself changes.
 */
export const useSkeletonKeys = (count) =>
  useMemo(
    () => Array.from({ length: count }, () => crypto.randomUUID()),
    [count],
  );
