import PropTypes from "prop-types";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { general as generalActions } from "app/base/actions";
import {
  general as generalSelectors,
  machine as machineSelectors,
} from "app/base/selectors";
import ContextualMenu from "app/base/components/ContextualMenu";
import Tooltip from "app/base/components/Tooltip";

const getTakeActionLinks = (actionOptions, machines, setSelectedAction) => {
  const initGroups = [
    { type: "lifecycle", items: [] },
    { type: "power", items: [] },
    { type: "testing", items: [] },
    { type: "lock", items: [] },
    { type: "misc", items: [] },
  ];

  const groupedLinks = actionOptions.reduce((groups, option) => {
    const count = machines.reduce((sum, machine) => {
      if (machine.actions.includes(option.name)) {
        sum += 1;
      }
      return sum;
    }, 0);

    if (count > 0 || option.type === "lifecycle") {
      const group = groups.find((group) => group.type === option.type);
      group.items.push({
        children: (
          <div className="u-flex-between">
            <span data-test={`action-title-${option.name}`}>
              {option.title}
            </span>
            {machines.length > 1 && (
              <span
                data-test={`action-count-${option.name}`}
                style={{ marginLeft: ".5rem" }}
              >
                {count || ""}
              </span>
            )}
          </div>
        ),
        disabled: count === 0,
        onClick: () => setSelectedAction(option),
      });
    }
    return groups;
  }, initGroups);

  return groupedLinks.map((group) => group.items);
};

export const TakeActionMenu = ({ setSelectedAction }) => {
  const dispatch = useDispatch();
  const actionOptions = useSelector(generalSelectors.machineActions.get);
  const selectedMachines = useSelector(machineSelectors.selected);

  useEffect(() => {
    dispatch(generalActions.fetchMachineActions());
  }, [dispatch]);

  return (
    <Tooltip
      message={
        !selectedMachines.length &&
        "Select machines below to perform an action."
      }
      position="left"
    >
      <ContextualMenu
        data-test="take-action-dropdown"
        hasToggleIcon
        links={getTakeActionLinks(
          actionOptions,
          selectedMachines,
          setSelectedAction
        )}
        position="right"
        toggleAppearance="positive"
        toggleDisabled={!selectedMachines.length}
        toggleLabel="Take action"
      />
    </Tooltip>
  );
};

TakeActionMenu.propTypes = {
  setSelectedAction: PropTypes.func.isRequired,
};

export default React.memo(TakeActionMenu);
