import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function HazardSimulation() {
  const [running, setRunning] = useState(false);

  const startSimulation = () => {
    setRunning(true);

    Alert.alert(
      "Simulation Started",
      "Hazard simulation is now running."
    );
  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        Hazard Simulation
      </Text>

      <Text style={styles.subtitle}>
        Identify and simulate potential route hazards
      </Text>

      <View style={styles.hazardCard}>

        <View style={styles.warningCircle}>
          <Ionicons
            name="warning"
            size={45}
            color="#A9573F"
          />
        </View>

        <Text style={styles.cardTitle}>
          Route Hazard Analysis
        </Text>

        <Text style={styles.cardText}>
          Simulate possible road conditions and
          evaluate their impact on route safety.
        </Text>

      </View>

      <View style={styles.infoCard}>

        <View style={styles.infoRow}>
          <Ionicons name="rainy" size={25} color="#30483B" />
          <Text style={styles.infoText}>
            Heavy Rainfall
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="warning-outline" size={25} color="#30483B" />
          <Text style={styles.infoText}>
            Landslide Risk
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="car-outline" size={25} color="#30483B" />
          <Text style={styles.infoText}>
            Road Blockage
          </Text>
        </View>

      </View>

      <TouchableOpacity
        style={[
          styles.button,
          running && styles.runningButton,
        ]}
        onPress={startSimulation}
      >
        <Ionicons
          name={running ? "checkmark-circle" : "play"}
          size={22}
          color="#FFFFFF"
        />

        <Text style={styles.buttonText}>
          {running
            ? "Simulation Running"
            : "Start Simulation"}
        </Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EDE8DC",
    padding: 22,
    paddingTop: 60,
  },

  title: {
    fontSize: 27,
    fontWeight: "800",
    color: "#20231F",
  },

  subtitle: {
    color: "#6A6D65",
    marginTop: 6,
    lineHeight: 20,
  },

  hazardCard: {
    backgroundColor: "#F6F1E7",
    borderRadius: 22,
    marginTop: 25,
    padding: 25,
    alignItems: "center",
    elevation: 3,
  },

  warningCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#EFE0D8",
    alignItems: "center",
    justifyContent: "center",
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: "800",
    marginTop: 15,
  },

  cardText: {
    textAlign: "center",
    color: "#6A6D65",
    lineHeight: 20,
    marginTop: 8,
  },

  infoCard: {
    backgroundColor: "#F6F1E7",
    borderRadius: 18,
    padding: 18,
    marginTop: 18,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },

  infoText: {
    marginLeft: 14,
    fontSize: 15,
    fontWeight: "600",
  },

  button: {
    backgroundColor: "#30483B",
    height: 58,
    borderRadius: 17,
    marginTop: 25,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  runningButton: {
    backgroundColor: "#557463",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
});