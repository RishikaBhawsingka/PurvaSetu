import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";

import * as Location from "expo-location";
import MapView, { Marker, Polyline } from "react-native-maps";
import { Picker } from "@react-native-picker/picker";

import {
  getLocations,
  analyzeRoute,
} from "../services/api";

const OSRM_URL =
  "https://router.project-osrm.org/route/v1/driving";

export default function Route({ navigation }) {
  const [locations, setLocations] = useState([]);

  const [startId, setStartId] = useState("");
  const [destinationId, setDestinationId] = useState("");

  const [currentLocation, setCurrentLocation] =
    useState(null);

  const [routeCoordinates, setRouteCoordinates] =
    useState([]);

  const [result, setResult] = useState(null);

  const [loadingLocations, setLoadingLocations] =
    useState(true);

  const [loadingRoute, setLoadingRoute] =
    useState(false);

  const [status, setStatus] = useState(
    "Loading NER locations..."
  );

  // --------------------------------------------------
  // LOAD ALL 46 NER LOCATIONS
  // --------------------------------------------------

  useEffect(() => {
    let mounted = true;

    const loadLocations = async () => {
      try {
        const data = await getLocations();

        if (!mounted) return;

        setLocations(data);

        setStatus(
          "Select your starting point and destination."
        );
      } catch (error) {
        console.log(
          "❌ LOCATION LOAD ERROR:",
          error
        );

        if (mounted) {
          setStatus(
            "❌ Could not load NER locations."
          );
        }
      } finally {
        if (mounted) {
          setLoadingLocations(false);
        }
      }
    };

    loadLocations();

    return () => {
      mounted = false;
    };
  }, []);

  // --------------------------------------------------
  // GPS
  // --------------------------------------------------

  const useCurrentLocation = async () => {
    try {
      setStatus(
        "Getting your current location..."
      );

      const { status } =
        await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setStatus(
          "❌ Location permission denied."
        );

        Alert.alert(
          "Location Permission",
          "Please allow location access to use GPS."
        );

        return;
      }

      const location =
        await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

      const coords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      setCurrentLocation(coords);

      // Clear manual starting location
      setStartId("");

      // Clear previous route
      setRouteCoordinates([]);
      setResult(null);

      setStatus(
        "✅ Current GPS location selected."
      );

      console.log(
        "📍 CURRENT GPS:",
        coords
      );
    } catch (error) {
      console.log(
        "❌ GPS ERROR:",
        error
      );

      setStatus(
        "❌ Could not get your current location."
      );
    }
  };

  // --------------------------------------------------
  // GET OSRM ROAD ROUTE
  // --------------------------------------------------

  const getOSRMRoute = async (
    startCoordinate,
    destinationCoordinate
  ) => {
    try {
      const coordinates =
        `${startCoordinate.longitude},${startCoordinate.latitude};` +
        `${destinationCoordinate.longitude},${destinationCoordinate.latitude}`;

      /*
       * overview=simplified keeps the number of
       * coordinates much smaller than overview=full.
       *
       * This is important for React Native Maps
       * performance on long NER routes.
       */

      const response = await fetch(
        `${OSRM_URL}/${coordinates}?overview=simplified&geometries=geojson`
      );

      if (!response.ok) {
        throw new Error(
          `OSRM returned ${response.status}`
        );
      }

      const data = await response.json();

      if (
        !data.routes ||
        data.routes.length === 0
      ) {
        throw new Error(
          "No road route found."
        );
      }

      const coordinatesArray =
        data.routes[0].geometry.coordinates;

      return coordinatesArray.map(
        ([longitude, latitude]) => ({
          latitude,
          longitude,
        })
      );
    } catch (error) {
      console.log(
        "❌ OSRM ERROR:",
        error
      );

      return [];
    }
  };

  // --------------------------------------------------
  // FIND ROUTE
  // --------------------------------------------------

  const handleFindRoute = async () => {
    // Prevent double tapping
    if (loadingRoute) {
      return;
    }

    // Destination is always required
    if (!destinationId) {
      setStatus(
        "Please select a destination."
      );
      return;
    }

    // Either GPS or manual start is required
    if (!startId && !currentLocation) {
      setStatus(
        "Please select a starting location or use GPS."
      );
      return;
    }

    try {
      setLoadingRoute(true);

      // Remove previous result immediately
      setResult(null);
      setRouteCoordinates([]);

      setStatus(
        "Analyzing safest and fastest routes..."
      );

      // ------------------------------------------------
      // DETERMINE START
      // ------------------------------------------------

      let backendStartId;
      let mapStartCoordinate;

      if (currentLocation) {
        /*
         * GPS is outside the fixed database locations.
         *
         * For now, use the nearest NER location as the
         * backend routing origin.
         */

        let nearestLocation = null;
        let nearestDistance = Infinity;

        locations.forEach((location) => {
          const lat =
            Number(location.latitude);

          const lng =
            Number(location.longitude);

          const distance =
            Math.pow(
              lat -
                currentLocation.latitude,
              2
            ) +
            Math.pow(
              lng -
                currentLocation.longitude,
              2
            );

          if (distance < nearestDistance) {
            nearestDistance = distance;
            nearestLocation = location;
          }
        });

        if (!nearestLocation) {
          throw new Error(
            "Could not determine nearest NER location."
          );
        }

        backendStartId =
          Number(nearestLocation.id);

        mapStartCoordinate =
          currentLocation;

        console.log(
          "📍 GPS NEAREST NER LOCATION:",
          nearestLocation.name,
          nearestLocation.id
        );
      } else {
        const startLocation =
          locations.find(
            (item) =>
              String(item.id) ===
              String(startId)
          );

        if (!startLocation) {
          throw new Error(
            "Starting location not found."
          );
        }

        backendStartId =
          Number(startLocation.id);

        mapStartCoordinate = {
          latitude: Number(
            startLocation.latitude
          ),
          longitude: Number(
            startLocation.longitude
          ),
        };
      }

      // ------------------------------------------------
      // DESTINATION
      // ------------------------------------------------

      const destinationLocation =
        locations.find(
          (item) =>
            String(item.id) ===
            String(destinationId)
        );

      if (!destinationLocation) {
        throw new Error(
          "Destination location not found."
        );
      }

      const backendDestinationId =
        Number(destinationLocation.id);

      const mapDestinationCoordinate = {
        latitude: Number(
          destinationLocation.latitude
        ),
        longitude: Number(
          destinationLocation.longitude
        ),
      };

      // Same location check
      if (
        backendStartId ===
        backendDestinationId
      ) {
        throw new Error(
          "Starting location and destination cannot be the same."
        );
      }

      console.log(
        "🚀 BACKEND ROUTE:",
        backendStartId,
        "→",
        backendDestinationId
      );

      // ------------------------------------------------
      // BACKEND INTELLIGENCE
      // ------------------------------------------------

      const backendResult =
        await analyzeRoute(
          backendStartId,
          backendDestinationId
        );

      setResult(backendResult);

      console.log(
        "✅ BACKEND ROUTE RESULT:",
        backendResult
      );

      // ------------------------------------------------
      // OSRM MAP ROUTE
      // ------------------------------------------------

      const roadCoordinates =
        await getOSRMRoute(
          mapStartCoordinate,
          mapDestinationCoordinate
        );

      if (roadCoordinates.length > 0) {
        setRouteCoordinates(
          roadCoordinates
        );
      }

      setStatus(
        "✅ Route analysis completed."
      );
    } catch (error) {
      console.log(
        "❌ ROUTE ERROR:",
        error
      );

      setStatus(
        `❌ ${
          error.message ||
          "Route analysis failed."
        }`
      );
    } finally {
      setLoadingRoute(false);
    }
  };

  // --------------------------------------------------
  // SELECTED LOCATIONS
  // --------------------------------------------------

  const selectedStart =
    locations.find(
      (item) =>
        String(item.id) ===
        String(startId)
    );

  const selectedDestination =
    locations.find(
      (item) =>
        String(item.id) ===
        String(destinationId)
    );

  // --------------------------------------------------
  // MAP CENTER
  // --------------------------------------------------

  const mapCenter =
    currentLocation ||
    (selectedStart
      ? {
          latitude: Number(
            selectedStart.latitude
          ),
          longitude: Number(
            selectedStart.longitude
          ),
        }
      : {
          latitude: 26.1445,
          longitude: 91.7362,
        });

  // --------------------------------------------------
  // FORMAT ETA
  // --------------------------------------------------

  const formatETA = (minutes) => {
    if (!minutes) {
      return "N/A";
    }

    const hours = Math.floor(
      minutes / 60
    );

    const mins = Math.round(
      minutes % 60
    );

    if (hours === 0) {
      return `${mins} min`;
    }

    return `${hours} hr ${mins} min`;
  };

  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------

  return (
    <ScrollView
      contentContainerStyle={
        styles.container
      }
    >
      {/* HEADER */}

      <Text style={styles.title}>
        Find Best Route
      </Text>

      <Text style={styles.subtitle}>
        Plan a safer and smarter journey
        across the North Eastern Region.
      </Text>

      {/* STATUS */}

      <View style={styles.statusBox}>
        {(loadingLocations ||
          loadingRoute) && (
          <ActivityIndicator
            size="small"
            color="#30483B"
          />
        )}

        <Text style={styles.status}>
          {status}
        </Text>
      </View>

      {/* START LOCATION */}

      <Text style={styles.label}>
        Starting Location
      </Text>

      <View
        style={
          styles.pickerContainer
        }
      >
        <Picker
          selectedValue={startId}
          onValueChange={(value) => {
            setStartId(value);

            /*
             * Manual selection overrides GPS.
             */
            if (value) {
              setCurrentLocation(
                null
              );
            }

            setResult(null);
            setRouteCoordinates([]);
          }}
          style={styles.picker}
        >
          <Picker.Item
            label="Select starting location"
            value=""
          />

          {locations.map(
            (location) => (
              <Picker.Item
                key={location.id}
                label={`${location.name}, ${location.state}`}
                value={String(
                  location.id
                )}
              />
            )
          )}
        </Picker>
      </View>

      {/* GPS */}

      <TouchableOpacity
        style={styles.gpsButton}
        onPress={
          useCurrentLocation
        }
        disabled={loadingRoute}
      >
        <Text
          style={
            styles.gpsButtonText
          }
        >
          📍 Use My Current GPS Location
        </Text>
      </TouchableOpacity>

      {/* DESTINATION */}

      <Text style={styles.label}>
        Destination
      </Text>

      <View
        style={
          styles.pickerContainer
        }
      >
        <Picker
          selectedValue={
            destinationId
          }
          onValueChange={(value) => {
            setDestinationId(value);

            setResult(null);
            setRouteCoordinates([]);
          }}
          style={styles.picker}
        >
          <Picker.Item
            label="Select destination"
            value=""
          />

          {locations.map(
            (location) => (
              <Picker.Item
                key={location.id}
                label={`${location.name}, ${location.state}`}
                value={String(
                  location.id
                )}
              />
            )
          )}
        </Picker>
      </View>

      {/* FIND ROUTE BUTTON */}

      <TouchableOpacity
        style={[
          styles.routeButton,
          loadingRoute &&
            styles.routeButtonDisabled,
        ]}
        onPress={
          handleFindRoute
        }
        disabled={loadingRoute}
      >
        <Text
          style={
            styles.routeButtonText
          }
        >
          {loadingRoute
            ? "Analyzing Route..."
            : "Find Best Route"}
        </Text>
      </TouchableOpacity>

      {/* MAP */}

      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude:
              mapCenter.latitude,
            longitude:
              mapCenter.longitude,
            latitudeDelta: 4,
            longitudeDelta: 4,
          }}
        >
          {/* GPS MARKER */}

          {currentLocation && (
            <Marker
              coordinate={
                currentLocation
              }
              title="Your Current Location"
              description="GPS location"
            />
          )}

          {/* START MARKER */}

          {!currentLocation &&
            selectedStart && (
              <Marker
                coordinate={{
                  latitude: Number(
                    selectedStart.latitude
                  ),
                  longitude: Number(
                    selectedStart.longitude
                  ),
                }}
                title={
                  selectedStart.name
                }
                description="Starting location"
              />
            )}

          {/* DESTINATION MARKER */}

          {selectedDestination && (
            <Marker
              coordinate={{
                latitude: Number(
                  selectedDestination.latitude
                ),
                longitude: Number(
                  selectedDestination.longitude
                ),
              }}
              title={
                selectedDestination.name
              }
              description="Destination"
            />
          )}

          {/* ROAD ROUTE */}

          {routeCoordinates.length >
            0 && (
            <Polyline
              coordinates={
                routeCoordinates
              }
              strokeWidth={5}
              strokeColor="#A9573F"
            />
          )}
        </MapView>
      </View>

      {/* ROUTE RESULTS */}

      {result && (
        <View
          style={
            styles.resultsContainer
          }
        >
          <Text
            style={
              styles.resultsTitle
            }
          >
            Route Intelligence
          </Text>

          {/* RECOMMENDATION */}

          <View
            style={
              styles.recommendationCard
            }
          >
            <Text
              style={
                styles.recommendationTitle
              }
            >
              AI Recommendation
            </Text>

            <Text
              style={
                styles.recommendation
              }
            >
              {result.recommendation ||
                "No recommendation available."}
            </Text>
          </View>

          {/* FASTEST */}

          {result.fastestRoute && (
            <View
              style={
                styles.routeCard
              }
            >
              <Text
                style={
                  styles.cardTitle
                }
              >
                ⚡ Fastest Route
              </Text>

              <Text
                style={styles.metric}
              >
                Distance:{" "}
                {
                  result
                    .fastestRoute
                    .totalDistanceKm
                }{" "}
                km
              </Text>

              <Text
                style={styles.metric}
              >
                ETA:{" "}
                {formatETA(
                  result
                    .fastestRoute
                    .totalTransitTimeMin
                )}
              </Text>

              <Text
                style={styles.metric}
              >
                Risk Score:{" "}
                {
                  result
                    .fastestRoute
                    .averageRiskScore
                }
              </Text>

              <Text
                style={styles.metric}
              >
                Severity:{" "}
                {
                  result
                    .fastestRoute
                    .severityBand
                }
              </Text>

              <Text
                style={styles.metric}
              >
                Route Nodes:{" "}
                {
                  result
                    .fastestRoute
                    .nodesCount
                }
              </Text>

              <Text
                style={styles.metric}
              >
                Hazards:{" "}
                {result.fastestRoute
                  .hazardsEncountered
                  ?.length || 0}
              </Text>
            </View>
          )}

          {/* SAFEST */}

          {result.safestRoute && (
            <View
              style={
                styles.routeCard
              }
            >
              <Text
                style={
                  styles.cardTitle
                }
              >
                🛡 Safest Route
              </Text>

              <Text
                style={styles.metric}
              >
                Distance:{" "}
                {
                  result
                    .safestRoute
                    .totalDistanceKm
                }{" "}
                km
              </Text>

              <Text
                style={styles.metric}
              >
                ETA:{" "}
                {formatETA(
                  result
                    .safestRoute
                    .totalTransitTimeMin
                )}
              </Text>

              <Text
                style={styles.metric}
              >
                Risk Score:{" "}
                {
                  result
                    .safestRoute
                    .averageRiskScore
                }
              </Text>

              <Text
                style={styles.metric}
              >
                Severity:{" "}
                {
                  result
                    .safestRoute
                    .severityBand
                }
              </Text>

              <Text
                style={styles.metric}
              >
                Route Nodes:{" "}
                {
                  result
                    .safestRoute
                    .nodesCount
                }
              </Text>

              <Text
                style={styles.metric}
              >
                Hazards:{" "}
                {result.safestRoute
                  .hazardsEncountered
                  ?.length || 0}
              </Text>
            </View>
          )}

          {/* AI ENGINE STATUS */}

          {result.aiEngineStatus && (
            <Text
              style={
                styles.aiStatus
              }
            >
              AI Engine:{" "}
              {
                result.aiEngineStatus
              }
            </Text>
          )}
        </View>
      )}
    </ScrollView>
  );
}

// ==================================================
// STYLES
// ==================================================

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#EDE8DC",
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#20231F",
    textAlign: "center",
    marginTop: 20,
  },

  subtitle: {
    fontSize: 15,
    color: "#30483B",
    textAlign: "center",
    marginTop: 7,
    marginBottom: 20,
    lineHeight: 21,
  },

  statusBox: {
    minHeight: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    gap: 8,
  },

  status: {
    fontSize: 14,
    color: "#30483B",
    textAlign: "center",
  },

  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#20231F",
    marginTop: 10,
    marginBottom: 8,
  },

  pickerContainer: {
    backgroundColor: "#CBD0C0",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#30483B",
  },

  picker: {
    color: "#20231F",
  },

  gpsButton: {
    backgroundColor: "#B8944A",
    paddingVertical: 13,
    borderRadius: 12,
    marginTop: 12,
    marginBottom: 12,
    alignItems: "center",
  },

  gpsButtonText: {
    color: "#20231F",
    fontSize: 15,
    fontWeight: "bold",
  },

  routeButton: {
    backgroundColor: "#A9573F",
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 20,
    alignItems: "center",
  },

  routeButtonDisabled: {
    opacity: 0.65,
  },

  routeButtonText: {
    color: "#EDE8DC",
    fontSize: 17,
    fontWeight: "bold",
  },

  mapContainer: {
    height: 350,
    marginTop: 25,
    borderRadius: 15,
    overflow: "hidden",
  },

  map: {
    flex: 1,
  },

  resultsContainer: {
    marginTop: 25,
    paddingBottom: 30,
  },

  resultsTitle: {
    fontSize: 23,
    fontWeight: "bold",
    color: "#20231F",
    marginBottom: 15,
  },

  recommendationCard: {
    backgroundColor: "#30483B",
    padding: 18,
    borderRadius: 15,
    marginBottom: 15,
  },

  recommendationTitle: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#EDE8DC",
    marginBottom: 10,
  },

  recommendation: {
    color: "#EDE8DC",
    fontSize: 15,
    lineHeight: 22,
  },

  routeCard: {
    backgroundColor: "#CBD0C0",
    padding: 18,
    borderRadius: 15,
    marginBottom: 15,
  },

  cardTitle: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#20231F",
    marginBottom: 12,
  },

  metric: {
    color: "#20231F",
    fontSize: 15,
    marginBottom: 7,
  },

  aiStatus: {
    textAlign: "center",
    color: "#30483B",
    fontSize: 13,
    marginTop: 5,
  },
});
