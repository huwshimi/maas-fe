import { Link } from "react-router-dom";
import classNames from "classnames";
import PropTypes from "prop-types";
import React from "react";

import "./SettingsTable.scss";
import Button from "app/base/components/Button";
import Loader from "app/base/components/Loader";
import MainTable from "app/base/components/MainTable";
import SearchBox from "app/base/components/SearchBox";

export const SettingsTable = ({
  buttons,
  defaultSort,
  headers,
  loaded,
  loading,
  rows,
  searchOnChange,
  searchPlaceholder,
  searchText,
  tableClassName
}) => {
  return (
    <div className="settings-table">
      <div className="p-table-actions">
        {searchOnChange ? (
          <SearchBox
            onChange={searchOnChange}
            placeholder={searchPlaceholder}
            value={searchText}
          />
        ) : (
          <div className="p-table-actions__space-left"></div>
        )}
        {buttons.map(({ label, url }) => (
          <Button element={Link} to={url} key={url}>
            {label}
          </Button>
        ))}
      </div>
      {loading && (
        <div className="settings-table__loader">
          <Loader />
        </div>
      )}
      {loaded && (
        <MainTable
          className={classNames("p-table-expanding--light", tableClassName)}
          defaultSort={defaultSort}
          defaultSortDirection="ascending"
          expanding={true}
          headers={headers}
          paginate={20}
          rows={rows}
          sortable
        />
      )}
    </div>
  );
};

SettingsTable.propTypes = {
  buttons: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired
    })
  ).isRequired,
  defaultSort: PropTypes.string,
  headers: PropTypes.array,
  loaded: PropTypes.bool,
  loading: PropTypes.bool,
  rows: PropTypes.array,
  searchOnChange: PropTypes.func,
  searchPlaceholder: PropTypes.string,
  searchText: PropTypes.string,
  tableClassName: PropTypes.string
};

export default SettingsTable;
