import { Route, Routes } from "react-router-dom";

import ControllerList from "./ControllerList";

import NotFound from "app/base/views/NotFound";
import controllersURLs from "app/controllers/urls";
import { getRelativeRoute } from "app/utils";

const Controllers = (): JSX.Element => {
  return (
    <Routes>
      <Route
        path={getRelativeRoute(controllersURLs.controllers)}
        element={<ControllerList />}
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Controllers;
