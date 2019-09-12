import { all } from "redux-saga/effects";

import {
  watchDeleteScript,
  watchFetchCSRF,
  watchFetchScripts,
  watchWebSockets
} from "./app/base/sagas";

export default function* rootSaga() {
  yield all([
    watchWebSockets(),
    watchFetchScripts(),
    watchDeleteScript(),
    watchFetchCSRF()
  ]);
}
