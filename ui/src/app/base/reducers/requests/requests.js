import { createReducer } from "@reduxjs/toolkit";

const initialState = {};

const requests = createReducer(initialState, {
  REQUEST_SUCCESS: (state, { payload }) => {
    if (payload.result && payload.result.id) {
      state[payload.request_id] = payload.result.id;
    }
  }
});

export default requests;
