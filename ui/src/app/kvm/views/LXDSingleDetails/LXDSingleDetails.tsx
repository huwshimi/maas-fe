import { useState } from "react";

import { useSelector } from "react-redux";
import {
  Navigate,
  Route,
  Routes,
  useNavigate,
  useLocation,
} from "react-router-dom";

import LXDSingleDetailsHeader from "./LXDSingleDetailsHeader";
import LXDSingleResources from "./LXDSingleResources";
import LXDSingleSettings from "./LXDSingleSettings";
import LXDSingleVMs from "./LXDSingleVMs";

import ModelNotFound from "app/base/components/ModelNotFound";
import Section from "app/base/components/Section";
import { useGetURLId } from "app/base/hooks/urls";
import type { SetSearchFilter } from "app/base/types";
import { useActivePod, useKVMDetailsRedirect } from "app/kvm/hooks";
import type { KVMHeaderContent } from "app/kvm/types";
import kvmURLs from "app/kvm/urls";
import { FilterMachines } from "app/store/machine/utils";
import podSelectors from "app/store/pod/selectors";
import { PodMeta } from "app/store/pod/types";
import type { RootState } from "app/store/root/types";
import { isId } from "app/utils";

const LXDSingleDetails = (): JSX.Element => {
  const navigate = useNavigate();
  const location = useLocation();
  const id = useGetURLId(PodMeta.PK);
  const pod = useSelector((state: RootState) =>
    podSelectors.getById(state, id)
  );
  const loading = useSelector(podSelectors.loading);
  // Search filter is determined by the URL and used to initialise state.
  const currentFilters = FilterMachines.queryStringToFilters(location.search);
  const [searchFilter, setFilter] = useState<string>(
    FilterMachines.filtersToString(currentFilters)
  );
  const [headerContent, setHeaderContent] = useState<KVMHeaderContent | null>(
    null
  );
  useActivePod(id);
  const redirectURL = useKVMDetailsRedirect(id);

  const setSearchFilter: SetSearchFilter = (searchFilter: string) => {
    setFilter(searchFilter);
    const filters = FilterMachines.getCurrentFilters(searchFilter);
    navigate({ search: FilterMachines.filtersToQueryString(filters) });
  };

  if (redirectURL) {
    return <Navigate replace to={redirectURL} />;
  }
  if (!isId(id) || (!loading && !pod)) {
    return (
      <ModelNotFound id={id} linkURL={kvmURLs.lxd.index} modelName="LXD host" />
    );
  }
  return (
    <Section
      header={
        <LXDSingleDetailsHeader
          id={id}
          headerContent={headerContent}
          setHeaderContent={setHeaderContent}
          setSearchFilter={setSearchFilter}
        />
      }
    >
      {pod && (
        <Routes>
          <Route
            path={kvmURLs.lxd.single.vms(null, true)}
            element={
              <LXDSingleVMs
                id={id}
                searchFilter={searchFilter}
                setSearchFilter={setSearchFilter}
                setHeaderContent={setHeaderContent}
              />
            }
          />
          <Route
            path={kvmURLs.lxd.single.resources(null, true)}
            element={<LXDSingleResources id={id} />}
          />
          <Route
            path={kvmURLs.lxd.single.edit(null, true)}
            element={
              <LXDSingleSettings id={id} setHeaderContent={setHeaderContent} />
            }
          />
          <Route path={kvmURLs.lxd.single.index(null, true)}>
            <Navigate replace to={kvmURLs.lxd.single.vms(null, true)} />
          </Route>
        </Routes>
      )}
    </Section>
  );
};

export default LXDSingleDetails;
