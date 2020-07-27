import {
  createSlice,
  PayloadAction,
  SliceCaseReducers,
  ValidateSliceCaseReducers,
} from "@reduxjs/toolkit";

type Thing = string;

type GenericState<T, S> = {
  data?: T;
  status: "loading" | "finished" | "error";
} & S;

type StateOne = {
  allowed: boolean;
};

type StateTwo = {
  admin: boolean;
};

type AllowedStates = StateOne | StateTwo;

const cgs = <S extends AllowedStates>(args) => {
  const createGenericSlice = <
    T,
    Reducers extends SliceCaseReducers<GenericState<T, S>>
  >({
    name = "",
    initialState,
    reducers,
  }: {
    name: string;
    initialState: GenericState<T, S>;
    reducers: ValidateSliceCaseReducers<GenericState<T, S>, Reducers>;
  }) => {
    return createSlice({
      name,
      initialState,
      reducers: {
        start(state: GenericState<T, S>) {
          state.status = "loading";
        },
        withMeta: {
          prepare: () => {
            return {};
          },
          reducer: (state: GenericState<T, S>) => {
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
        success(state: GenericState<T, S>, action: PayloadAction<undefined>) {
          state.data = action.payload;
          state.status = "finished";
        },
        ...reducers,
      },
    });
  };
  return createGenericSlice(args);
};

const wrappedSlice = cgs<StateOne>({
  name: "test",
  initialState: { allowed: false } as StateOne,
  reducers: {
    magic(
      state: GenericState<Thing, StateOne>,
      _action: PayloadAction<undefined>
    ) {
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
