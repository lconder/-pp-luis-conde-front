import React from 'react';
import {
    Datagrid,
    Filter,
    List,
    ReferenceField,
    TextField,
    TextInput} from 'react-admin';

const UserFilter = props => (
    <Filter {...props}>
        <TextInput label="nombre o pasatiempo" source="search" alwaysOn />
    </Filter>
)

const UserList = props => (
    <List {...props} filters={<UserFilter/>}>

        <Datagrid>
            <ReferenceField  source="id" label="Email" reference="users">
                <TextField source="email"/>
            </ReferenceField>
            <TextField  source="name" label="Nombre"/>
            <TextField  source="age" label="Edad"/>
            <TextField  source="hobby" label="Pasatiempo"/>
            <TextField  source="phone" label="Télefono"/>
        </Datagrid>
    </List>
);

export default UserList;
