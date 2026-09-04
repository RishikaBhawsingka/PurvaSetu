
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";

export default function Route({ navigation }) {
  const [start, setStart] = useState("");
  const [destination, setDestination] = useState("");
  const [showMap, setShowMap] = useState(false);

  // Demo coordinates for now.
  // Later these will come from your backend / geocoding API.
  const startLocation = {
    latitude: 26.1445,
    longitude: 91.7362,
  };

  const destinationLocation = {
    latitude: 27.4728,
    longitude: 94.912,
  };

  const generateRoute = () => {
    if (!start.trim() || !destination.trim()) {
      return;
    }

    setShowMap(true);
  };

  return (
    <View style={styles.container}>
      {!showMap ? (
        <ScrollView
          contentContainerStyle={styles.initialContainer}
          keyboardShouldPersistTaps="handled"
        >
          {/* Back */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Plan Your Route</Text>

            <Text style={styles.subtitle}>
              Find a safer and smarter route across the North Eastern Region.
            </Text>
          </View>

          {/* Location Card */}
          <View style={styles.locationCard}>
            {/* Start */}
            <View style={styles.inputSection}>
              <View style={styles.iconContainer}>
                <Text style={styles.icon}>●</Text>
              </View>

              <View style={styles.inputWrapper}>
                <Text style={styles.label}>START LOCATION</Text>

                <TextInput
                  style={styles.input}
                  placeholder="Enter starting point"
                  placeholderTextColor="#77786F"
                  value={start}
                  onChangeText={setStart}
                />
              </View>
            </View>

            {/* Connecting Line */}
            <View style={styles.connector} />

            {/* Destination */}
            <View style={styles.inputSection}>
              <View style={[styles.iconContainer, styles.destinationIcon]}>
                <Text style={styles.destinationIconText}>●</Text>
              </View>

              <View style={styles.inputWrapper}>
                <Text style={styles.label}>DESTINATION</Text>

                <TextInput
                  style={styles.input}
                  placeholder="Enter destination"
                  placeholderTextColor="#77786F"
                  value={destination}
                  onChangeText={setDestination}
                />
              </View>
            </View>
          </View>

          {/* Generate Button */}
          <TouchableOpacity
            style={[
              styles.generateButton,
              (!start.trim() || !destination.trim()) &&
                styles.generateButtonDisabled,
            ]}
            onPress={generateRoute}
            disabled={!start.trim() || !destination.trim()}
          >
            <Text style={styles.generateText}>Generate Route</Text>
            <Text style={styles.arrow}>→</Text>
          </TouchableOpacity>

          {/* Info */}
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>SMART ROUTING</Text>

            <Text style={styles.infoText}>
              Our system will analyze road conditions, disruptions, terrain,
              and accessibility to help identify the best route.
            </Text>
          </View>
        </ScrollView>
      ) : (
        <View style={styles.mapScreen}>
          {/* Map */}
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: 26.8,
              longitude: 93.3,
              latitudeDelta: 5.5,
              longitudeDelta: 5.5,
            }}
          >
            {/* Start Marker */}
            <Marker
              coordinate={startLocation}
              title={start}
              description="Starting location"
            />

            {/* Destination Marker */}
            <Marker
              coordinate={destinationLocation}
              title={destination}
              description="Destination"
            />

            {/* Demo Route */}
            <Polyline
              coordinates={[
                startLocation,
                {
                  latitude: 26.35,
                  longitude: 92.3,
                },
                {
                  latitude: 26.8,
                  longitude: 93.1,
                },
                {
                  latitude: 27.1,
                  longitude: 94.1,
                },
                destinationLocation,
              ]}
              strokeColor="#A9573F"
              strokeWidth={5}
            />
          </MapView>

          {/* Top Overlay */}
          <View style={styles.mapTopCard}>
            <TouchableOpacity
              style={styles.mapBackButton}
              onPress={() => setShowMap(false)}
            >
              <Text style={styles.mapBackText}>←</Text>
            </TouchableOpacity>

            <View style={styles.routeSummary}>
              <Text style={styles.routeSummaryTitle}>Route Generated</Text>

              <Text style={styles.routeSummaryText}>
                {start} → {destination}
              </Text>
            </View>
          </View>

          {/* Bottom Route Information */}
          <View style={styles.bottomCard}>
            <View style={styles.routeHeader}>
              <View>
                <Text style={styles.bestRouteLabel}>RECOMMENDED ROUTE</Text>

                <Text style={styles.bestRouteTitle}>Safest Route</Text>
              </View>

              <View style={styles.safeBadge}>
                <Text style={styles.safeBadgeText}>SAFE</Text>
              </View>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.stat}>
                <Text style={styles.statValue}>—</Text>
                <Text style={styles.statLabel}>DISTANCE</Text>
              </View>

              <View style={styles.stat}>
                <Text style={styles.statValue}>—</Text>
                <Text style={styles.statLabel}>EST. TIME</Text>
              </View>

              <View style={styles.stat}>
                <Text style={styles.statValue}>Low</Text>
                <Text style={styles.statLabel}>RISK</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.changeRouteButton}
              onPress={() => setShowMap(false)}
            >
              <Text style={styles.changeRouteText}>Change Locations</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EDE8DC",
  },

  initialContainer: {
    padding: 24,
    paddingTop: 50,
    paddingBottom: 40,
  },

  backButton: {
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 4,
  },

  backText: {
    color: "#30483B",
    fontSize: 16,
    fontWeight: "600",
  },

  header: {
    marginTop: 28,
    marginBottom: 30,
  },

  title: {
    color: "#20231F",
    fontSize: 34,
    fontWeight: "800",
    letterSpacing: -0.8,
  },

  subtitle: {
    color: "#60635B",
    fontSize: 15,
    lineHeight: 23,
    marginTop: 10,
    maxWidth: 390,
  },

  locationCard: {
    backgroundColor: "#CBD0C0",
    borderRadius: 22,
    padding: 22,
    marginBottom: 20,
  },

  inputSection: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#30483B",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  icon: {
    color: "#EDE8DC",
    fontSize: 16,
  },

  destinationIcon: {
    backgroundColor: "#A9573F",
  },

  destinationIconText: {
    color: "#EDE8DC",
    fontSize: 16,
  },

  inputWrapper: {
    flex: 1,
  },

  label: {
    color: "#30483B",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.2,
    marginBottom: 4,
  },

  input: {
    color: "#20231F",
    fontSize: 16,
    fontWeight: "600",
    paddingVertical: 5,
  },

  connector: {
    height: 28,
    width: 2,
    backgroundColor: "#9A9F91",
    marginLeft: 18,
    marginVertical: 3,
  },

  generateButton: {
    height: 58,
    borderRadius: 17,
    backgroundColor: "#30483B",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },

  generateButtonDisabled: {
    opacity: 0.45,
  },

  generateText: {
    color: "#EDE8DC",
    fontSize: 16,
    fontWeight: "800",
  },

  arrow: {
    color: "#EDE8DC",
    fontSize: 21,
    marginLeft: 12,
  },

  infoCard: {
    backgroundColor: "#F2EFE7",
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: "#CBD0C0",
  },

  infoTitle: {
    color: "#B8944A",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.5,
    marginBottom: 8,
  },

  infoText: {
    color: "#60635B",
    fontSize: 14,
    lineHeight: 21,
  },

  /* MAP SCREEN */

  mapScreen: {
    flex: 1,
  },

  map: {
    flex: 1,
  },

  mapTopCard: {
    position: "absolute",
    top: 45,
    left: 18,
    right: 18,
    flexDirection: "row",
    alignItems: "center",
  },

  mapBackButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#EDE8DC",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  mapBackText: {
    color: "#20231F",
    fontSize: 24,
    fontWeight: "700",
  },

  routeSummary: {
    flex: 1,
    backgroundColor: "#EDE8DC",
    borderRadius: 17,
    paddingHorizontal: 18,
    paddingVertical: 11,
  },

  routeSummaryTitle: {
    color: "#30483B",
    fontSize: 12,
    fontWeight: "800",
  },

  routeSummaryText: {
    color: "#20231F",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 3,
  },

  bottomCard: {
    position: "absolute",
    left: 14,
    right: 14,
    bottom: 14,
    backgroundColor: "#EDE8DC",
    borderRadius: 24,
    padding: 21,
  },

  routeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  bestRouteLabel: {
    color: "#B8944A",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.2,
  },

  bestRouteTitle: {
    color: "#20231F",
    fontSize: 22,
    fontWeight: "800",
    marginTop: 4,
  },

  safeBadge: {
    backgroundColor: "#CBD0C0",
    borderRadius: 20,
    paddingHorizontal: 13,
    paddingVertical: 7,
  },

  safeBadgeText: {
    color: "#30483B",
    fontSize: 10,
    fontWeight: "900",
  },

  statsRow: {
    flexDirection: "row",
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#CBD0C0",
  },

  stat: {
    flex: 1,
  },

  statValue: {
    color: "#20231F",
    fontSize: 17,
    fontWeight: "800",
  },

  statLabel: {
    color: "#77786F",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.8,
    marginTop: 4,
  },

  changeRouteButton: {
    marginTop: 18,
    height: 46,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#30483B",
    alignItems: "center",
    justifyContent: "center",
  },

  changeRouteText: {
    color: "#30483B",
    fontSize: 14,
    fontWeight: "800",
  },
});
