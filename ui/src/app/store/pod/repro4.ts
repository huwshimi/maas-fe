import {
  createSlice,
  PayloadAction,
  SliceCaseReducers,
  ValidateSliceCaseReducers,
  Slice,
} from "@reduxjs/toolkit";

type GenericState<T> = {
  data: T[];
  status: "loading" | "finished" | "error";
  loaded: boolean;
};

type Thing = {
  name: string;
};

type CustomState = {
  extra: boolean;
} & GenericState<Thing>;

type AllowedStates = CustomState;

export const createGenericSlice = <
  T,
  R extends SliceCaseReducers<GenericState<T>>
>({
  name = "",
  initialState,
  reducers,
}: {
  name: string;
  initialState: GenericState<T>;
  reducers: ValidateSliceCaseReducers<GenericState<T>, R>;
}): Slice<GenericState<T>, R, string> => {
  return createSlice({
    name,
    initialState: {
      data: [],
      status: "loading",
      loaded: false,
      ...initialState,
    },
    reducers,
  });
};

const generateBaseReducers = <
  S extends AllowedStates,
  T extends S["data"][0]
>() => ({
  start(state: S) {
    state.status = "loading";
  },
  withPrepare: {
    reducer: (state: S) => {
      state.status = "loading";
    },
    prepare: () => {
      return { meta: { action: "list" }, payload: { limit: 5 } };
    },
  },
  success(state: S, action: PayloadAction<T>) {
    state.data = [action.payload];
    state.status = "finished";
  },
});

const wrappedSlice = createGenericSlice({
  name: "test",
  initialState: { status: "loading", extra: false } as CustomState,
  reducers: {
    ...generateBaseReducers<CustomState, Thing>(),
    magic(state: CustomState) {
      state.data = [{ name: "hocus pocus" }];
      state.extra = true;
    },
    withPayload(state: CustomState, action) {
      state.status = "finished";
      state.data = action.payload;
    },
    receivedAll: {
      reducer: (state: CustomState) => {
        state.status = "loading";
      },
      prepare: () => {
        return { meta: { action: "list" }, payload: { limit: 5 } };
      },
    },
  },
});

const actions = wrappedSlice.actions;

actions.magic();

actions.success();

actions.withPayload("payload");

actions.receivedAll();

actions.withPrepare();
