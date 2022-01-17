import { useCallback, useEffect, useState } from "react";

import { usePrevious } from "@canonical/react-components/dist/hooks";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";

import MachineListHeader from "./MachineList/MachineListHeader";

import Section from "app/base/components/Section";
import NotFound from "app/base/views/NotFound";
import type { MachineHeaderContent } from "app/machines/types";
import machineURLs from "app/machines/urls";
import MachineList from "app/machines/views/MachineList";
import poolsURLs from "app/pools/urls";
import PoolAdd from "app/pools/views/PoolAdd";
import PoolEdit from "app/pools/views/PoolEdit";
import Pools from "app/pools/views/Pools";
import { FilterMachines } from "app/store/machine/utils";
import { getRelativeRoute } from "app/utils";

const Machines = (): JSX.Element => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentFilters = FilterMachines.queryStringToFilters(location.search);
  // The filter state is initialised from the URL.
  const [searchFilter, setFilter] = useState(
    FilterMachines.filtersToString(currentFilters)
  );
  const [headerContent, setHeaderContent] =
    useState<MachineHeaderContent | null>(null);
  const actionSelected = headerContent?.view[0] === "machineActionForm";
  const previousPath = usePrevious(location.pathname);
  const previousActionSelected = usePrevious(actionSelected);
  const isShowingMachines = location.pathname === machineURLs.machines.index;

  const setSearchFilter = useCallback(
    (searchText) => {
      setFilter(searchText);
      const filters = FilterMachines.getCurrentFilters(searchText);
      navigate({ search: FilterMachines.filtersToQueryString(filters) });
    },
    [navigate, setFilter]
  );

  useEffect(() => {
    // When the page changes (e.g. /pools -> /machines) then update the filters.
    if (location.pathname !== previousPath) {
      setFilter(FilterMachines.filtersToString(currentFilters));
    }
  }, [location.pathname, currentFilters, previousPath]);

  useEffect(() => {
    if (actionSelected !== previousActionSelected) {
      const filters = FilterMachines.getCurrentFilters(searchFilter);
      const newFilters = FilterMachines.toggleFilter(
        filters,
        "in",
        "selected",
        false,
        actionSelected
      );
      setSearchFilter(FilterMachines.filtersToString(newFilters));
    }
  }, [actionSelected, previousActionSelected, searchFilter, setSearchFilter]);

  return (
    <Section
      header={
        <MachineListHeader
          headerContent={headerContent}
          setSearchFilter={setSearchFilter}
          setHeaderContent={setHeaderContent}
        />
      }
    >
      <Routes>
        {isShowingMachines ? (
          <Route
            path={getRelativeRoute(machineURLs.machines)}
            element={
              <MachineList
                headerFormOpen={!!headerContent}
                searchFilter={searchFilter}
                setSearchFilter={setSearchFilter}
              />
            }
          />
        ) : (
          <>
            <Route path={getRelativeRoute(poolsURLs)} element={<Pools />} />
            <Route
              path={getRelativeRoute(poolsURLs, "add")}
              element={<PoolAdd />}
            />
            <Route
              path={getRelativeRoute(poolsURLs, "edit")}
              element={<PoolEdit />}
            />
          </>
        )}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Section>
  );
};

export default Machines;
