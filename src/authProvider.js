import {url} from './constants';

const authProvider = {

    login: ({email, password}) => {

        const request = new Request(`${url}/login`, {
            method: 'POST',
            body: JSON.stringify({email, password}),
            headers: new Headers({ 'Content-Type': 'application/json' })
        });

        return fetch(request)
            .then( response => {
                if (response.status < 200 || response.status >= 300) {
                    throw new Error(response.statusText);
                }
                return response.json();
            })
            .then(({ jwt }) => {
                localStorage.setItem('token', jwt);
            });

    },

    logout: () => {

        let token = localStorage.getItem('token');
        if(!token)
            return Promise.resolve();

        const request = new Request(`${url}/logout`, {
            method: 'POST',
            body: JSON.stringify({}),
            headers: new Headers({
                'Content-Type': 'application/json',
                'Authorization': `${token}`
            })
        });

        return fetch(request)
            .then( response => {

                if (response.status < 200 || response.status >= 300) {
                    throw new Error(response.statusText);
                }

                localStorage.removeItem('token');

            });
    },

    checkAuth: () => localStorage.getItem('token')
        ? Promise.resolve()
        : Promise.reject({ redirectTo: '/login' }),

    getPermissions: () => {
        const role = localStorage.getItem('permissions');
        return role ? Promise.resolve(role) : Promise.reject();
    }

};

export default authProvider;