import { Route, Routes } from "react-router-dom";

import KVMList from "./KVMList";
import LXDClusterDetails from "./LXDClusterDetails";
import LXDSingleDetails from "./LXDSingleDetails";
import VirshDetails from "./VirshDetails";

import NotFound from "app/base/views/NotFound";
import kvmURLs from "app/kvm/urls";
import { getRelativeRoute } from "app/utils";

const KVM = (): JSX.Element => {
  return (
    <Routes>
      {[
        getRelativeRoute(kvmURLs),
        getRelativeRoute(kvmURLs.lxd),
        getRelativeRoute(kvmURLs.virsh),
      ].map((path) => (
        <Route key={path} path={path} element={<KVMList />} />
      ))}
      <Route
        path={`${getRelativeRoute(kvmURLs.lxd.cluster)}/*`}
        element={<LXDClusterDetails />}
      />
      <Route
        path={`${getRelativeRoute(kvmURLs.lxd.single)}/*`}
        element={<LXDSingleDetails />}
      />
      <Route
        path={`${getRelativeRoute(kvmURLs.virsh.details)}/*`}
        element={<VirshDetails />}
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default KVM;
