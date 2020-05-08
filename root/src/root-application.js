/* eslint-disable no-unused-vars */
/* eslint-disable func-names */
/* global window legacyApp */
import {
  registerApplication,
  start,
  setBootstrapMaxTime,
  setMountMaxTime,
  setUnmountMaxTime,
  setUnloadMaxTime,
} from "single-spa";

function showWhenAnyOf(routes) {
  return function (location) {
    return routes.some((route) => location.pathname === route);
  };
}

function showWhenPrefix(routes) {
  return function (location) {
    return routes.some((route) => location.pathname.startsWith(route));
  };
}

function showExcept(routes) {
  return function (location) {
    return routes.every((route) => location.pathname !== route);
  };
}

// setBootstrapMaxTime(3000, false);
// setMountMaxTime(3000, false);
// setUnmountMaxTime(3000, false);
// setUnloadMaxTime(3000, false);

registerApplication({
  name: "legacy",
  app: () => import("@maas-ui/maas-ui-legacy"),
  activeWhen: "/MAAS/",
});

start();
