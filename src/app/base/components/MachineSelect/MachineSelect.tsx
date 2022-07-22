import { useEffect, useState } from "react";

import { MainTable, SearchBox } from "@canonical/react-components";
import { highlightSubString } from "@canonical/react-components/dist/utils";
import { useDispatch, useSelector } from "react-redux";

import DoubleRow from "app/base/components/DoubleRow";
import type { Machine } from "app/store/machine/types";
import { actions as tagActions } from "app/store/tag";
import tagSelectors from "app/store/tag/selectors";
import type { Tag } from "app/store/tag/types";
import { getTagNamesForIds } from "app/store/tag/utils";

type Props = {
  machines: Machine[];
  onSelect: (machine: Machine | null) => void;
  selected?: Machine | null;
};

const generateRows = (
  machines: Machine[],
  searchText: string,
  onRowClick: (machine: Machine) => void,
  tags: Tag[]
) => {
  const highlightedText = (text: string) => (
    <span
      dangerouslySetInnerHTML={{
        __html: highlightSubString(text, searchText).text,
      }}
      data-testid={`source-machine-${text}`}
    />
  );
  return machines.map((machine) => ({
    className: "source-machine-select__row",
    columns: [
      {
        content: (
          <DoubleRow
            primary={highlightedText(machine.hostname)}
            secondary={highlightedText(machine.system_id)}
          />
        ),
      },
      {
        content: (
          <DoubleRow
            primary={machine.owner || "-"}
            secondary={
              machine.tags.length
                ? highlightedText(
                    getTagNamesForIds(machine.tags, tags).join(", ")
                  )
                : "-"
            }
          />
        ),
      },
    ],
    "data-testid": "source-machine-row",
    onClick: () => onRowClick(machine),
  }));
};

export const MachineSelect = ({
  machines,
  onSelect,
  selected = null,
  ...wrapperProps
}: Props): JSX.Element => {
  const dispatch = useDispatch();
  const tags = useSelector(tagSelectors.all);
  const [searchText, setSearchText] = useState("");
  // We filter by a subset of machine parameters rather than using the search
  // selector, because the search selector will match parameters that aren't
  // included in the machine selection table.
  const filteredMachines = machines.filter(
    (machine) =>
      machine.system_id.includes(searchText) ||
      machine.hostname.includes(searchText) ||
      getTagNamesForIds(machine.tags, tags).join(", ").includes(searchText)
  );

  useEffect(() => {
    dispatch(tagActions.fetch());
  }, [dispatch]);

  return (
    <div {...wrapperProps}>
      <SearchBox
        externallyControlled
        onChange={(searchText: string) => {
          setSearchText(searchText);
          // Unset the selected machine if the search input changes - assume
          // the user wants to change it.
          if (selected) {
            onSelect(null);
          }
        }}
        placeholder="Search by hostname, system ID or tags"
        value={searchText}
      />
      {selected ? null : (
        <div className="source-machine-select__table">
          <MainTable
            emptyStateMsg="No machines match the search criteria."
            headers={[
              {
                content: (
                  <>
                    <div>Hostname</div>
                    <div>system_id</div>
                  </>
                ),
              },
              {
                content: (
                  <>
                    <div>Owner</div>
                    <div>Tags</div>
                  </>
                ),
              },
            ]}
            rows={generateRows(
              filteredMachines,
              searchText,
              (machine) => {
                setSearchText(machine.hostname);
                onSelect(machine);
              },
              tags
            )}
          />
        </div>
      )}
    </div>
  );
};

export default MachineSelect;
