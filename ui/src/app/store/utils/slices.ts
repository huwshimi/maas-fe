import {
  createSlice,
  CaseReducer,
  Draft,
  PayloadAction,
  Slice,
  SliceCaseReducers,
  ValidateSliceCaseReducers,
} from "@reduxjs/toolkit";

import type { RootState } from "app/store/root/types";
import type { GenericState } from "app/store/types/state";
import type { TSFixMe } from "app/base/types";

type GenericItemMeta<I> = {
  item: I;
};

// Get the models that follow the generic shape. The following models are excluded:
// - 'messages' and 'status' are not models from the API.
// - 'general' has a collection of sub-models that form a different shape.
// - 'config' contains a collection of children without IDs.
// - 'scriptresults' returns an object of data rather than an array.
export type CommonStates = Omit<
  RootState,
  "messages" | "general" | "status" | "scriptresults" | "config"
>;

// Get the types of the common models. e.g. "DHCPSnippetState".
export type CommonStateTypes = CommonStates[keyof CommonStates];

type StatusStates = Pick<RootState, "machine" | "pod">;

type StatusStateTypes = StatusStates[keyof StatusStates];

type StatusPrepare = (...args: unknown[]) => unknown;

export const generateSlice = <I, R extends SliceCaseReducers<GenericState<I>>>({
  name = "",
  initialState,
  reducers,
}: {
  name: string;
  initialState: GenericState<I>;
  reducers: ValidateSliceCaseReducers<GenericState<I>, R>;
}): Slice<GenericState<I>, R, string> => {
  return createSlice({
    initialState: {
      errors: {},
      items: [],
      loaded: false,
      loading: false,
      saved: false,
      saving: false,
      ...initialState,
    },
    name,
    reducers,
  });
};

export const generateBaseHandlers = <
  S extends CommonStateTypes,
  I extends S["items"][0]
>(
  name: string
) => ({
  fetch: {
    prepare: (params?: TSFixMe) => ({
      meta: {
        model: name,
        method: "list",
      },
      payload: params && {
        params,
      },
    }),
    reducer: () => {
      // No state changes need to be handled for this action.
    },
  },
  fetchStart: (state: GenericState<I>) => {
    state.loading = true;
  },
  fetchError: (state: GenericState<I>, action: PayloadAction<I>) => {
    state.errors = action.payload;
    state.loading = false;
  },
  fetchSuccess: (state: GenericState<I>, action: PayloadAction<I[]>) => {
    state.loading = false;
    state.loaded = true;
    state.items = action.payload;
  },
  create: {
    prepare: (params) => ({
      meta: {
        model: name,
        method: "create",
      },
      payload: {
        params,
      },
    }),
    reducer: () => {
      // No state changes need to be handled for this action.
    },
  },
  createStart: (state: GenericState<I>, _action: PayloadAction<undefined>) => {
    state.saved = false;
    state.saving = true;
  },
  createError: (state: GenericState<I>, action: PayloadAction<I>) => {
    state.errors = action.payload;
    state.saving = false;
  },
  createSuccess: (state: GenericState<I>) => {
    state.errors = {};
    state.saved = true;
    state.saving = false;
  },
  createNotify: (state: GenericState<I>, action: PayloadAction<I>) => {
    // In the event that the server erroneously attempts to create an existing model,
    // due to a race condition etc., ensure we update instead of creating duplicates.
    const existingIdx = state.items.findIndex(
      (draftItem: S["items"][0]) => draftItem.id === action.payload.id
    );
    if (existingIdx !== -1) {
      state.items[existingIdx] = action.payload;
    } else {
      state.items.push(action.payload);
    }
  },
  update: {
    prepare: (params) => ({
      meta: {
        model: name,
        method: "update",
      },
      payload: {
        params,
      },
    }),
    reducer: () => {
      // No state changes need to be handled for this action.
    },
  },
  updateStart: (state: GenericState<I>) => {
    state.saved = false;
    state.saving = true;
  },
  updateError: (state: GenericState<I>, action: PayloadAction<I>) => {
    state.errors = action.payload;
    state.saving = false;
  },
  updateSuccess: (state: GenericState<I>) => {
    state.errors = {};
    state.saved = true;
    state.saving = false;
  },
  updateNotify: (state: GenericState<I>, action: PayloadAction<I>) => {
    for (const i in state.items) {
      if (state.items[i].id === action.payload.id) {
        state.items[i] = action.payload;
      }
    }
  },
  delete: {
    prepare: (id) => ({
      meta: {
        model: name,
        method: "delete",
      },
      payload: {
        params: {
          id,
        },
      },
    }),
    reducer: () => {
      // No state changes need to be handled for this action.
    },
  },
  deleteStart: (state: GenericState<I>) => {
    state.saved = false;
    state.saving = true;
  },
  deleteError: (state: GenericState<I>, action: PayloadAction<I>) => {
    state.errors = action.payload;
    state.saving = false;
  },
  deleteSuccess: (state: GenericState<I>) => {
    state.errors = {};
    state.saved = true;
    state.saving = false;
  },
  deleteNotify: (state: GenericState<I>, action: PayloadAction<I["id"]>) => {
    const index = state.items.findIndex(
      (item: S["items"][0]) => item.id === action.payload
    );
    state.items.splice(index, 1);
  },
  cleanup: (state: GenericState<I>) => {
    state.errors = {};
    state.saved = false;
    state.saving = false;
  },
});

export const generateStatusHandlers = <
  S extends StatusStateTypes,
  I extends S["items"][0],
  // A model key as a reference to the supplied state item.
  K extends keyof I
>(
  modelName: string,
  indexKey: K,
  handlers: {
    status: string;
    statusKey: string;
    prepare: StatusPrepare;
    error?: CaseReducer<S, PayloadAction<I, string, GenericItemMeta<I>>>;
    init?: CaseReducer<S, PayloadAction<I, string, GenericItemMeta<I>>>;
    start?: CaseReducer<S, PayloadAction<I, string, GenericItemMeta<I>>>;
    success?: CaseReducer<S, PayloadAction<I, string, GenericItemMeta<I>>>;
  }[]
): SliceCaseReducers<S> =>
  handlers.reduce<SliceCaseReducers<S>>((collection, status) => {
    collection[status.status] = {
      prepare: (...args: unknown[]) => ({
        meta: {
          model: modelName,
          method: status.status,
        },
        payload: {
          params: status.prepare(...args),
        },
      }),
      reducer: (
        state: Draft<S>,
        action: PayloadAction<I, string, GenericItemMeta<I>>
      ) => {
        status.init && status.init(state, action);
      },
    };
    collection[`${status.status}Start`] = {
      prepare: ({ item, payload }) => ({
        meta: {
          item,
        },
        payload,
      }),
      reducer: (
        state: Draft<S>,
        action: PayloadAction<I, string, GenericItemMeta<I>>
      ) => {
        status.start && status.start(state, action);
        state.statuses[String(action.meta.item[indexKey])][
          status.statusKey
        ] = true;
      },
    };
    collection[`${status.status}Success`] = {
      prepare: ({ item, payload }) => ({
        meta: {
          item,
        },
        payload,
      }),
      reducer: (
        state: Draft<S>,
        action: PayloadAction<I, string, GenericItemMeta<I>>
      ) => {
        status.success && status.success(state, action);
        state.statuses[String(action.meta.item[indexKey])][
          status.statusKey
        ] = false;
      },
    };
    collection[`${status.status}Error`] = {
      prepare: ({ item, payload }) => ({
        meta: {
          item,
        },
        payload,
      }),
      reducer: (
        state: Draft<S>,
        action: PayloadAction<I, string, GenericItemMeta<I>>
      ) => {
        status.error && status.error(state, action);
        state.errors = action.payload;
        state.statuses[String(action.meta.item[indexKey])][
          status.statusKey
        ] = false;
      },
    };
    return collection;
  }, {});
