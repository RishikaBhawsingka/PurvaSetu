import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";

// Screens
import Dashboard from "../screens/Dashboard";
import ConvoyTelematics from "../screens/ConvoyTelematics";
import Route from "../screens/route";
import HazardSimulation from "../screens/HazardSimulation";
import FieldIncidentReport from "../screens/FieldIncidentReport";

const Tab = createBottomTabNavigator();

const StartNavigation = () => {
  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      screenOptions={({ route }) => ({
        headerShown: false,

        // Bottom Tab Bar
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

          backgroundColor: "#FFFFFF",
        },

        // Colors
        tabBarActiveTintColor: "#30483B",
        tabBarInactiveTintColor: "#888888",

        // Labels
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "600",
        },

        // Icons
        tabBarIcon: ({ focused, color }) => {
          let iconName;

          switch (route.name) {
            case "Dashboard":
              iconName = focused
                ? "grid"
                : "grid-outline";
              break;

            case "Convoy":
              iconName = focused
                ? "car"
                : "car-outline";
              break;

            case "Route":
              iconName = focused
                ? "navigate"
                : "navigate-outline";
              break;

            case "Hazard":
              iconName = focused
                ? "warning"
                : "warning-outline";
              break;

            case "Incident":
              iconName = focused
                ? "alert-circle"
                : "alert-circle-outline";
              break;

            default:
              iconName = "ellipse-outline";
          }

          return (
            <Ionicons
              name={iconName}
              size={22}
              color={color}
            />
          );
        },
      })}
    >
      {/* 1. Dashboard */}
      <Tab.Screen
        name="Dashboard"
        component={Dashboard}
        options={{
          tabBarLabel: "Dashboard",
        }}
      />

      {/* 2. Convoy Telematics */}
      <Tab.Screen
        name="Convoy"
        component={ConvoyTelematics}
        options={{
          tabBarLabel: "Convoy",
        }}
      />

      {/* 3. Route */}
      <Tab.Screen
        name="Route"
        component={Route}
        options={{
          tabBarLabel: "Route",
        }}
      />

      {/* 4. Hazard Simulation */}
      <Tab.Screen
        name="Hazard"
        component={HazardSimulation}
        options={{
          tabBarLabel: "Hazard",
        }}
      />

      {/* 5. Field Incident Report */}
      <Tab.Screen
        name="Incident"
        component={FieldIncidentReport}
        options={{
          tabBarLabel: "Incident",
        }}
      />
    </Tab.Navigator>
  );
};

export default StartNavigation;