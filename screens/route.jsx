import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";

export default function Route({ navigation }) {
  const [start, setStart] = useState("");
  const [destination, setDestination] = useState("");
  const [showMap, setShowMap] = useState(false);

  // GPS state
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);

  // Real route state
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [routeDistance, setRouteDistance] = useState(null);
  const [routeDuration, setRouteDuration] = useState(null);
  const [routeLoading, setRouteLoading] = useState(false);

  // Destination coordinates
  const [destinationLocation, setDestinationLocation] =
    useState(null);

  // ---------------------------------------------------------
  // GET CURRENT GPS LOCATION
  // ---------------------------------------------------------

  const getCurrentLocation = async () => {
    try {
      setLocationLoading(true);

      const { status } =
        await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Location Permission",
          "Location permission is required to use your current location."
        );
        return;
      }

      const location =
        await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

      const coords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      setCurrentLocation(coords);

      // Put GPS coordinates into the start field
      setStart(
        `${coords.latitude.toFixed(5)}, ${coords.longitude.toFixed(5)}`
      );

      console.log("Current GPS location:", coords);
    } catch (error) {
      console.log("Location error:", error);

      Alert.alert(
        "Location Error",
        "Unable to get your current location. Please make sure GPS is enabled."
      );
    } finally {
      setLocationLoading(false);
    }
  };

  // ---------------------------------------------------------
  // GEOCODE A PLACE NAME
  // Example:
  // "Guwahati" -> latitude/longitude
  // "Tawang" -> latitude/longitude
  // ---------------------------------------------------------

  /**const geocodeLocation = async (place) => {
    try {
      // Check if the user entered coordinates directly.
      // Example: 26.1445, 91.7362
      const coordinateMatch = place
        .trim()
        .match(
          /^(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)$/
        );

      if (coordinateMatch) {
        return {
          latitude: parseFloat(coordinateMatch[1]),
          longitude: parseFloat(coordinateMatch[2]),
        };
      }

      // Search within India / NER context
      const query = `${place}, Northeast India, India`;

      const url =
        "https://nominatim.openstreetmap.org/search" +
        `?q=${encodeURIComponent(query)}` +
        "&format=jsonv2" +
        "&limit=1" +
        "&countrycodes=in";

      const response = await fetch(url, {
        headers: {
          Accept: "application/json",
          "User-Agent": "NER-Sentinel-AI/1.0",
        },
      });

      if (!response.ok) {
        throw new Error(
          `Geocoding request failed: ${response.status}`
        );
      }

      const data = await response.json();

      if (!data || data.length === 0) {
        throw new Error(
          `Could not find location: ${place}`
        );
      }

      return {
        latitude: parseFloat(data[0].lat),
        longitude: parseFloat(data[0].lon),
      };
    } catch (error) {
      console.log("Geocoding error:", error);
      throw error;
    }
  };**/
  
const geocodeLocation = async (place) => {
  try {
    const cleanPlace = place.trim();

    // -----------------------------------------------------
    // 1. Check if user entered coordinates directly
    // Example:
    // 26.1445, 91.7362
    // -----------------------------------------------------

    const coordinateMatch = cleanPlace.match(
      /^(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)$/
    );

    if (coordinateMatch) {
      return {
        latitude: parseFloat(coordinateMatch[1]),
        longitude: parseFloat(coordinateMatch[2]),
      };
    }

    // -----------------------------------------------------
    // 2. First try the exact place name
    // -----------------------------------------------------

    const exactUrl =
      "https://nominatim.openstreetmap.org/search" +
      `?q=${encodeURIComponent(cleanPlace)}` +
      "&format=json" +
      "&limit=5" +
      "&addressdetails=1";

    console.log("Geocoding:", cleanPlace);

    const exactResponse = await fetch(exactUrl, {
      headers: {
        Accept: "application/json",
        "User-Agent": "NER-Sentinel-AI",
      },
    });

    if (!exactResponse.ok) {
      throw new Error(
        `Geocoding service returned ${exactResponse.status}`
      );
    }

    const exactData = await exactResponse.json();

    console.log(
      "Geocoding results:",
      exactData
    );

    // -----------------------------------------------------
    // 3. Look for an Indian result
    // -----------------------------------------------------

    if (exactData && exactData.length > 0) {
      const indianResult =
        exactData.find(
          (result) =>
            result.address?.country_code === "in"
        );

      const result = indianResult || exactData[0];

      return {
        latitude: parseFloat(result.lat),
        longitude: parseFloat(result.lon),
      };
    }

    // -----------------------------------------------------
    // 4. If exact search failed, try NER-specific search
    // -----------------------------------------------------

    const nerUrl =
      "https://nominatim.openstreetmap.org/search" +
      `?q=${encodeURIComponent(
        cleanPlace + ", Northeast India"
      )}` +
      "&format=json" +
      "&limit=5" +
      "&addressdetails=1";

    const nerResponse = await fetch(nerUrl, {
      headers: {
        Accept: "application/json",
        "User-Agent": "NER-Sentinel-AI",
      },
    });

    if (!nerResponse.ok) {
      throw new Error(
        `NER geocoding request failed: ${nerResponse.status}`
      );
    }

    const nerData = await nerResponse.json();

    if (nerData && nerData.length > 0) {
      const indianResult =
        nerData.find(
          (result) =>
            result.address?.country_code === "in"
        );

      const result = indianResult || nerData[0];

      return {
        latitude: parseFloat(result.lat),
        longitude: parseFloat(result.lon),
      };
    }

    throw new Error(
      `Could not find location: ${cleanPlace}`
    );
  } catch (error) {
    console.log("Geocoding error:", error);
    throw error;
  }
};



  // ---------------------------------------------------------
  // GET REAL ROAD ROUTE FROM OSRM
  // ---------------------------------------------------------

  const fetchRoute = async (startCoords, destinationCoords) => {
    try {
      const coordinates =
        `${startCoords.longitude},${startCoords.latitude};` +
        `${destinationCoords.longitude},${destinationCoords.latitude}`;

      const url =
        `https://router.project-osrm.org/route/v1/driving/${coordinates}` +
        "?overview=full" +
        "&geometries=geojson" +
        "&steps=true";

      console.log("OSRM request:", url);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(
          `Routing request failed: ${response.status}`
        );
      }

      const data = await response.json();

      console.log("OSRM response:", data);

      if (data.code !== "Ok" || !data.routes?.length) {
        throw new Error(
          "No road route could be found between these locations."
        );
      }

      const route = data.routes[0];

      // OSRM GeoJSON coordinates are:
      // [longitude, latitude]
      //
      // react-native-maps expects:
      // { latitude, longitude }

      const coordinatesForMap =
        route.geometry.coordinates.map(
          ([longitude, latitude]) => ({
            latitude,
            longitude,
          })
        );

      setRouteCoordinates(coordinatesForMap);

      // OSRM distance is in meters
      setRouteDistance(route.distance);

      // OSRM duration is in seconds
      setRouteDuration(route.duration);

      return route;
    } catch (error) {
      console.log("Routing error:", error);
      throw error;
    }
  };

  // ---------------------------------------------------------
  // GENERATE REAL ROUTE
  //
  // START CAN BE:
  // 1. Manually typed
  // 2. Current GPS location
  //
  // GPS IS NOT REQUIRED.
  // ---------------------------------------------------------

  const generateRoute = async () => {
    if (!start.trim()) {
      Alert.alert(
        "Starting Location Required",
        "Please enter a starting location or use your current location."
      );
      return;
    }

    if (!destination.trim()) {
      Alert.alert(
        "Destination Required",
        "Please enter a destination."
      );
      return;
    }

    try {
      setRouteLoading(true);

      console.log("Start:", start);
      console.log("Destination:", destination);

      // -----------------------------------------------------
      // START COORDINATES
      // -----------------------------------------------------
      //
      // If currentLocation exists AND the start field still
      // contains the GPS coordinates, use the actual GPS.
      //
      // Otherwise geocode the manually entered start.
      // -----------------------------------------------------

      let startCoords;

      const coordinateMatch = start
        .trim()
        .match(
          /^(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)$/
        );

      if (currentLocation && coordinateMatch) {
        startCoords = currentLocation;
      } else {
        startCoords = await geocodeLocation(start);
      }

      console.log("Start coordinates:", startCoords);

      // -----------------------------------------------------
      // DESTINATION COORDINATES
      // -----------------------------------------------------

      const destinationCoords =
        await geocodeLocation(destination);

      console.log(
        "Destination coordinates:",
        destinationCoords
      );

      setDestinationLocation(destinationCoords);

      // -----------------------------------------------------
      // GET REAL ROAD ROUTE
      // -----------------------------------------------------

      await fetchRoute(
        startCoords,
        destinationCoords
      );

      // -----------------------------------------------------
      // OPEN MAP
      // -----------------------------------------------------

      setShowMap(true);
    } catch (error) {
      console.log("Generate route error:", error);

      Alert.alert(
        "Route Error",
        error.message ||
          "Unable to generate the route. Please check the locations and try again."
      );
    } finally {
      setRouteLoading(false);
    }
  };

  // ---------------------------------------------------------
  // FORMAT DISTANCE
  // ---------------------------------------------------------

  const formatDistance = (meters) => {
    if (meters === null || meters === undefined) {
      return "—";
    }

    const kilometers = meters / 1000;

    if (kilometers < 1) {
      return `${Math.round(meters)} m`;
    }

    return `${kilometers.toFixed(1)} km`;
  };

  // ---------------------------------------------------------
  // FORMAT TIME
  // ---------------------------------------------------------

  const formatDuration = (seconds) => {
    if (seconds === null || seconds === undefined) {
      return "—";
    }

    const totalMinutes = Math.round(seconds / 60);

    if (totalMinutes < 60) {
      return `${totalMinutes} min`;
    }

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (minutes === 0) {
      return `${hours} hr`;
    }

    return `${hours} hr ${minutes} min`;
  };

  // ---------------------------------------------------------
  // TEMPORARY MAP FALLBACK
  //
  // This is only used before a real route is generated.
  // It is NOT used once OSRM returns a route.
  // ---------------------------------------------------------

  const fallbackStartLocation =
    currentLocation || {
      latitude: 26.1445,
      longitude: 91.7362,
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
            <Text style={styles.title}>
              Plan Your Route
            </Text>

            <Text style={styles.subtitle}>
              Find a safer and smarter route across the North
              Eastern Region.
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
                <Text style={styles.label}>
                  START LOCATION
                </Text>

                <TextInput
                  style={styles.input}
                  placeholder="Enter starting point"
                  placeholderTextColor="#77786F"
                  value={start}
                  onChangeText={(text) => {
                    setStart(text);

                    // If user manually edits the field,
                    // remove the previous GPS selection.
                    setCurrentLocation(null);
                  }}
                />

                {/* Current Location Button */}
                <TouchableOpacity
                  style={styles.currentLocationButton}
                  onPress={getCurrentLocation}
                  disabled={locationLoading}
                >
                  <Text
                    style={styles.currentLocationText}
                  >
                    {locationLoading
                      ? "Getting location..."
                      : "📍 Use Current Location"}
                  </Text>
                </TouchableOpacity>

                {/* GPS status */}
                {currentLocation && (
                  <Text style={styles.gpsStatus}>
                    ✓ GPS location detected
                  </Text>
                )}
              </View>
            </View>

            {/* Connecting Line */}
            <View style={styles.connector} />

            {/* Destination */}
            <View style={styles.inputSection}>
              <View
                style={[
                  styles.iconContainer,
                  styles.destinationIcon,
                ]}
              >
                <Text
                  style={styles.destinationIconText}
                >
                  ●
                </Text>
              </View>

              <View style={styles.inputWrapper}>
                <Text style={styles.label}>
                  DESTINATION
                </Text>

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
              (!start.trim() ||
                !destination.trim() ||
                routeLoading) &&
                styles.generateButtonDisabled,
            ]}
            onPress={generateRoute}
            disabled={
              !start.trim() ||
              !destination.trim() ||
              routeLoading
            }
          >
            <Text style={styles.generateText}>
              {routeLoading
                ? "Finding Route..."
                : "Generate Route"}
            </Text>

            {!routeLoading && (
              <Text style={styles.arrow}>→</Text>
            )}
          </TouchableOpacity>

          {/* Info */}
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>
              SMART ROUTING
            </Text>

            <Text style={styles.infoText}>
              Our system will analyze road conditions,
              disruptions, terrain, and accessibility to help
              identify the best route.
            </Text>
          </View>
        </ScrollView>
      ) : (
        <View style={styles.mapScreen}>
          {/* Map */}
          <MapView
            style={styles.map}
            initialRegion={{
              latitude:
                routeCoordinates.length > 0
                  ? routeCoordinates[0].latitude
                  : fallbackStartLocation.latitude,

              longitude:
                routeCoordinates.length > 0
                  ? routeCoordinates[0].longitude
                  : fallbackStartLocation.longitude,

              latitudeDelta: 5.5,
              longitudeDelta: 5.5,
            }}
            showsUserLocation={true}
            showsMyLocationButton={true}
          >
            {/* Current GPS Location */}
            {currentLocation && (
              <Marker
                coordinate={currentLocation}
                title="Your Current Location"
                description="GPS location"
              >
                <View
                  style={styles.currentLocationMarker}
                >
                  <Text style={styles.markerText}>
                    📍
                  </Text>
                </View>
              </Marker>
            )}

            {/* Manual Start Marker */}
            {!currentLocation &&
              routeCoordinates.length > 0 && (
                <Marker
                  coordinate={routeCoordinates[0]}
                  title={start}
                  description="Starting location"
                />
              )}

            {/* Destination Marker */}
            {destinationLocation && (
              <Marker
                coordinate={destinationLocation}
                title={destination}
                description="Destination"
              />
            )}

            {/* REAL OSRM ROAD ROUTE */}
            {routeCoordinates.length > 0 && (
              <Polyline
                coordinates={routeCoordinates}
                strokeColor="#A9573F"
                strokeWidth={5}
              />
            )}
          </MapView>

          {/* Top Overlay */}
          <View style={styles.mapTopCard}>
            <TouchableOpacity
              style={styles.mapBackButton}
              onPress={() => setShowMap(false)}
            >
              <Text style={styles.mapBackText}>
                ←
              </Text>
            </TouchableOpacity>

            <View style={styles.routeSummary}>
              <Text
                style={styles.routeSummaryTitle}
              >
                Route Generated
              </Text>

              <Text style={styles.routeSummaryText}>
                {start} → {destination}
              </Text>
            </View>
          </View>

          {/* Bottom Route Information */}
          <View style={styles.bottomCard}>
            <View style={styles.routeHeader}>
              <View>
                <Text
                  style={styles.bestRouteLabel}
                >
                  RECOMMENDED ROUTE
                </Text>

                <Text
                  style={styles.bestRouteTitle}
                >
                  Safest Route
                </Text>
              </View>

              <View style={styles.safeBadge}>
                <Text style={styles.safeBadgeText}>
                  SAFE
                </Text>
              </View>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.stat}>
                <Text style={styles.statValue}>
                  {formatDistance(routeDistance)}
                </Text>

                <Text style={styles.statLabel}>
                  DISTANCE
                </Text>
              </View>

              <View style={styles.stat}>
                <Text style={styles.statValue}>
                  {formatDuration(routeDuration)}
                </Text>

                <Text style={styles.statLabel}>
                  EST. TIME
                </Text>
              </View>

              <View style={styles.stat}>
                <Text style={styles.statValue}>
                  Low
                </Text>

                <Text style={styles.statLabel}>
                  RISK
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.changeRouteButton}
              onPress={() => {
                setShowMap(false);
              }}
            >
              <Text
                style={styles.changeRouteText}
              >
                Change Locations
              </Text>
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
    paddingBottom: 40,
  },

  backButton: {
    marginTop: 10,
    marginBottom: 25,
  },

  backText: {
    fontSize: 16,
    color: "#30483B",
    fontWeight: "600",
  },

  header: {
    marginBottom: 25,
  },

  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "#20231F",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 15,
    color: "#77786F",
    lineHeight: 22,
  },

  locationCard: {
    backgroundColor: "#F7F4EC",
    borderRadius: 18,
    padding: 20,
    marginBottom: 20,
  },

  inputSection: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#30483B",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
    marginTop: 4,
  },

  icon: {
    color: "#EDE8DC",
    fontSize: 13,
  },

  destinationIcon: {
    backgroundColor: "#A9573F",
  },

  destinationIconText: {
    color: "#EDE8DC",
    fontSize: 13,
  },

  inputWrapper: {
    flex: 1,
  },

  label: {
    fontSize: 11,
    fontWeight: "700",
    color: "#77786F",
    marginBottom: 6,
    letterSpacing: 1,
  },

  input: {
    backgroundColor: "#EDE8DC",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: "#20231F",
  },

  currentLocationButton: {
    marginTop: 10,
    alignSelf: "flex-start",
    backgroundColor: "#CBD0C0",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },

  currentLocationText: {
    color: "#30483B",
    fontSize: 13,
    fontWeight: "600",
  },

  gpsStatus: {
    color: "#30483B",
    fontSize: 12,
    marginTop: 7,
    fontWeight: "600",
  },

  connector: {
    width: 2,
    height: 25,
    backgroundColor: "#CBD0C0",
    marginLeft: 15,
    marginVertical: 4,
  },

  generateButton: {
    backgroundColor: "#30483B",
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },

  generateButtonDisabled: {
    opacity: 0.5,
  },

  generateText: {
    color: "#EDE8DC",
    fontSize: 16,
    fontWeight: "700",
  },

  arrow: {
    color: "#EDE8DC",
    fontSize: 20,
    marginLeft: 10,
  },

  infoCard: {
    backgroundColor: "#CBD0C0",
    borderRadius: 16,
    padding: 18,
  },

  infoTitle: {
    color: "#30483B",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1,
    marginBottom: 8,
  },

  infoText: {
    color: "#30483B",
    fontSize: 13,
    lineHeight: 20,
  },

  mapScreen: {
    flex: 1,
  },

  map: {
    flex: 1,
  },

  currentLocationMarker: {
    alignItems: "center",
    justifyContent: "center",
  },

  markerText: {
    fontSize: 30,
  },

  mapTopCard: {
    position: "absolute",
    top: 50,
    left: 16,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7F4EC",
    borderRadius: 16,
    padding: 12,
    elevation: 5,
  },

  mapBackButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#30483B",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  mapBackText: {
    color: "#EDE8DC",
    fontSize: 22,
  },

  routeSummary: {
    flex: 1,
  },

  routeSummaryTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#20231F",
  },

  routeSummaryText: {
    fontSize: 12,
    color: "#77786F",
    marginTop: 3,
  },

  bottomCard: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#F7F4EC",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    elevation: 10,
  },

  routeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  bestRouteLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: "#77786F",
    letterSpacing: 1,
  },

  bestRouteTitle: {
    fontSize: 21,
    fontWeight: "700",
    color: "#20231F",
    marginTop: 4,
  },

  safeBadge: {
    backgroundColor: "#CBD0C0",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },

  safeBadgeText: {
    color: "#30483B",
    fontSize: 11,
    fontWeight: "800",
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 18,
  },

  stat: {
    alignItems: "center",
    flex: 1,
  },

  statValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#20231F",
  },

  statLabel: {
    fontSize: 9,
    color: "#77786F",
    marginTop: 4,
    letterSpacing: 0.8,
  },

  changeRouteButton: {
    borderWidth: 1,
    borderColor: "#30483B",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },

  changeRouteText: {
    color: "#30483B",
    fontSize: 14,
    fontWeight: "700",
  },
});

