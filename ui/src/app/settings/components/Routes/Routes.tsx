import { Route, Navigate, Routes } from "react-router-dom";

import NotFound from "app/base/views/NotFound";
import settingsURLs from "app/settings/urls";
import Commissioning from "app/settings/views/Configuration/Commissioning";
import Deploy from "app/settings/views/Configuration/Deploy";
import General from "app/settings/views/Configuration/General";
import KernelParameters from "app/settings/views/Configuration/KernelParameters";
import DhcpAdd from "app/settings/views/Dhcp/DhcpAdd";
import DhcpEdit from "app/settings/views/Dhcp/DhcpEdit";
import DhcpList from "app/settings/views/Dhcp/DhcpList";
import ThirdPartyDrivers from "app/settings/views/Images/ThirdPartyDrivers";
import VMWare from "app/settings/views/Images/VMWare";
import Windows from "app/settings/views/Images/Windows";
import LicenseKeyAdd from "app/settings/views/LicenseKeys/LicenseKeyAdd";
import LicenseKeyEdit from "app/settings/views/LicenseKeys/LicenseKeyEdit";
import LicenseKeyList from "app/settings/views/LicenseKeys/LicenseKeyList";
import DnsForm from "app/settings/views/Network/DnsForm";
import NetworkDiscoveryForm from "app/settings/views/Network/NetworkDiscoveryForm";
import NtpForm from "app/settings/views/Network/NtpForm";
import ProxyForm from "app/settings/views/Network/ProxyForm";
import SyslogForm from "app/settings/views/Network/SyslogForm";
import RepositoriesList from "app/settings/views/Repositories/RepositoriesList";
import RepositoryAdd from "app/settings/views/Repositories/RepositoryAdd";
import RepositoryEdit from "app/settings/views/Repositories/RepositoryEdit";
import ScriptsList from "app/settings/views/Scripts/ScriptsList";
import ScriptsUpload from "app/settings/views/Scripts/ScriptsUpload";
import StorageForm from "app/settings/views/Storage/StorageForm";
import UserAdd from "app/settings/views/Users/UserAdd";
import UserEdit from "app/settings/views/Users/UserEdit";
import UsersList from "app/settings/views/Users/UsersList";

const SettingsRoutes = (): JSX.Element => {
  return (
    <Routes>
      <Route path={settingsURLs.configuration.general} children={General} />
      <Route
        path={settingsURLs.configuration.commissioning}
        children={Commissioning}
      />
      <Route
        path={settingsURLs.configuration.kernelParameters}
        children={KernelParameters}
      />
      <Route path={settingsURLs.configuration.deploy} children={Deploy} />
      <Route path={settingsURLs.index}>
        <Navigate replace to={settingsURLs.configuration.index} />
      </Route>
      <Route path={settingsURLs.configuration.index}>
        <Navigate replace to={settingsURLs.configuration.general} />
      </Route>
      <Route path={settingsURLs.users.index} children={UsersList} />
      <Route path={settingsURLs.users.add} children={UserAdd} />
      <Route path={settingsURLs.users.edit(null, true)} children={UserEdit} />
      <Route path={settingsURLs.licenseKeys.index} children={LicenseKeyList} />
      <Route path={settingsURLs.licenseKeys.add} children={LicenseKeyAdd} />
      <Route
        path={settingsURLs.licenseKeys.edit(null, true)}
        children={LicenseKeyEdit}
      />
      <Route path={settingsURLs.storage} children={StorageForm} />
      <Route path={settingsURLs.network.proxy} children={ProxyForm} />
      <Route path={settingsURLs.network.dns} children={DnsForm} />
      <Route path={settingsURLs.network.ntp} children={NtpForm} />
      <Route path={settingsURLs.network.syslog} children={SyslogForm} />
      <Route
        path={settingsURLs.network.networkDiscovery}
        children={NetworkDiscoveryForm}
      />
      <Route
        path={settingsURLs.scripts.commissioning.index}
        element={<ScriptsList type="commissioning" />}
      />
      <Route
        path={settingsURLs.scripts.commissioning.upload}
        element={<ScriptsUpload type="commissioning" />}
      />
      <Route
        path={settingsURLs.scripts.testing.index}
        element={<ScriptsList type="testing" />}
      />
      <Route
        path={settingsURLs.scripts.testing.upload}
        element={<ScriptsUpload type="testing" />}
      />
      <Route path={settingsURLs.dhcp.index} element={DhcpList} />
      <Route path={settingsURLs.dhcp.add} element={DhcpAdd} />
      <Route path={settingsURLs.dhcp.edit(null, true)} element={DhcpEdit} />
      <Route
        path={settingsURLs.repositories.index}
        children={RepositoriesList}
      />
      <Route
        path={settingsURLs.repositories.add(null, true)}
        children={RepositoryAdd}
      />
      <Route
        path={settingsURLs.repositories.edit(null, true)}
        children={RepositoryEdit}
      />
      <Route path={settingsURLs.images.windows} children={Windows} />
      <Route path={settingsURLs.images.vmware} children={VMWare} />
      <Route path={settingsURLs.images.ubuntu} children={ThirdPartyDrivers} />
      <Route path="*" children={NotFound} />
    </Routes>
  );
};

export default SettingsRoutes;
