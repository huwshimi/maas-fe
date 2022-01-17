import { Navigate, Route, Routes } from "react-router-dom";

import DeviceDetails from "./devices/views/DeviceDetails";
import DeviceList from "./devices/views/DeviceList";
import DomainDetails from "./domains/views/DomainDetails";
import DomainsList from "./domains/views/DomainsList";

import ErrorBoundary from "app/base/components/ErrorBoundary";
import baseURLs from "app/base/urls";
import NotFound from "app/base/views/NotFound";
import controllersURLs from "app/controllers/urls";
import Controllers from "app/controllers/views/Controllers";
import dashboardURLs from "app/dashboard/urls";
import Dashboard from "app/dashboard/views/Dashboard";
import devicesURLs from "app/devices/urls";
import domainsURLs from "app/domains/urls";
import imagesURLs from "app/images/urls";
import Images from "app/images/views/Images";
import introURLs from "app/intro/urls";
import Intro from "app/intro/views/Intro";
import kvmURLs from "app/kvm/urls";
import KVM from "app/kvm/views/KVM";
import machineURLs from "app/machines/urls";
import MachineDetails from "app/machines/views/MachineDetails";
import Machines from "app/machines/views/Machines";
import poolsURLs from "app/pools/urls";
import prefsURLs from "app/preferences/urls";
import Preferences from "app/preferences/views/Preferences";
import settingsURLs from "app/settings/urls";
import Settings from "app/settings/views/Settings";
import subnetsURLs from "app/subnets/urls";
import Subnets from "app/subnets/views/Subnets";
import zonesURLs from "app/zones/urls";
import Zones from "app/zones/views/Zones";

const AppRoutes = (): JSX.Element => (
  <Routes>
    <Route
      path={`${baseURLs.index}/*`}
      element={<Navigate replace to={machineURLs.machines.index} />}
    />
    <Route
      path={`${introURLs.index}/*`}
      element={
        <ErrorBoundary>
          <Intro />
        </ErrorBoundary>
      }
    />
    <Route
      path={`${prefsURLs.prefs}/*`}
      element={
        <ErrorBoundary>
          <Preferences />
        </ErrorBoundary>
      }
    />
    <Route
      path={`${controllersURLs.controllers.index}/*`}
      element={
        <ErrorBoundary>
          <Controllers />
        </ErrorBoundary>
      }
    />
    <Route
      path={`${devicesURLs.devices.index}/*`}
      element={
        <ErrorBoundary>
          <DeviceList />
        </ErrorBoundary>
      }
    />
    <Route
      path={`${devicesURLs.device.index(null, true)}/*`}
      element={
        <ErrorBoundary>
          <DeviceDetails />
        </ErrorBoundary>
      }
    />
    <Route
      path={`${domainsURLs.domains.index}/*`}
      element={
        <ErrorBoundary>
          <DomainsList />
        </ErrorBoundary>
      }
    />
    <Route
      path={`${domainsURLs.domain.index(null, true)}/*`}
      element={
        <ErrorBoundary>
          <DomainDetails />
        </ErrorBoundary>
      }
    />
    <Route
      path={`${imagesURLs.index}/*`}
      element={
        <ErrorBoundary>
          <Images />
        </ErrorBoundary>
      }
    />
    <Route
      path={`${kvmURLs.index}/*`}
      element={
        <ErrorBoundary>
          <KVM />
        </ErrorBoundary>
      }
    />
    {[machineURLs.machines.index, poolsURLs.index].map((path) => (
      <Route
        key={path}
        path={`${path}/*`}
        element={
          <ErrorBoundary>
            <Machines />
          </ErrorBoundary>
        }
      />
    ))}
    <Route
      path={`${machineURLs.machine.index(null, true)}/*`}
      element={
        <ErrorBoundary>
          <MachineDetails />
        </ErrorBoundary>
      }
    />
    <Route
      path={`${settingsURLs.index}/*`}
      element={
        <ErrorBoundary>
          <Settings />
        </ErrorBoundary>
      }
    />
    <Route
      path={`${subnetsURLs.index}/*`}
      element={
        <ErrorBoundary>
          <Subnets />
        </ErrorBoundary>
      }
    />
    {[zonesURLs.index, zonesURLs.details(null, true)].map((path) => (
      <Route
        key={path}
        path={`${path}/*`}
        element={
          <ErrorBoundary>
            <Zones />
          </ErrorBoundary>
        }
      />
    ))}
    <Route
      path={`${dashboardURLs.index}/*`}
      element={
        <ErrorBoundary>
          <Dashboard />
        </ErrorBoundary>
      }
    />
    <Route path="*" element={<NotFound includeSection />} />
  </Routes>
);

export default AppRoutes;
