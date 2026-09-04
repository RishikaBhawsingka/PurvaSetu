import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function Dashboard() {
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <Text style={styles.logo}>PurvaSetu</Text>
          <Text style={styles.subtitle}>
            Smart Route Intelligence
          </Text>
        </View>

        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeTitle}>
            Welcome Back 👋
          </Text>

          <Text style={styles.welcomeText}>
            Your Northeast route intelligence dashboard
          </Text>
        </View>

        <Text style={styles.sectionTitle}>
          Quick Overview
        </Text>

        <View style={styles.statsRow}>

          <View style={styles.statCard}>
            <Ionicons
              name="navigate"
              size={28}
              color="#30483B"
            />
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>
              Active Routes
            </Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons
              name="car"
              size={28}
              color="#A9573F"
            />
            <Text style={styles.statNumber}>08</Text>
            <Text style={styles.statLabel}>
              Convoys
            </Text>
          </View>

        </View>

        <View style={styles.statusCard}>
          <View>
            <Text style={styles.statusTitle}>
              System Status
            </Text>

            <Text style={styles.statusText}>
              ● All systems operational
            </Text>
          </View>

          <Ionicons
            name="checkmark-circle"
            size={35}
            color="#30483B"
          />
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EDE8DC",
    paddingTop: 55,
  },

  header: {
    paddingHorizontal: 22,
    marginBottom: 20,
  },

  logo: {
    fontSize: 28,
    fontWeight: "800",
    color: "#30483B",
  },

  subtitle: {
    marginTop: 5,
    fontSize: 14,
    color: "#6A6D65",
  },

  welcomeCard: {
    marginHorizontal: 20,
    backgroundColor: "#30483B",
    borderRadius: 22,
    padding: 24,
  },

  welcomeTitle: {
    color: "#FFFFFF",
    fontSize: 23,
    fontWeight: "800",
  },

  welcomeText: {
    color: "#E8EDE7",
    fontSize: 14,
    marginTop: 8,
    lineHeight: 20,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#20231F",
    marginHorizontal: 22,
    marginTop: 28,
    marginBottom: 14,
  },

  statsRow: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 20,
  },

  statCard: {
    flex: 1,
    backgroundColor: "#F6F1E7",
    borderRadius: 18,
    padding: 20,
    elevation: 3,
  },

  statNumber: {
    fontSize: 27,
    fontWeight: "800",
    color: "#20231F",
    marginTop: 8,
  },

  statLabel: {
    color: "#6A6D65",
    marginTop: 3,
  },

  statusCard: {
    margin: 20,
    backgroundColor: "#F6F1E7",
    borderRadius: 18,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 2,
  },

  statusTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#20231F",
  },

  statusText: {
    marginTop: 7,
    color: "#30483B",
    fontWeight: "600",
  },
});