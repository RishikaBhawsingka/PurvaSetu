import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Home from "../screens/home"; // Landing / Welcome screen
import Signup from "../screens/signup";
import Login from "../screens/login";
import Dashboard from "./startNavigation"; // Bottom tab navigator (contains inner Home & Profile)
import Route from "../screens/route";
import BackendTest from "../screens/BackendTest";

const Stack = createNativeStackNavigator();

export default function MainNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
        }}
      >
        {/* Step 1: Initial Landing Screen */}
        <Stack.Screen name="Home" component={Home} />

        {/* Step 2: Signup Screen */}
        <Stack.Screen name="Signup" component={Signup} />

        {/* Step 3: Login Screen */}
        <Stack.Screen name="Login" component={Login} />

        {/* Step 4: Authenticated Dashboard (Bottom Tabs) */}
        <Stack.Screen name="Dashboard" component={Dashboard} />

        <Stack.Screen name="Route" component={Route} />
        <Stack.Screen name="BackendTest" component={BackendTest} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}