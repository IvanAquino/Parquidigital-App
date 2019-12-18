import { createStackNavigator } from "react-navigation-stack";

import Home from '../views/Home'
import ParkingConfirm from '../views/ParkingConfirm'

const homeStackNavigator = createStackNavigator({
    Home: { screen: Home, navigationOptions: { header: null} },
    ParkingConfirm: { screen: ParkingConfirm, navigationOptions: { header: null} }
}, {
    initialRouteName: 'Home'
})

export default homeStackNavigator