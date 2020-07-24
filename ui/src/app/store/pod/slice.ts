import { generateSlice, generateStatusHandlers } from "app/store/utils";
import { Pod, PodState } from "./types";

export const DEFAULT_STATUSES = {
  composing: false,
  deleting: false,
  refreshing: false,
};

const podSlice = generateSlice<PodState>({
  initialState: {
    selected: [],
    statuses: {},
  },
  name: "pod",
  reducers: {
    // Replace the default handler with this one that also updates the
    // selected state.
    deleteNotify: (state, action) => {
      const index = state.items.findIndex(
        (item: Pod) => item.id === action.payload
      );
      state.items.splice(index, 1);
      state.selected = state.selected.filter(
        (podId) => podId !== action.payload
      );
      // Clean up the statuses for model.
      delete state.statuses[action.payload];
    },
    fetchSuccess: (state, action) => {
      state.loading = false;
      state.loaded = true;
      action.payload.forEach((newItem: Pod) => {
        // If the item already exists, update it, otherwise
        // add it to the store.
        const existingIdx = state.items.findIndex(
          (draftItem: Pod) => draftItem.id === newItem.id
        );
        if (existingIdx !== -1) {
          state.items[existingIdx] = newItem;
        } else {
          state.items.push(newItem);
          // Set up the statuses for this machine.
          state.statuses[newItem.id] = DEFAULT_STATUSES;
        }
      });
    },
    setSelected: {
      prepare: (podIDs: Pod["id"][]) => ({
        payload: podIDs,
      }),
      reducer: (state, action) => {
        state.selected = action.payload;
      },
    },
    createNotify: (state, action) => {
      // In the event that the server erroneously attempts to create an existing machine,
      // due to a race condition etc., ensure we update instead of creating duplicates.
      const existingIdx = state.items.findIndex(
        (draftItem: Pod) => draftItem.id === action.payload.id
      );
      if (existingIdx !== -1) {
        state.items[existingIdx] = action.payload;
      } else {
        state.items.push(action.payload);
        state.statuses[action.payload.id] = DEFAULT_STATUSES;
      }
    },
    ...generateStatusHandlers<PodState, Pod, "id">("id", [
      {
        status: "compose",
        statusKey: "composing",
        prepare: (params) => params,
      },
      {
        status: "delete",
        statusKey: "deleting",
        prepare: (id) => ({ id }),
      },
      {
        status: "refresh",
        statusKey: "refreshing",
        prepare: (id) => ({ id }),
        success: (state, action) => {
          for (const i in state.items) {
            if (state.items[i].id === action.payload.id) {
              state.items[i] = action.payload;
              return;
            }
          }
        },
      },
    ]),
  },
});

export const { actions } = podSlice;

export default podSlice.reducer;
