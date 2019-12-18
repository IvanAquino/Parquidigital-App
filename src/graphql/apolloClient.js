import ApolloClient from "apollo-client";
import { WebSocketLink } from 'apollo-link-ws';
import { HttpLink } from 'apollo-link-http';
import { split } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context'
import AsyncStorage from '@react-native-community/async-storage'


const wsurl = "ws://192.168.1.100:9000/graphql";
const httpurl = "http://192.168.1.100:9000/graphql";

const wsLink = new WebSocketLink({
    uri: wsurl,
    options: {
        reconnect: true
    }
});
const httpLink = new HttpLink({
    uri: httpurl,
    credentials: 'same-origin'
});

const authLink = setContext(request => new Promise((resolve, reject) => {
    AsyncStorage.getItem('auth')
        .then(authData => {
            if (!!!authData) return resolve({ headers: {} })

            let auth = JSON.parse(authData)
            resolve({
                headers: { authorization: auth.token }
            })
        })
        .catch(err => reject(err))
}))

const link = split(
    ({ query }) => {
        const { kind, operation } = getMainDefinition(query);
        return kind === 'OperationDefinition' && operation === 'subscription';
    },
    wsLink,
    authLink.concat(httpLink),
)

const client = new ApolloClient({
    link,
    cache: new InMemoryCache()
});

export default client;