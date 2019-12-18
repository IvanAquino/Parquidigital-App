import React from 'react';
import { ApplicationProvider, Layout, Text } from '@ui-kitten/components';
import { mapping, light as lightTheme } from '@eva-design/eva';

import RootNavigator from './src/navigation/RootNavigator'
import { ApolloProvider } from 'react-apollo';
import apolloClient from "./src/graphql/apolloClient"
import { ParkingFeeProvider } from './src/context/ParkingFeeContext';

const App = () => (
  <ApplicationProvider mapping={mapping} theme={lightTheme}>
    <ApolloProvider client={apolloClient}>
      <ParkingFeeProvider>
        <RootNavigator />
      </ParkingFeeProvider>
    </ApolloProvider>
  </ApplicationProvider>
);

export default App;
