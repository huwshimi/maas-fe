import { Link } from "react-router-dom";
import { Loader, Notification } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect } from "react";

import {
  auth as authActions,
  general as generalActions
} from "app/base/actions";
import { general as generalSelectors } from "app/base/selectors";
import { auth as authSelectors } from "app/base/selectors";
import { config as configActions } from "app/settings/actions";
import { config as configSelectors } from "app/settings/selectors";
import { Footer, Header } from "@maas-ui/shared";
import { status } from "app/base/selectors";
import { status as statusActions } from "app/base/actions";
import { useLocation } from "app/base/hooks";
import { websocket } from "./base/actions";
import Login from "app/base/components/Login";
import Routes from "app/Routes";
import Section from "app/base/components/Section";

export const App = () => {
  const { location } = useLocation();
  const authUser = useSelector(authSelectors.get);
  const authenticated = useSelector(status.authenticated);
  const authenticating = useSelector(status.authenticating);
  const connected = useSelector(status.connected);
  const connecting = useSelector(status.connecting);
  const connectionError = useSelector(status.error);
  const analyticsEnabled = useSelector(configSelectors.analyticsEnabled);
  const authLoading = useSelector(authSelectors.loading);
  const navigationOptions = useSelector(generalSelectors.navigationOptions.get);
  const version = useSelector(generalSelectors.version.get);
  const maasName = useSelector(configSelectors.maasName);
  const completedIntro = useSelector(configSelectors.completedIntro);
  const dispatch = useDispatch();
  const basename = process.env.REACT_APP_BASENAME;
  const debug = process.env.NODE_ENV === "development";

  useEffect(() => {
    dispatch(statusActions.checkAuthenticated());
  }, [dispatch]);

  useEffect(() => {
    if (authenticated) {
      // Connect the websocket before anything else in the app can be done.
      dispatch(websocket.connect());
    }
  }, [dispatch, authenticated]);

  useEffect(() => {
    if (connected) {
      dispatch(authActions.fetch());
      dispatch(generalActions.fetchVersion());
      dispatch(generalActions.fetchNavigationOptions());
      // Fetch the config at the top so we can access the MAAS name for the
      // window title.
      dispatch(configActions.fetch());
    }
  }, [dispatch, connected]);

  // Explicitly check that completedIntro is false so that it doesn't redirect
  // if the config isn't defined yet.
  if (completedIntro === false) {
    window.location = `${basename}/#/intro`;
  } else if (authUser && !authUser.completed_intro) {
    window.location = `${basename}/#/intro/user`;
  }

  let content;
  if (authLoading || connecting || authenticating) {
    content = (
      <Section
        title={
          <Loader
            className="u-align--left u-no-padding--left"
            text="Loading..."
          />
        }
      />
    );
  } else if (!authenticated) {
    content = <Login />;
  } else if (connectionError) {
    content = (
      <Section title="Failed to connect.">
        <Notification type="negative" status="Error:">
          The websocket failed to connect with the error "{connectionError}".
        </Notification>
      </Section>
    );
  } else if (connected) {
    content = <Routes />;
  }

  return (
    <>
      <Header
        authUser={authUser}
        basename={process.env.REACT_APP_BASENAME}
        completedIntro={completedIntro && authUser && authUser.completed_intro}
        enableAnalytics={!debug && analyticsEnabled}
        generateLocalLink={(url, label, linkClass) => (
          <Link className={linkClass} to={url}>
            {label}
          </Link>
        )}
        location={location}
        logout={() => {
          dispatch(statusActions.logout());
        }}
        showRSD={navigationOptions.rsd}
      />
      {content}
      {maasName && version && (
        <Footer debug={debug} maasName={maasName} version={version} />
      )}
    </>
  );
};

export default App;
