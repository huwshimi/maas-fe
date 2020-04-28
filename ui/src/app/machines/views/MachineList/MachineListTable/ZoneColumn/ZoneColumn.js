import { Spinner } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import Tooltip from "app/base/components/Tooltip";
import { machine as machineActions } from "app/base/actions";
import {
  machine as machineSelectors,
  zone as zoneSelectors,
} from "app/base/selectors";
import { generateLegacyURL } from "app/utils";
import DoubleRow from "app/base/components/DoubleRow";

const getSpaces = (machine) => {
  if (machine.spaces.length > 1) {
    const sorted = [...machine.spaces].sort();
    return (
      <Tooltip position="btm-left" message={sorted.join("\n")}>
        <span data-test="spaces">{`${machine.spaces.length} spaces`}</span>
      </Tooltip>
    );
  }
  return <span data-test="spaces">{machine.spaces[0]}</span>;
};

const test = () => {};

const ZoneColumn = ({ onToggleMenu, systemId }) => {
  const dispatch = useDispatch();
  const [updating, setUpdating] = useState(null);
  const machine = useSelector((state) =>
    machineSelectors.getBySystemId(state, systemId)
  );
  const zones = useSelector(zoneSelectors.all);

  let zoneLinks = zones.filter((zone) => zone.id !== machine.zone.id);
  if (machine.actions.includes("set-zone")) {
    if (zoneLinks.length !== 0) {
      zoneLinks = zoneLinks.map((zone) => ({
        children: zone.name,
        onClick: test,
      }));
    } else {
      zoneLinks = [{ children: "No other zones available", disabled: true }];
    }
  } else {
    zoneLinks = [
      { children: "Cannot change zone of this machine", disabled: true },
    ];
  }

  useEffect(() => {
    if (updating !== null && machine.zone.id === updating) {
      setUpdating(null);
    }
  }, [updating, machine.zone.id]);

  return (
    <DoubleRow
      menuLinks={null}
      menuTitle="Change AZ:"
      onToggleMenu={onToggleMenu}
      primary={null}
      secondary={null}
    />
  );
};

ZoneColumn.propTypes = {
  onToggleMenu: PropTypes.func,
  systemId: PropTypes.string.isRequired,
};

export default React.memo(ZoneColumn);
