import { IonApp, IonRouterOutlet, IonSplitPane, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';
import Menu from './components/Menu';
import Page from './pages/Page';
import {SecureRoute} from "./components/SecurePage";


/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import ValuesList from "./pages/values/ValuesList";
import ShowValue from "./pages/value/ShowValue";
import DataSourceList from "./pages/datasources/DataSources";
import ManageDataSource from "./pages/datasources/ManageDataSource";


setupIonicReact();

const App: React.FC = () => {
  return (
      <IonApp>
        <IonReactRouter>
          <IonSplitPane contentId="main">
            <Menu />
            <IonRouterOutlet id="main">
              <Route path="/home" component={Home} exact={true} />
              <Route path="/login" component={Login} exact={true} />
              <SecureRoute path="/values" component={ValuesList} exact={true} />
              <SecureRoute path="/datasources"  component={DataSourceList} exact={true} />
              <SecureRoute path="/values/show/:id"  component={ShowValue} exact={true} />
              <SecureRoute path="/datasources/new" component={ManageDataSource("add")} exact={true} />
              <SecureRoute path="/datasources/:source"  component={ManageDataSource("edit")} exact={true} />
              <Route path="/" exact={true}>
                <Redirect to="/home" />
              </Route>
            </IonRouterOutlet>
          </IonSplitPane>
        </IonReactRouter>
      </IonApp>
  );
};

export default App;