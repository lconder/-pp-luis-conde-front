import {
    fetchUtils,
    GET_LIST,
    GET_ONE,
    GET_MANY,
    GET_MANY_REFERENCE,
    CREATE,
    UPDATE,
    UPDATE_MANY,
    DELETE,
    DELETE_MANY,
} from 'react-admin';

import axios from 'axios';

/**
 * Maps react-admin queries to a simple REST API
 *
 * The REST dialect is similar to the one of FakeRest
 * @see https://github.com/marmelab/FakeRest
 * @example
 * GET_LIST     => GET http://my.api.url/posts?sort=['title','ASC']&range=[0, 24]
 * GET_ONE      => GET http://my.api.url/posts/123
 * GET_MANY     => GET http://my.api.url/posts?filter={ids:[123,456,789]}
 * UPDATE       => PUT http://my.api.url/posts/123
 * CREATE       => POST http://my.api.url/posts
 * DELETE       => DELETE http://my.api.url/posts/123
 */
export default (apiUrl, httpClient = fetchUtils.fetchJson) => {
    /**
     * @param {String} type One of the constants appearing at the top if this file, e.g. 'UPDATE'
     * @param {String} resource Name of the resource to fetch, e.g. 'posts'
     * @param {Object} params The data request params, depending on the type
     * @returns {Object} { url, options } The HTTP request parameters
     */
    const convertDataRequestToHTTP = (type, resource, params) => {

        let url = '';
        const options = {method: 'GET'};
        switch (type) {
            case GET_LIST: {
                const { page, perPage } = params.pagination;
                let { field, order } = params.sort;
                order = order==='ASC' ? 'DESC' : 'ASC';
                let filter = JSON.stringify(params.filter);
                url = `${apiUrl}/${resource}`;
                url += `?page=${page-1}&limit=${perPage}`;
                url += `&field=${field}&order=${order}`;
                url += `&filter=${filter}`;
                break;
            }
            case GET_ONE: {
                url = `${apiUrl}/${resource}/${params.id}`;
                break;
            }
            case GET_MANY: {
                /*
                const query = {
                    filter: JSON.stringify({ id: params.ids }),
                };
                url = `${apiUrl}/web/${resource}?${stringify(query)}`;*/
                url = `${apiUrl}/${resource}`;
                break;
            }
            case GET_MANY_REFERENCE: {
                const { page, perPage } = params.pagination;
                const { field, order } = params.sort;
                const filter = {
                    ...params.filter,
                    [params.target]: params.id,
                };

                const query = {
                    sort: JSON.stringify([field, order]),
                    range: JSON.stringify([
                        (page - 1) * perPage,
                        page * perPage - 1,
                    ]),

                };

                url = `${apiUrl}/web/${resource}`;
                url += `?filter=${JSON.stringify(filter)}`;
                break;
            }
            case UPDATE:
                console.log(params.data);
                url = `${apiUrl}/web/${resource}/${params.id}`;
                options.method = 'PUT';
                options.body = JSON.stringify(params.data);
                break;
            case CREATE:
                url = `${apiUrl}/${resource}`;
                options.method = 'POST';
                options.body = JSON.stringify(params.data);
                break;
            case DELETE:
                console.log('Crear el borrado');
                //url = `${apiUrl}/${resource}/${params.id}`;
                //options.method = 'DELETE';
                break;
            default:
                throw new Error(`Unsupported fetch action type ${type}`);
        }
        return { url, options };
    };

    const convertFileToBase64 = file =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;

            reader.readAsDataURL(file.rawFile);
        });

    /**
     * @param {Object} response HTTP response from fetch()
     * @param {String} type One of the constants appearing at the top if this file, e.g. 'UPDATE'
     * @param {String} resource Name of the resource to fetch, e.g. 'posts'
     * @param {Object} params The data request params, depending on the type
     * @returns {Object} Data response
     */
    const convertHTTPResponse = (response, type, resource, params) => {

        const json = response.data;
        let clean_data;
        switch (type) {
            case GET_LIST:
            case GET_MANY_REFERENCE:
                clean_data = json;
                return {
                    data: clean_data.resources,
                    total: clean_data.count
                };
            case CREATE:
                return { data: { ...params.data, id: json.id } };
            case GET_MANY:
                clean_data = json;
                return {
                    data: clean_data.resources,
                    total: clean_data.count
                };
            case GET_ONE:
                return {data: json};
            case UPDATE:
                return {data: json};
            default:
                return {data: json};
        }
    };

    /**
     * @param {string} type Request type, e.g GET_LIST
     * @param {string} resource Resource name, e.g. "posts"
     * @param {Object} payload Request parameters. Depends on the request type
     * @returns {Promise} the Promise for a data response
     */
    return async (type, resource, params) => {

        // simple-rest doesn't handle filters on UPDATE route, so we fallback to calling UPDATE n times instead
        if (type === UPDATE_MANY) {
            return Promise.all(
                params.ids.map(id => {
                        console.log(`Update many ${id}`);
                        let _resource = `put_${resource}`;
                        params.data.id = id;
                        let calls = JSON.stringify([{
                            'moduleName': 'app',
                            'className': 'Web',
                            'method': _resource,
                            'params': {'data': {...params.data}}
                        }]);
                        let url = `${apiUrl}?calls=${calls}`;
                        console.log(url);
                        httpClient(url, {
                            method: 'GET'
                        });

                    }
                )
            ).then(responses => ({
                    data: responses.map(response => response),
                })
            );
        }
        // simple-rest doesn't handle filters on DELETE route, so we fallback to calling DELETE n times instead
        if (type === DELETE_MANY) {
            return Promise.all(
                params.ids.map(id =>
                    axios(`${apiUrl}/${resource}/${id}`, {
                        headers: {
                            'Authorization': `Token ${localStorage.getItem('token')}`
                        },
                        method: 'DELETE'
                    })
                )
            ).then(responses => ({
                data: responses.map(response => response.json),
            }));
        }


        const {url, options} = convertDataRequestToHTTP(
            type,
            resource,
            params
        );

        let data = {};
        if (options.method === "POST" || options.method === "PUT") {

            data = JSON.parse(options.body);
        }

        let image = data.image ? await convertFileToBase64(params.data.image) : null;

        return axios({
            url,
            headers: {
                'Authorization': `Token ${localStorage.getItem('token')}`
            },
            method: options.method,
            data: data.image ? {...data, image} : data
        })
            .then(response =>
                convertHTTPResponse(response, type, resource, params)
            );
    };


};
