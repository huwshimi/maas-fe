import { Route, Routes } from "react-router-dom";

import NotFound from "app/base/views/NotFound";
import imagesURLs from "app/images/urls";
import ImageList from "app/images/views/ImageList";
import { getRelativeRoute } from "app/utils";

const Images = (): JSX.Element => {
  return (
    <Routes>
      <Route path={getRelativeRoute(imagesURLs)} element={<ImageList />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Images;
