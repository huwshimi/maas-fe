import { useCallback, useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router";

import ControllerListControls from "./ControllerListControls";
import ControllerListHeader from "./ControllerListHeader";
import ControllerListTable from "./ControllerListTable";

import Section from "app/base/components/Section";
import { useWindowTitle } from "app/base/hooks";
import type { ControllerHeaderContent } from "app/controllers/types";
import { actions as controllerActions } from "app/store/controller";
import controllerSelectors from "app/store/controller/selectors";
import { FilterControllers } from "app/store/controller/utils";
import type { RootState } from "app/store/root/types";

const ControllerList = (): JSX.Element => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const currentFilters = FilterControllers.queryStringToFilters(
    location.search
  );
  const [headerContent, setHeaderContent] =
    useState<ControllerHeaderContent | null>(null);
  const [searchFilter, setFilter] = useState(
    // Initialise the filter state from the URL.
    FilterControllers.filtersToString(currentFilters)
  );
  const selectedIDs = useSelector(controllerSelectors.selectedIDs);
  const filteredControllers = useSelector((state: RootState) =>
    controllerSelectors.search(state, searchFilter || null, selectedIDs)
  );
  const controllersLoading = useSelector(controllerSelectors.loading);
  useWindowTitle("Controllers");

  useEffect(() => {
    dispatch(controllerActions.fetch());
  }, [dispatch]);

  // Update the URL when filters are changed.
  const setSearchFilter = useCallback(
    (searchText) => {
      setFilter(searchText);
      const filters = FilterControllers.getCurrentFilters(searchText);
      navigate({ search: FilterControllers.filtersToQueryString(filters) });
    },
    [navigate, setFilter]
  );

  return (
    <Section
      header={
        <ControllerListHeader
          headerContent={headerContent}
          setHeaderContent={setHeaderContent}
          setSearchFilter={setSearchFilter}
        />
      }
    >
      <ControllerListControls
        filter={searchFilter}
        setFilter={setSearchFilter}
      />
      <ControllerListTable
        controllers={filteredControllers}
        hasFilter={!!searchFilter}
        loading={controllersLoading}
        onSelectedChange={(controllerIDs) => {
          dispatch(controllerActions.setSelected(controllerIDs));
        }}
        selectedIDs={selectedIDs}
      />
    </Section>
  );
};

export default ControllerList;
