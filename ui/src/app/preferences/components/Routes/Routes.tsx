import { Route, Navigate, Routes } from "react-router-dom";

import NotFound from "app/base/views/NotFound";
import prefsURLs from "app/preferences/urls";
import APIKeyAdd from "app/preferences/views/APIKeys/APIKeyAdd";
import APIKeyEdit from "app/preferences/views/APIKeys/APIKeyEdit";
import APIKeyList from "app/preferences/views/APIKeys/APIKeyList";
import Details from "app/preferences/views/Details";
import AddSSHKey from "app/preferences/views/SSHKeys/AddSSHKey";
import SSHKeyList from "app/preferences/views/SSHKeys/SSHKeyList";
import AddSSLKey from "app/preferences/views/SSLKeys/AddSSLKey";
import SSLKeyList from "app/preferences/views/SSLKeys/SSLKeyList";

const PreferencesRoutes = (): JSX.Element => {
  return (
    <Routes>
      <Route path={prefsURLs.prefs}>
        <Navigate replace to={prefsURLs.details} />
      </Route>
      <Route path={prefsURLs.details} children={Details} />
      <Route path={prefsURLs.apiKeys.index} children={APIKeyList} />
      <Route path={prefsURLs.apiKeys.add} children={APIKeyAdd} />
      <Route path={prefsURLs.apiKeys.edit(null, true)} children={APIKeyEdit} />
      <Route path={prefsURLs.sshKeys.index} children={SSHKeyList} />
      <Route path={prefsURLs.sshKeys.add} children={AddSSHKey} />
      <Route path={prefsURLs.sslKeys.index} children={SSLKeyList} />
      <Route path={prefsURLs.sslKeys.add} children={AddSSLKey} />
      <Route path="*" children={NotFound} />
    </Routes>
  );
};

export default PreferencesRoutes;
