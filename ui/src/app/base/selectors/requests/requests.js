import { createSelector } from "@reduxjs/toolkit";

const requests = {};

requests.all = state => state.requests;

requests._getParams = (state, id) => id;

requests.get = createSelector(
  [requests.all, requests._getParams],
  (items, id) => items[id]
);

export default requests;
