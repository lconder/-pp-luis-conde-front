import * as React from "react";
import { Admin, Resource } from 'react-admin';
import {url} from './constants'
import authProvider from './authProvider'
import jsonServerProvider from './Provider';
import {MyLoginPage} from './layout';
import UserIcon from '@material-ui/icons/Group';
import {UserCreate, UserList} from './users'

const dataProvider = jsonServerProvider(url);
const App = () => (

    <Admin
        title="Dashboard"
        authProvider={authProvider}
        loginPage={MyLoginPage}
        dataProvider={dataProvider}
    >

      <Resource
          name="users"
          icon={UserIcon}
          list={UserList}
          create={UserCreate}
          options={{ label: 'Usuarios' }}
      />

    </Admin>
);

export default App;