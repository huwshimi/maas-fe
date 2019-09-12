import { call, put, takeLatest } from "redux-saga/effects";

import getCookie from "./utils";

const SCRIPTS_API = `/MAAS/api/2.0/scripts/`;
const CSRF_URL = "/MAAS/account/csrf/";

const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
  Accept: "application/json"
};

export const api = {
  csrf: {
    fetch: () => {
      return fetch(CSRF_URL, {
        method: "POST"
      }).then(response => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response.json();
      });
    }
  },
  scripts: {
    fetch: csrftoken => {
      const headers = { ...DEFAULT_HEADERS, "X-CSRFToken": csrftoken };
      return fetch(`${SCRIPTS_API}?include_script=true`, { headers }).then(
        response => {
          if (!response.ok) {
            throw Error(response.statusText);
          }
          return response.json();
        }
      );
    },
    delete: (csrftoken, name) => {
      const headers = { ...DEFAULT_HEADERS, "X-CSRFToken": csrftoken };
      return fetch(`${SCRIPTS_API}${name}`, {
        method: "DELETE",
        headers
      }).then(response => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
      });
    }
  }
};

export function* fetchCSRFToken() {
  let response;
  try {
    yield put({ type: `FETCH_CSRF_TOKEN_START` });
    response = yield call(api.csrf.fetch);
    yield put({
      type: `FETCH_CSRF_TOKEN_SUCCESS`,
      payload: response
    });
  } catch (error) {
    yield put({
      type: `FETCH_CSRF_TOKEN_ERROR`,
      error: error.message
    });
  }
}

export function* fetchScriptsSaga() {
  const csrftoken = yield call(getCookie, "csrftoken");
  let response;
  try {
    yield put({ type: `FETCH_SCRIPTS_START` });
    response = yield call(api.scripts.fetch, csrftoken);
    yield put({
      type: `FETCH_SCRIPTS_SUCCESS`,
      payload: response
    });
  } catch (error) {
    yield put({
      type: `FETCH_SCRIPTS_ERROR`,
      error: error.message
    });
  }
}

export function* deleteScriptSaga(action) {
  const csrftoken = yield call(getCookie, "csrftoken");
  try {
    yield put({ type: `DELETE_SCRIPT_START` });
    yield call(api.scripts.delete, csrftoken, action.payload.name);
    yield put({
      type: `DELETE_SCRIPT_SUCCESS`,
      payload: action.payload.id
    });
  } catch (error) {
    yield put({
      type: `DELETE_SCRIPT_ERROR`,
      error: error.message
    });
  }
}

export function* watchFetchCSRF() {
  yield takeLatest("FETCH_CSRF_TOKEN", fetchCSRFToken);
}

export function* watchFetchScripts() {
  yield takeLatest("FETCH_SCRIPTS", fetchScriptsSaga);
}

export function* watchDeleteScript() {
  yield takeLatest("DELETE_SCRIPT", deleteScriptSaga);
}
