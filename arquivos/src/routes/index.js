import React from 'react';
import { Splash } from '../screens/splash';
import { Title } from '../screens/title';

/* const Stack = createStackNavigator();/*  */

export function AppRoutes() {
  return (
    <Splash />

    /*     <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={splash} />
      </Stack.Navigator>
    </NavigationContainer> */
  );
}
