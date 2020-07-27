import {
  createSlice,
  CreateSliceOptions,
  PayloadAction,
  SliceCaseReducers,
  ValidateSliceCaseReducers,
} from "@reduxjs/toolkit";

type GenericState<T> = {
  data: T[];
  status: "loading" | "finished" | "error";
  loaded: boolean;
};

type CustomState = {
  extra: boolean;
};

const cgs = <S, X>(
  args: CreateSliceOptions<
    S & GenericState<X>,
    SliceCaseReducers<S & GenericState<X>>,
    string
  >
) => {
  const createGenericSlice = <
    T,
    Reducers extends SliceCaseReducers<S & GenericState<T>>
  >({
    name = "",
    initialState,
    reducers,
  }: {
    name: string;
    initialState: S & GenericState<T>;
    reducers: ValidateSliceCaseReducers<S & GenericState<T>, Reducers>;
  }) => {
    return createSlice({
      name,
      initialState: {
        loaded: false,
        status: "finished",
        data: [],
        ...initialState,
      } as S & GenericState<T>,
      reducers: {
        start(state) {
          state.status = "loading";
        },
        withPrepare: {
          reducer: (state) => {
            state.status = "loading";
          },
          prepare: () => {
            return { meta: { action: "list" }, payload: { limit: 5 } };
          },
        },
        success(state: S & GenericState<T>, action: PayloadAction<T>) {
          state.data = [action.payload];
          state.status = "finished";
        },
        ...reducers,
      },
    });
  };
  return createGenericSlice(args);
};

type Thing = string;

const wrappedSlice = cgs<CustomState, Thing>({
  name: "test",
  initialState: { status: "loading", extra: true } as CustomState &
    GenericState<Thing>,
  reducers: {
    magic(
      state: CustomState & GenericState<Thing>,
      _action: PayloadAction<string | void>
    ) {
      state.extra = false;
      state.data = ["hocus pocus"];
    },
    withPayload(
      state: CustomState & GenericState<Thing>,
      action: PayloadAction<Thing[]>
    ) {
      state.status = "finished";
      state.data = action.payload;
    },
    receivedAll: {
      reducer: (
        state: CustomState & GenericState<Thing>,
        _action: PayloadAction<string | void>
      ) => {
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
