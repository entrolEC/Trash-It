import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { MapScreen } from '../scenes/MapScreen'
import { LoginScreen } from '../scenes/LoginScreen'
import { RegisterScreen } from '../scenes/RegisterScreen'

const Stack = createStackNavigator();

export const AuthNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}