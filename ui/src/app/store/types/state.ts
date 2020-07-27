import type { TSFixMe } from "app/base/types";

export type GenericState<I> = {
  errors: TSFixMe;
  items: I[];
  loaded: boolean;
  loading: boolean;
  saved: boolean;
  saving: boolean;
};
