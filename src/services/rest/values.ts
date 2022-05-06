import { createAuthenticationHeader } from '../security'
import axios, {AxiosResponse} from 'axios';
import config from '../server-config'
import { Value, ValueList } from '../../types/types';
import { executeDelayed } from '../utils/async-helpers';
import serverConfig from '../server-config';


interface ErrorMessage {
    message: string;
}

const endpoint = axios.create({
    baseURL: config.host,
    responseType: 'json'
});

const process = <T = any>(r:AxiosResponse<T|ErrorMessage>) => {
    if (r.status >= 300) {
        const { message } = r.data as ErrorMessage;
        throw new Error(message || r.statusText);
    }
    return r.data as T;
}

export const fetchValues = (token: string) =>
    endpoint.get<ValueList | ErrorMessage>(`${config.getValuesControllerURI}GetLastValues`, { headers: createAuthenticationHeader(token) })
        .then(r => {
            if (r.status >= 300) {
                const { message } = r.data as ErrorMessage;
                throw new Error(message || r.statusText);
            }
            return r.data as ValueList;
        })