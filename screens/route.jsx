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
  analyzeOfflineRoute,
} from "../services/offlineRoutingService";

import {
  analyzeRoute,
} from "../services/api";

import {
  initDatabase,
  getLocalLocations,
  syncOfflineRoutingData,
  getLocalRoadSegments,
  getLocalDisruptions,
  getLocalWeatherData,
   resetDatabase,
} from "../services/database";

const OSRM_URL =
  "https://router.project-osrm.org/route/v1/driving";

export default function Route({ navigation }) {
  // ==================================================
  // STATE
  // ==================================================

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

  const [gpsTracking, setGpsTracking] =
    useState(false);

  const [status, setStatus] = useState(
    "Loading NER locations..."
  );

  // ==================================================
  // GPS SUBSCRIPTION
  // ==================================================

  const [locationSubscription, setLocationSubscription] =
    useState(null);

  // ==================================================
  // LOAD OFFLINE ROUTING DATA
  // ==================================================

  useEffect(() => {
    let mounted = true;

    const loadLocations = async () => {
      try {
        setStatus(
          "📱 Checking offline routing data..."
        );

        // ----------------------------------------------
        // INITIALIZE SQLITE
        // ----------------------------------------------

        await initDatabase();
        
        // ----------------------------------------------
        // READ LOCAL DATA
        // ----------------------------------------------

        const localLocations =
          await getLocalLocations();

        const localSegments =
          await getLocalRoadSegments();

        const localDisruptions =
          await getLocalDisruptions();

        const localWeather =
          await getLocalWeatherData();

        console.log(
          "================================"
        );

        console.log(
          "📱 OFFLINE DATA CHECK"
        );

        console.log(
          "📍 Locations:",
          localLocations.length
        );

        console.log(
          "🛣️ Road Segments:",
          localSegments.length
        );

        console.log(
          "⚠️ Disruptions:",
          localDisruptions.length
        );

        console.log(
          "🌦️ Weather:",
          localWeather.length
        );

        console.log(
          "================================"
        );

        // ----------------------------------------------
        // OFFLINE DATA ALREADY AVAILABLE
        // ----------------------------------------------

        if (
          localLocations.length > 0 &&
          localSegments.length > 0
        ) {
          console.log(
            `📦 Using ${localLocations.length} locations from SQLite`
          );

          if (!mounted) return;

          setLocations(localLocations);

          setStatus(
            "📱 Offline routing data available."
          );

          return;
        }

        // ----------------------------------------------
        // OFFLINE DATA MISSING
        // DOWNLOAD FROM BACKEND
        // ----------------------------------------------

        console.log(
          "🌐 Offline routing data incomplete. Downloading..."
        );

        setStatus(
          "🌐 Downloading offline routing data..."
        );

        const syncResult =
          await syncOfflineRoutingData();

        if (!syncResult.success) {
          throw new Error(
            syncResult.error ||
              "Offline data sync failed."
          );
        }

        console.log(
          "================================"
        );

        console.log(
          "✅ OFFLINE DATA SYNC COMPLETE"
        );

        console.log(
          "📍 Locations:",
          syncResult.locations
        );

        console.log(
          "🛣️ Road Segments:",
          syncResult.roadSegments
        );

        console.log(
          "⚠️ Disruptions:",
          syncResult.disruptions
        );

        console.log(
          "🌦️ Weather:",
          syncResult.weather
        );

        console.log(
          "================================"
        );

        // ----------------------------------------------
        // READ LOCATIONS AGAIN
        // ----------------------------------------------

        const updatedLocations =
          await getLocalLocations();

        console.log(
          `📦 SQLite locations after sync: ${updatedLocations.length}`
        );

        if (!mounted) return;

        setLocations(
          updatedLocations
        );

        setStatus(
          "✅ Offline routing data downloaded."
        );
      } catch (error) {
        console.log(
          "❌ LOCATION/OFFLINE DATA LOAD ERROR:",
          error
        );

        // ----------------------------------------------
        // IF LOCAL LOCATIONS EXIST, STILL SHOW THEM
        // ----------------------------------------------

        try {
          const fallbackLocations =
            await getLocalLocations();

          if (
            mounted &&
            fallbackLocations.length > 0
          ) {
            console.log(
              `📦 Falling back to ${fallbackLocations.length} locally stored locations`
            );

            setLocations(
              fallbackLocations
            );

            setStatus(
              "⚠️ Using locally stored locations. Offline route data may be incomplete."
            );

            return;
          }
        } catch (fallbackError) {
          console.log(
            "❌ LOCAL FALLBACK ERROR:",
            fallbackError
          );
        }

        if (mounted) {
          setStatus(
            "❌ Could not load offline routing data."
          );
        }
      } finally {
        if (mounted) {
          setLoadingLocations(false);
        }
      }
    };

    // IMPORTANT:
    // Actually start loading the data.
    loadLocations();

    return () => {
      mounted = false;
    };
  }, []);

  // ==================================================
  // CLEAN GPS WATCHER WHEN SCREEN CLOSES
  // ==================================================

  useEffect(() => {
    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, [locationSubscription]);

  // ==================================================
  // START CONTINUOUS GPS TRACKING
  // ==================================================

  const startGPSTracking = async () => {
    try {
      setStatus(
        "Requesting GPS permission..."
      );

      const {
        status: permissionStatus,
      } =
        await Location.requestForegroundPermissionsAsync();

      if (
        permissionStatus !==
        "granted"
      ) {
        setStatus(
          "❌ Location permission denied."
        );

        Alert.alert(
          "Location Permission",
          "Please allow location access to use GPS tracking."
        );

        return;
      }

      // ----------------------------------------------
      // GET FIRST LOCATION
      // ----------------------------------------------

      const initialLocation =
        await Location.getCurrentPositionAsync({
          accuracy:
            Location.Accuracy.Balanced,
        });

      const initialCoords = {
        latitude:
          initialLocation.coords.latitude,
        longitude:
          initialLocation.coords.longitude,
      };

      setCurrentLocation(
        initialCoords
      );

      // Manual start is cleared
      setStartId("");

      // Clear old route results
      setResult(null);
      setRouteCoordinates([]);

      // ----------------------------------------------
      // REMOVE OLD WATCHER
      // ----------------------------------------------

      if (locationSubscription) {
        locationSubscription.remove();
      }

      // ----------------------------------------------
      // CONTINUOUS GPS WATCHER
      // ----------------------------------------------

      const subscription =
        await Location.watchPositionAsync(
          {
            accuracy:
              Location.Accuracy.Balanced,

            timeInterval: 5000,

            distanceInterval: 10,
          },

          (location) => {
            const coords = {
              latitude:
                location.coords.latitude,
              longitude:
                location.coords.longitude,
            };

            console.log(
              "📍 GPS UPDATE:",
              coords
            );

            setCurrentLocation(
              coords
            );

            setStatus(
              "📍 GPS tracking active"
            );
          }
        );

      setLocationSubscription(
        subscription
      );

      setGpsTracking(true);

      setStatus(
        "📍 GPS tracking active"
      );

      console.log(
        "✅ CONTINUOUS GPS TRACKING STARTED"
      );
    } catch (error) {
      console.log(
        "❌ GPS TRACKING ERROR:",
        error
      );

      setStatus(
        "❌ Could not start GPS tracking."
      );
    }
  };

  // ==================================================
  // STOP GPS TRACKING
  // ==================================================

  const stopGPSTracking = () => {
    if (locationSubscription) {
      locationSubscription.remove();

      setLocationSubscription(
        null
      );
    }

    setGpsTracking(false);

    setStatus(
      "GPS tracking stopped."
    );

    console.log(
      "🛑 GPS TRACKING STOPPED"
    );
  };

  // ==================================================
  // OSRM ROAD ROUTE
  // ==================================================

  const getOSRMRoute = async (
    startCoordinate,
    destinationCoordinate
  ) => {
    try {
      const coordinates =
        `${startCoordinate.longitude},${startCoordinate.latitude};` +
        `${destinationCoordinate.longitude},${destinationCoordinate.latitude}`;

      const response = await fetch(
        `${OSRM_URL}/${coordinates}?overview=simplified&geometries=geojson`
      );

      if (!response.ok) {
        throw new Error(
          `OSRM returned ${response.status}`
        );
      }

      const data =
        await response.json();

      if (
        !data.routes ||
        data.routes.length === 0
      ) {
        throw new Error(
          "No road route found."
        );
      }

      return data.routes[0].geometry.coordinates.map(
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

  // ==================================================
  // FIND ROUTE
  // ONLINE → OFFLINE FALLBACK
  // ==================================================

  const handleFindRoute = async () => {
    if (loadingRoute) {
      return;
    }

    // ----------------------------------------------
    // DESTINATION VALIDATION
    // ----------------------------------------------

    if (!destinationId) {
      setStatus(
        "Please select a destination."
      );

      return;
    }

    // ----------------------------------------------
    // START VALIDATION
    // ----------------------------------------------

    if (
      !startId &&
      !currentLocation
    ) {
      setStatus(
        "Please select a starting location or use GPS."
      );

      return;
    }

    // ----------------------------------------------
    // ROUTE CALCULATION
    // ----------------------------------------------

    try {
      setLoadingRoute(true);

      setResult(null);

      setRouteCoordinates([]);

      setStatus(
        "Analyzing safest and fastest routes..."
      );

      // ============================================
      // DETERMINE BACKEND START
      // ============================================

      let backendStartId;

      let mapStartCoordinate;

      // ----------------------------------------------
      // GPS START
      // ----------------------------------------------

      if (currentLocation) {
        let nearestLocation = null;

        let nearestDistance =
          Infinity;

        locations.forEach(
          (location) => {
            const lat =
              Number(
                location.latitude
              );

            const lng =
              Number(
                location.longitude
              );

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

            if (
              distance <
              nearestDistance
            ) {
              nearestDistance =
                distance;

              nearestLocation =
                location;
            }
          }
        );

        if (!nearestLocation) {
          throw new Error(
            "Could not determine nearest NER location."
          );
        }

        backendStartId =
          Number(
            nearestLocation.id
          );

        mapStartCoordinate =
          currentLocation;

        console.log(
          "📍 GPS NEAREST LOCATION:",
          nearestLocation.name
        );
      }

      // ----------------------------------------------
      // MANUAL START
      // ----------------------------------------------

      else {
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
          Number(
            startLocation.id
          );

        mapStartCoordinate = {
          latitude:
            Number(
              startLocation.latitude
            ),
          longitude:
            Number(
              startLocation.longitude
            ),
        };
      }

      // ============================================
      // DESTINATION
      // ============================================

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
        Number(
          destinationLocation.id
        );

      const mapDestinationCoordinate =
        {
          latitude:
            Number(
              destinationLocation.latitude
            ),
          longitude:
            Number(
              destinationLocation.longitude
            ),
        };

      // ----------------------------------------------
      // SAME LOCATION CHECK
      // ----------------------------------------------

      if (
        backendStartId ===
        backendDestinationId
      ) {
        throw new Error(
          "Starting location and destination cannot be the same."
        );
      }

      // ============================================
      // ROUTE ANALYSIS
      // ONLINE → BACKEND
      // OFFLINE → LOCAL SQLITE
      // ============================================

      let routeResult;

      try {
        // --------------------------------------------
        // ONLINE BACKEND
        // --------------------------------------------

        console.log(
          "🌐 Trying online backend route analysis..."
        );

        routeResult =
          await analyzeRoute(
            backendStartId,
            backendDestinationId
          );

        console.log(
          "✅ ONLINE ROUTE RESULT:",
          routeResult
        );

        routeResult = {
          ...routeResult,
          routingMode:
            "online",
        };
      } catch (onlineError) {
        // --------------------------------------------
        // OFFLINE FALLBACK
        // --------------------------------------------

        console.log(
          "📱 Backend unavailable. Switching to offline routing..."
        );

        console.log(
          "⚠️ Online route error:",
          onlineError.message
        );

        try {
          setStatus(
            "📱 Internet unavailable. Calculating route offline..."
          );

          routeResult =
            await analyzeOfflineRoute(
              backendStartId,
              backendDestinationId
            );

          console.log(
            "✅ OFFLINE ROUTE RESULT:",
            routeResult
          );

          // Make sure routing mode is visible
          routeResult = {
            ...routeResult,
            routingMode:
              "offline",
          };
        } catch (offlineError) {
          console.log(
            "❌ OFFLINE ROUTING ERROR:",
            offlineError
          );

          throw new Error(
            offlineError.message ||
              "Offline route calculation failed."
          );
        }
      }

      // ============================================
      // SAVE RESULT
      // ============================================

      setResult(
        routeResult
      );

      // ============================================
      // MAP ROAD ROUTE
      // ============================================

      /*
       * IMPORTANT:
       *
       * OSRM is an online service.
       *
       * The actual route intelligence above can
       * work completely offline using SQLite.
       *
       * If internet is unavailable, OSRM will fail
       * and return [].
       *
       * The route result will still be displayed.
       */

      const roadCoordinates =
        await getOSRMRoute(
          mapStartCoordinate,
          mapDestinationCoordinate
        );

      setRouteCoordinates(
        roadCoordinates
      );

      // ----------------------------------------------
      // FINAL STATUS
      // ----------------------------------------------

      if (
        routeResult.routingMode ===
        "offline"
      ) {
        setStatus(
          "📱 Offline route analysis completed."
        );
      } else {
        setStatus(
          "✅ Route analysis completed."
        );
      }
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

  // ==================================================
  // SELECTED LOCATIONS
  // ==================================================

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

  // ==================================================
  // MAP CENTER
  // ==================================================

  const mapCenter =
    currentLocation ||
    (selectedStart
      ? {
          latitude:
            Number(
              selectedStart.latitude
            ),
          longitude:
            Number(
              selectedStart.longitude
            ),
        }
      : {
          latitude: 26.1445,
          longitude: 91.7362,
        });

  // ==================================================
  // ETA FORMAT
  // ==================================================

  const formatETA = (
    minutes
  ) => {
    if (!minutes) {
      return "N/A";
    }

    const hours =
      Math.floor(
        minutes / 60
      );

    const mins =
      Math.round(
        minutes % 60
      );

    if (hours === 0) {
      return `${mins} min`;
    }

    return `${hours} hr ${mins} min`;
  };

  // ==================================================
  // UI
  // ==================================================

  return (
    <ScrollView
      contentContainerStyle={
        styles.container
      }
    >
      {/* ==================================================
          TITLE
      ================================================== */}

      <Text style={styles.title}>
        Find Best Route
      </Text>

      <Text style={styles.subtitle}>
        Plan a safer and smarter journey
        across the North Eastern Region.
      </Text>

      {/* ==================================================
          STATUS
      ================================================== */}

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

      {/* ==================================================
          STARTING LOCATION
      ================================================== */}

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

            if (value) {
              // Manual selection overrides GPS

              if (
                locationSubscription
              ) {
                locationSubscription.remove();

                setLocationSubscription(
                  null
                );
              }

              setGpsTracking(
                false
              );

              setCurrentLocation(
                null
              );
            }

            setResult(null);

            setRouteCoordinates(
              []
            );
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
                key={
                  location.id
                }
                label={`${location.name}, ${location.state}`}
                value={String(
                  location.id
                )}
              />
            )
          )}
        </Picker>
      </View>

      {/* ==================================================
          GPS BUTTON
      ================================================== */}

      <TouchableOpacity
        style={[
          styles.gpsButton,
          gpsTracking &&
            styles.gpsActiveButton,
        ]}
        onPress={
          gpsTracking
            ? stopGPSTracking
            : startGPSTracking
        }
        disabled={
          loadingRoute
        }
      >
        <Text
          style={
            styles.gpsButtonText
          }
        >
          {gpsTracking
            ? "🛑 Stop GPS Tracking"
            : "📍 Use My Current GPS Location"}
        </Text>
      </TouchableOpacity>

      {/* ==================================================
          DESTINATION
      ================================================== */}

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
            setDestinationId(
              value
            );

            setResult(null);

            setRouteCoordinates(
              []
            );
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
                key={
                  location.id
                }
                label={`${location.name}, ${location.state}`}
                value={String(
                  location.id
                )}
              />
            )
          )}
        </Picker>
      </View>

      {/* ==================================================
          FIND ROUTE BUTTON
      ================================================== */}

      <TouchableOpacity
        style={[
          styles.routeButton,
          loadingRoute &&
            styles.routeButtonDisabled,
        ]}
        onPress={
          handleFindRoute
        }
        disabled={
          loadingRoute
        }
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

      {/* ==================================================
          MAP
      ================================================== */}

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
          {/* CURRENT GPS */}

          {currentLocation && (
            <Marker
              coordinate={
                currentLocation
              }
              title="Your Current Location"
              description={
                gpsTracking
                  ? "Live GPS tracking"
                  : "GPS location"
              }
            />
          )}

          {/* START */}

          {!currentLocation &&
            selectedStart && (
              <Marker
                coordinate={{
                  latitude:
                    Number(
                      selectedStart.latitude
                    ),
                  longitude:
                    Number(
                      selectedStart.longitude
                    ),
                }}
                title={
                  selectedStart.name
                }
                description="Starting location"
              />
            )}

          {/* DESTINATION */}

          {selectedDestination && (
            <Marker
              coordinate={{
                latitude:
                  Number(
                    selectedDestination.latitude
                  ),
                longitude:
                  Number(
                    selectedDestination.longitude
                  ),
              }}
              title={
                selectedDestination.name
              }
              description="Destination"
            />
          )}

          {/* ROUTE */}

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

      {/* ==================================================
          RESULTS
      ================================================== */}

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

          {/* ==================================================
              RECOMMENDATION
          ================================================== */}

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

          {/* ==================================================
              FASTEST ROUTE
          ================================================== */}

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
                {
                  result
                    .fastestRoute
                    .hazardsEncountered
                    ?.length ||
                  0
                }
              </Text>
            </View>
          )}

          {/* ==================================================
              SAFEST ROUTE
          ================================================== */}

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
                {
                  result
                    .safestRoute
                    .hazardsEncountered
                    ?.length ||
                  0
                }
              </Text>
            </View>
          )}

          {/* ==================================================
              ROUTING MODE
          ================================================== */}

          {result.routingMode && (
            <Text
              style={
                styles.aiStatus
              }
            >
              Routing Mode:{" "}
              {result.routingMode ===
              "offline"
                ? "📱 Offline SQLite"
                : "🌐 Online Backend"}
            </Text>
          )}

          {/* ==================================================
              AI ENGINE STATUS
          ================================================== */}

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

  gpsActiveButton: {
    backgroundColor: "#A9573F",
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
    marginBottom: 5,
  },
});