import { createStackNavigator } from "react-navigation-stack";

import Login from '../views/Login'
import Register from '../views/Register'

const authNavigator = createStackNavigator({
    Login: { screen: Login, navigationOptions: { header: null }},
    Register: { screen: Register, navigationOptions: { header: null }}
}, {
    initialRouteName: 'Login'
})

export default authNavigator