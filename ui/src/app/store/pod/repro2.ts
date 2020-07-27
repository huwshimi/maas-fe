import {
  createSlice,
  PayloadAction,
  SliceCaseReducers,
  ValidateSliceCaseReducers,
} from "@reduxjs/toolkit";

type Thing = string;

type CustomState<T> = {
  data?: T;
  status: "loading" | "finished" | "error";
  allowed: boolean;
};

type AllowedStates = CustomState<Thing>;

const cgs = <S extends AllowedStates>(args) => {
  const createGenericSlice = <T, Reducers extends SliceCaseReducers<S<T>>>({
    name = "",
    initialState,
    reducers,
  }: {
    name: string;
    initialState: S<T>;
    reducers: ValidateSliceCaseReducers<S<T>, Reducers>;
  }) => {
    return createSlice({
      name,
      initialState,
      reducers: {
        start(state: S<T>) {
          state.status = "loading";
        },
        withMeta: {
          prepare: () => {
            return {};
          },
          reducer: (state: S<T>) => {
            state.status = "loading";
          },
        },
        /**
         * If you want to write to values of the state that depend on the generic
         * (in this case: `state.data`, which is T), you might need to specify the
         * State type manually here, as it defaults to `Draft<GenericState<T>>`,
         * which can sometimes be problematic with yet-unresolved generics.
         * This is a general problem when working with immer's Draft type and generics.
         */
        success(state: S<T>, action: PayloadAction<undefined>) {
          state.data = action.payload;
          state.status = "finished";
        },
        ...reducers,
      },
    });
  };
  return createGenericSlice(args);
};

const wrappedSlice = cgs<CustomState>({
  name: "test",
  initialState: { allowed: false },
  reducers: {
    magic(state: CustomState<Thing>, _action: PayloadAction<undefined>) {
      state.status = "finished";
      state.data = "hocus pocus";
      state.allowed = true;
    },
  },
});

const actions = wrappedSlice.actions;

actions.start();
actions.magic();
actions.withMeta();
