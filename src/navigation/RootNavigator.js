import { createSwitchNavigator, createAppContainer } from "react-navigation";

import AuthNavigator from './AuthNavigator'
import HomeStackNavigator from './HomeStackNavigator'

const rootNavigation = createSwitchNavigator({
    AuthNavigator: { screen: AuthNavigator },
    HomeStackNavigator: { screen: HomeStackNavigator },
}, {
    initialRouteName: 'AuthNavigator'
})

const appContainer = createAppContainer(rootNavigation)

export default appContainer