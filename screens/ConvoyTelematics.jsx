import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function ConvoyTelematics() {
  return (
    <View style={styles.container}>
      <ScrollView>

        <Text style={styles.title}>
          Convoy Telematics
        </Text>

        <Text style={styles.subtitle}>
          Real-time convoy monitoring
        </Text>

        <View style={styles.vehicleCard}>

          <View style={styles.iconCircle}>
            <Ionicons
              name="car"
              size={30}
              color="#30483B"
            />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.vehicleName}>
              Convoy C-204
            </Text>

            <Text style={styles.vehicleStatus}>
              ● Active
            </Text>
          </View>

          <Text style={styles.speed}>
            42 km/h
          </Text>

        </View>

        <Text style={styles.sectionTitle}>
          Live Data
        </Text>

        <View style={styles.dataGrid}>

          <View style={styles.dataCard}>
            <Ionicons name="speedometer" size={25} color="#30483B" />
            <Text style={styles.dataValue}>42</Text>
            <Text style={styles.dataLabel}>Speed km/h</Text>
          </View>

          <View style={styles.dataCard}>
            <Ionicons name="navigate" size={25} color="#30483B" />
            <Text style={styles.dataValue}>68%</Text>
            <Text style={styles.dataLabel}>Route Progress</Text>
          </View>

          <View style={styles.dataCard}>
            <Ionicons name="location" size={25} color="#30483B" />
            <Text style={styles.dataValue}>Siliguri</Text>
            <Text style={styles.dataLabel}>Current Location</Text>
          </View>

          <View style={styles.dataCard}>
            <Ionicons name="time" size={25} color="#30483B" />
            <Text style={styles.dataValue}>24 min</Text>
            <Text style={styles.dataLabel}>ETA</Text>
          </View>

        </View>

        <View style={styles.alertCard}>
          <Ionicons
            name="information-circle"
            size={25}
            color="#A9573F"
          />

          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.alertTitle}>
              Telematics Status
            </Text>

            <Text style={styles.alertText}>
              Vehicle telemetry is being received normally.
            </Text>
          </View>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EDE8DC",
    paddingTop: 60,
    paddingHorizontal: 20,
  },

  title: {
    fontSize: 27,
    fontWeight: "800",
    color: "#20231F",
  },

  subtitle: {
    color: "#6A6D65",
    marginTop: 5,
    marginBottom: 25,
  },

  vehicleCard: {
    backgroundColor: "#30483B",
    borderRadius: 20,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
  },

  iconCircle: {
    width: 55,
    height: 55,
    borderRadius: 30,
    backgroundColor: "#EDE8DC",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  vehicleName: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
  },

  vehicleStatus: {
    color: "#D8E5DA",
    marginTop: 5,
  },

  speed: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 15,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    marginTop: 28,
    marginBottom: 14,
  },

  dataGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },

  dataCard: {
    width: "47%",
    backgroundColor: "#F6F1E7",
    borderRadius: 17,
    padding: 18,
    elevation: 2,
  },

  dataValue: {
    fontSize: 20,
    fontWeight: "800",
    marginTop: 8,
    color: "#20231F",
  },

  dataLabel: {
    color: "#777A73",
    marginTop: 4,
    fontSize: 12,
  },

  alertCard: {
    marginTop: 20,
    backgroundColor: "#F6F1E7",
    borderRadius: 17,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
  },

  alertTitle: {
    fontWeight: "800",
    fontSize: 16,
  },

  alertText: {
    color: "#6A6D65",
    marginTop: 5,
    lineHeight: 18,
  },
});