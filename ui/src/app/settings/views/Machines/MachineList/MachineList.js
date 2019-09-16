import React from "react";

import "./MachineList.scss";
import Button from "app/base/components/Button";
import data from "./data.json";
import MainTable from "app/base/components/MainTable";

const sliced = data.slice(0, 200);

const generateRows = machines =>
  machines.map(machine => ({
    columns: [{}, { content: machine.fqdn }, {}, {}, {}, {}, {}, {}, {}, {}, {}]
  }));

const MachineList = () => {
  return (
    <>
      <MainTable
        className="p-table-expanding--light"
        headers={[
          {
            content: (
              <>
                <input type="checkbox" />
                <label></label>
              </>
            )
          },
          {
            className: "p-table-multi-header",
            content: (
              <>
                <Button
                  appearance="link"
                  className="p-table-multi-header__link"
                >
                  FQDN
                </Button>
                <span className="p-table-multi-header__spacer">|</span>
                <Button
                  appearance="link"
                  className="p-table-multi-header__link"
                >
                  MAC
                </Button>
                <span className="p-table-multi-header__spacer">|</span>
                <Button
                  appearance="link"
                  className="p-table-multi-header__link"
                >
                  IP
                </Button>
              </>
            )
          },
          {
            content: "Power"
          },
          {
            content: "Status"
          },
          {
            content: "Owner tags"
          },
          {
            content: "Pool note"
          },
          {
            content: "Zone spaces"
          },
          {
            content: "Fabric vlan"
          },
          {
            content: "Cores arch"
          },
          {
            content: "Ram"
          },
          {
            content: "Disks"
          },
          {
            content: "Storage"
          }
        ]}
        rows={generateRows(sliced)}
      />
    </>
  );
};

export default MachineList;
