import { useCallback, useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router";

import DeviceListControls from "./DeviceListControls";
import DeviceListHeader from "./DeviceListHeader";
import DeviceListTable from "./DeviceListTable";

import Section from "app/base/components/Section";
import { useWindowTitle } from "app/base/hooks";
import type { DeviceHeaderContent } from "app/devices/types";
import { actions as deviceActions } from "app/store/device";
import deviceSelectors from "app/store/device/selectors";
import { FilterDevices } from "app/store/device/utils";
import type { RootState } from "app/store/root/types";

const DeviceList = (): JSX.Element => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const currentFilters = FilterDevices.queryStringToFilters(location.search);
  const [headerContent, setHeaderContent] =
    useState<DeviceHeaderContent | null>(null);
  const [searchFilter, setFilter] = useState(
    // Initialise the filter state from the URL.
    FilterDevices.filtersToString(currentFilters)
  );
  const selectedIDs = useSelector(deviceSelectors.selectedIDs);
  const filteredDevices = useSelector((state: RootState) =>
    deviceSelectors.search(state, searchFilter || null, selectedIDs)
  );
  const devicesLoading = useSelector(deviceSelectors.loading);
  useWindowTitle("Devices");

  useEffect(() => {
    dispatch(deviceActions.fetch());
  }, [dispatch]);

  // Update the URL when filters are changed.
  const setSearchFilter = useCallback(
    (searchText) => {
      setFilter(searchText);
      const filters = FilterDevices.getCurrentFilters(searchText);
      navigate({ search: FilterDevices.filtersToQueryString(filters) });
    },
    [navigate, setFilter]
  );

  return (
    <Section
      header={
        <DeviceListHeader
          headerContent={headerContent}
          setHeaderContent={setHeaderContent}
          setSearchFilter={setSearchFilter}
        />
      }
    >
      <DeviceListControls filter={searchFilter} setFilter={setSearchFilter} />
      <DeviceListTable
        devices={filteredDevices}
        hasFilter={!!searchFilter}
        loading={devicesLoading}
        onSelectedChange={(deviceIDs) => {
          dispatch(deviceActions.setSelected(deviceIDs));
        }}
        selectedIDs={selectedIDs}
      />
    </Section>
  );
};

export default DeviceList;
