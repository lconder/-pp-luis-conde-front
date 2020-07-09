import React from 'react';
import {
    Create,
    NumberInput,
    PasswordInput,
    RadioButtonGroupInput,
    SimpleForm,
    TextInput,
    required} from 'react-admin';

const choices = [
    { id: true, name: 'Femenino' },
    { id: false, name: 'Masculino' }
];

const UserCreate = props => {

    return (
        <Create {...props}>
            <SimpleForm>
                <TextInput label="email" source="email" validate={[required()]} resettable/>
                <TextInput label="nombre" source="name"  validate={[required()]} resettable/>
                <PasswordInput label="password" source="password" type="password" validate={[required()]}/>
                <NumberInput label="edad" source="age" validate={[required()]} />
                <TextInput label="pasatiempo" source="hobby" validate={[required()]} />
                <TextInput label="teléfono" source="phone" validate={[required()]} />
                <RadioButtonGroupInput source="gender" choices={choices} label="Género"/>
            </SimpleForm>
        </Create>
    );

};

export default UserCreate;
