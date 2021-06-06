import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MaterialIcons from '@expo/vector-icons/MaterialIcons'

import Main from '../pages/Main';
import MyPlants from '../pages/MyPlants';

import colors from '../styles/colors';

const AppTab = createBottomTabNavigator();

const AuthRoutes = () => {
    return(
        <AppTab.Navigator tabBarOptions={{
            activeTintColor: colors.green,
            inactiveTintColor: colors.heading,
            labelPosition: "beside-icon",
            style:{
                height: 60,
                alignItems: "center",
                justifyContent: "center"
            },
        }}>  
            <AppTab.Screen name="Principal"component={Main} options={{
                tabBarIcon: (({ size, color }) => (
                    <MaterialIcons name="add-circle-outline" size={size} color={color}/>
                ))
            }}/>

            <AppTab.Screen name="Minhas Plantas" component={MyPlants} options={{
                tabBarIcon: (({ size, color }) => (
                    <MaterialIcons name="format-list-bulleted" size={size} color={color}/>
                ))
            }}/>
        </AppTab.Navigator>
    );
}
export default AuthRoutes;