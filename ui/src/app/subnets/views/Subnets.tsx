import { Route, Routes } from "react-router-dom";

import NotFound from "app/base/views/NotFound";
import subnetsURLs from "app/subnets/urls";
import SubnetsList from "app/subnets/views/SubnetsList";

const SubnetsRoutes = (): JSX.Element => {
  return (
    <Routes>
      <Route path={subnetsURLs.index} children={SubnetsList} />
      <Route path="*" children={NotFound} />
    </Routes>
  );
};

export default SubnetsRoutes;
