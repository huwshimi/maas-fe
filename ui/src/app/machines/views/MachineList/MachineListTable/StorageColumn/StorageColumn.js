import { useSelector } from "react-redux";
import React, { useMemo } from "react";
import PropTypes from "prop-types";

import { machine as machineSelectors } from "app/base/selectors";
import { formatBytes } from "app/utils";
import DoubleRow from "app/base/components/DoubleRow";

const StorageColumn = ({ onToggleMenu, systemId }) => {
  const machine = useSelector((state) =>
    machineSelectors.getBySystemId(state, systemId)
  );
  const formattedStorage = useMemo(() => formatBytes(machine.storage, "GB"), [
    machine.storage,
  ]);

  return (
    <DoubleRow
      onToggleMenu={onToggleMenu}
      primary={
        <>
          <span data-test="storage-value">{formattedStorage.value}</span>&nbsp;
          <small className="u-text--light" data-test="storage-unit">
            {formattedStorage.unit}
          </small>
        </>
      }
      primaryClassName="u-align--right"
    />
  );
};

StorageColumn.propTypes = {
  onToggleMenu: PropTypes.func,
  systemId: PropTypes.string.isRequired,
};

export default React.memo(StorageColumn);
