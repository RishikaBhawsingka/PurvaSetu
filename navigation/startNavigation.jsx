import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Home from "../screens/home";
import Profile from "../screens/profile";

// Icons
import Ionicons from "@expo/vector-icons/Ionicons";

const Tab = createBottomTabNavigator();

const StartNavigation = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        // Bottom Tab Style
        tabBarStyle: {
          position: "absolute",
          height: 90,
          elevation: 5,
          paddingBottom: 20,
          paddingTop: 8,
          borderTopWidth: 0,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 10,
          },
          shadowOpacity: 0.1,
          shadowRadius: 10,
        },

        // Active & Inactive Colors
        tabBarActiveTintColor: "#6C63FF",
        tabBarInactiveTintColor: "gray",

        // Label Style
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },

        // Icon
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          }

          return (
            <Ionicons
              name={iconName}
              size={24}
              color={color}
            />
          );
        },
      })}
    >
      <Tab.Screen
        component={Home}
        name="Home"
      />

      <Tab.Screen
        component={Profile}
        name="Profile"
      />
    </Tab.Navigator>
  );
};

export default StartNavigation;