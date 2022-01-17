import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import {
  Navigate,
  Route,
  Routes,
  useNavigate,
  useLocation,
} from "react-router-dom";

import LXDClusterDetailsHeader from "./LXDClusterDetailsHeader";
import LXDClusterHostSettings from "./LXDClusterHostSettings";
import LXDClusterHostVMs from "./LXDClusterHostVMs";
import LXDClusterHosts from "./LXDClusterHosts";
import LXDClusterResources from "./LXDClusterResources";
import LXDClusterSettings from "./LXDClusterSettings";
import LXDClusterVMs from "./LXDClusterVMs";

import ModelNotFound from "app/base/components/ModelNotFound";
import Section from "app/base/components/Section";
import { useCycled } from "app/base/hooks";
import { useGetURLId } from "app/base/hooks/urls";
import type { SetSearchFilter } from "app/base/types";
import type { KVMHeaderContent } from "app/kvm/types";
import kvmURLs from "app/kvm/urls";
import { FilterMachines } from "app/store/machine/utils";
import { actions as podActions } from "app/store/pod";
import podSelectors from "app/store/pod/selectors";
import { PodMeta } from "app/store/pod/types";
import type { RootState } from "app/store/root/types";
import { actions as vmClusterActions } from "app/store/vmcluster";
import vmClusterSelectors from "app/store/vmcluster/selectors";
import { VMClusterMeta } from "app/store/vmcluster/types";
import { isId } from "app/utils";

const LXDClusterDetails = (): JSX.Element => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const clusterId = useGetURLId(VMClusterMeta.PK, "clusterId");
  const hostId = useGetURLId(PodMeta.PK, "hostId");
  const cluster = useSelector((state: RootState) =>
    vmClusterSelectors.getById(state, clusterId)
  );
  const clustersLoaded = useSelector(vmClusterSelectors.loaded);
  const getting = useSelector((state: RootState) =>
    vmClusterSelectors.status(state, "getting")
  );
  const [fetched] = useCycled(getting);
  const loaded = clustersLoaded || fetched;
  const host = useSelector((state: RootState) =>
    podSelectors.getById(state, hostId)
  );
  const hostsLoaded = useSelector(podSelectors.loaded);
  const [headerContent, setHeaderContent] = useState<KVMHeaderContent | null>(
    null
  );

  // Search filter is determined by the URL and used to initialise state.
  const currentFilters = FilterMachines.queryStringToFilters(location.search);
  const [searchFilter, setFilter] = useState<string>(
    FilterMachines.filtersToString(currentFilters)
  );

  const setSearchFilter: SetSearchFilter = (searchFilter: string) => {
    setFilter(searchFilter);
    const filters = FilterMachines.getCurrentFilters(searchFilter);
    navigate({ search: FilterMachines.filtersToQueryString(filters) });
  };

  useEffect(() => {
    dispatch(podActions.fetch());
    if (isId(clusterId)) {
      dispatch(vmClusterActions.get(clusterId));
    }
  }, [clusterId, dispatch]);

  if (!isId(clusterId) || (loaded && !cluster)) {
    return (
      <ModelNotFound
        id={clusterId}
        linkText="View all LXD hosts"
        linkURL={kvmURLs.lxd.index}
        modelName="LXD cluster"
      />
    );
  }
  if (hostId !== null && hostsLoaded && !host) {
    return (
      <ModelNotFound
        id={hostId}
        linkText="View all LXD hosts in this cluster"
        linkURL={kvmURLs.lxd.cluster.hosts({ clusterId })}
        modelName="LXD host"
      />
    );
  }

  return (
    <Section
      header={
        <LXDClusterDetailsHeader
          clusterId={clusterId}
          headerContent={headerContent}
          setHeaderContent={setHeaderContent}
          setSearchFilter={setSearchFilter}
        />
      }
    >
      <Routes>
        <Route
          path={kvmURLs.lxd.cluster.hosts(null, true)}
          element={
            <LXDClusterHosts
              clusterId={clusterId}
              setHeaderContent={setHeaderContent}
            />
          }
        />
        <Route
          path={kvmURLs.lxd.cluster.vms.index(null, true)}
          element={
            <LXDClusterVMs
              clusterId={clusterId}
              searchFilter={searchFilter}
              setHeaderContent={setHeaderContent}
              setSearchFilter={setSearchFilter}
            />
          }
        />
        <Route
          path={kvmURLs.lxd.cluster.resources(null, true)}
          element={<LXDClusterResources clusterId={clusterId} />}
        />
        <Route
          path={kvmURLs.lxd.cluster.edit(null, true)}
          element={
            <LXDClusterSettings
              clusterId={clusterId}
              setHeaderContent={setHeaderContent}
            />
          }
        />
        <Route
          path={kvmURLs.lxd.cluster.vms.host(null, true)}
          element={
            <>
              {hostId !== null && (
                <LXDClusterHostVMs
                  clusterId={clusterId}
                  hostId={hostId}
                  searchFilter={searchFilter}
                  setHeaderContent={setHeaderContent}
                  setSearchFilter={setSearchFilter}
                />
              )}
            </>
          }
        />
        <Route
          path={kvmURLs.lxd.cluster.host.edit(null, true)}
          element={
            <>
              {hostId !== null && (
                <LXDClusterHostSettings clusterId={clusterId} hostId={hostId} />
              )}
            </>
          }
        />
        <Route path={kvmURLs.lxd.cluster.index(null, true)}>
          <Navigate replace to={kvmURLs.lxd.cluster.hosts(null, true)} />
        </Route>
        <Route path={kvmURLs.lxd.cluster.host.index(null, true)}>
          <Navigate replace to={kvmURLs.lxd.cluster.host.edit(null, true)} />
        </Route>
      </Routes>
    </Section>
  );
};

export default LXDClusterDetails;
