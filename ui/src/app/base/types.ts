import type { ValueOf } from "@canonical/react-components";

export type TSFixMe = any; // eslint-disable-line @typescript-eslint/no-explicit-any

export const SortDirection = {
  ASCENDING: "ascending",
  DESCENDING: "descending",
  NONE: "none",
} as const;

export type Sort<K extends string | null = string> = {
  direction: ValueOf<typeof SortDirection>;
  key: K | null;
};

export type RouteParams = {
  id: string;
};

export type AnalyticsEvent = {
  action: string;
  category: string;
  label: string;
};

export type SelectedAction<A, E> = {
  name: A;
  extras?: E;
};

export type SetSelectedAction<SA> = (action: SA | null) => void;

export type ClearSelectedAction = () => void;

export type AnyObject = Record<string, unknown>;

export type EmptyObject = Record<string, never>;

export type APIError<E = null> =
  | string
  | string[]
  | Record<"__all__" | string, string | string[]>
  | null
  | E;
