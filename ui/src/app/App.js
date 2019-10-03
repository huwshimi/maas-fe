import { useDispatch, useSelector } from "react-redux";
import React, { useEffect } from "react";

import { websocket } from "./base/actions";
import Main from "app/base/components/Main";
import Section from "app/base/components/Section";
import Login from "app/base/components/Login";
import { status } from "./base/selectors";

export const App = () => {
  const connected = useSelector(status.connected);
  const connectionError = useSelector(status.error);
  const dispatch = useDispatch();

  useEffect(() => {
    // Connect the websocket before anything else in the app can be done.
    dispatch(websocket.connect());
  }, [dispatch]);

  if (!connected) {
    return <Login />;
  }
  // Anything that needs to a websocket connection can be done in Main
  // and children.
  return <Main />;
};

export default App;
