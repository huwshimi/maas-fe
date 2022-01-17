import { Route, Routes } from "react-router-dom";

import NotFound from "app/base/views/NotFound";
import zonesURLs from "app/zones/urls";
import ZoneDetails from "app/zones/views/ZoneDetails";
import ZonesList from "app/zones/views/ZonesList";

const Zones = (): JSX.Element => {
  return (
    <Routes>
      <Route path={zonesURLs.index} element={<ZonesList />} />
      <Route path={zonesURLs.details(null, true)} element={<ZoneDetails />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Zones;
