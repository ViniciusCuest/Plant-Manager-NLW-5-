import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import AppRoutes from './StackRoutes';


const Routes = () => (
    <NavigationContainer>
        <AppRoutes/>
    </NavigationContainer>
);

export default Routes;
