import { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";

import DomainListHeader from "./DomainListHeader";
import DomainsTable from "./DomainsTable";

import Section from "app/base/components/Section";
import { useWindowTitle } from "app/base/hooks";
import domainsURLs from "app/domains/urls";
import { actions } from "app/store/domain";
import domainsSelectors from "app/store/domain/selectors";
import { getRelativeRoute } from "app/utils";

const DomainsList = (): JSX.Element => {
  const dispatch = useDispatch();
  const domains = useSelector(domainsSelectors.all);

  useWindowTitle("DNS");

  useEffect(() => {
    dispatch(actions.fetch());
  }, [dispatch]);

  return (
    <Section header={<DomainListHeader />}>
      <Routes>
        <Route
          path={getRelativeRoute(domainsURLs.domains)}
          element={<>{domains.length > 0 && <DomainsTable />}</>}
        />
      </Routes>
    </Section>
  );
};

export default DomainsList;
