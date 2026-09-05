import {
  getLocalLocations,
  getLocalRoadSegments,
  getLocalDisruptions,
  getLocalWeatherData,
} from "./database";

// ============================================================
// RISK CONFIGURATION
// Same logic as backend riskService.js
// ============================================================

const DEFAULT_WEIGHTS = {
  terrain: 0.25,
  condition: 0.20,
  weather: 0.25,
  disruption: 0.30,
};

const TERRAIN_RATINGS = {
  plain: 0.0,
  hilly: 0.35,
  steep_mountain: 0.70,
  high_pass: 1.0,
};

const CONDITION_RATINGS = {
  good: 0.0,
  fair: 0.35,
  poor: 0.70,
  critical: 1.0,
};

const DISRUPTION_RATINGS = {
  cleared: 0.0,
  low: 0.25,
  moderate: 0.50,
  high: 0.75,
  critical_blocked: 1.0,
};

// ============================================================
// SEVERITY
// ============================================================

const getSeverityBand = (score) => {
  if (score >= 0.75) return "Critical";
  if (score >= 0.50) return "High";
  if (score >= 0.25) return "Moderate";
  return "Low";
};

// ============================================================
// HAVERSINE DISTANCE
// ============================================================

const haversineDistance = (
  lat1,
  lon1,
  lat2,
  lon2
) => {
  const R = 6371;

  const dLat =
    ((lat2 - lat1) * Math.PI) / 180;

  const dLon =
    ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) *
      Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  return (
    R *
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    )
  );
};

// ============================================================
// CALCULATE SEGMENT RISK
// ============================================================

const evaluateSegmentRisk = (
  segment,
  disruption = null,
  weather = null
) => {
  const weights = DEFAULT_WEIGHTS;

  const terrainScore =
    TERRAIN_RATINGS[
      segment.terrain_type
    ] ?? 0;

  const conditionScore =
    CONDITION_RATINGS[
      segment.road_condition
    ] ?? 0;

  let disruptionScore = 0;
  let isBlocked = false;

  if (
    disruption &&
    disruption.status === "active"
  ) {
    if (
      disruption.severity ===
      "critical_blocked"
    ) {
      isBlocked = true;
      disruptionScore = 1;
    } else {
      disruptionScore =
        DISRUPTION_RATINGS[
          disruption.severity
        ] ?? 0.25;
    }
  }

  let weatherScore = 0;

  if (weather) {
    const rainfallNorm = Math.min(
      1,
      (weather.rainfall_mm_24h || 0) /
        200
    );

    const landslideNorm = Math.min(
      1,
      Math.max(
        0,
        weather.landslide_risk_index || 0
      )
    );

    weatherScore = Math.min(
      1,
      0.5 * rainfallNorm +
        0.5 * landslideNorm
    );
  }

  const rawRiskScore =
    weights.terrain *
      terrainScore +
    weights.condition *
      conditionScore +
    weights.weather *
      weatherScore +
    weights.disruption *
      disruptionScore;

  const riskScore = isBlocked
    ? Infinity
    : Number(
        Math.min(
          1,
          Math.max(0, rawRiskScore)
        ).toFixed(2)
      );

  return {
    riskScore,
    severityBand: getSeverityBand(
      isBlocked ? 1 : riskScore
    ),
    isBlocked,
  };
};

// ============================================================
// BUILD LOCAL GRAPH
// ============================================================

const buildGraph = (
  locations,
  segments,
  disruptions,
  weatherRecords
) => {
  const graph = new Map();
  const locationsMap = new Map();

  locations.forEach((location) => {
    const id = Number(location.id);

    locationsMap.set(id, location);

    if (!graph.has(id)) {
      graph.set(id, []);
    }
  });

  // Active disruption by road segment
  const disruptionMap = new Map();

  disruptions.forEach((disruption) => {
    if (
      disruption.status === "active"
    ) {
      disruptionMap.set(
        Number(disruption.road_segment_id),
        disruption
      );
    }
  });

  // Weather by location
  const weatherMap = new Map();

  weatherRecords.forEach((weather) => {
    weatherMap.set(
      Number(weather.location_id),
      weather
    );
  });

  segments.forEach((segment) => {
    if (
      Number(segment.is_active) !== 1
    ) {
      return;
    }

    const originId = Number(
      segment.origin_location_id
    );

    const destinationId = Number(
      segment.destination_location_id
    );

    const disruption =
      disruptionMap.get(
        Number(segment.id)
      ) || null;

    const originWeather =
      weatherMap.get(originId) || null;

    const destinationWeather =
      weatherMap.get(destinationId) || null;

    // Use the higher-risk weather value
    let weather = originWeather;

    if (
      destinationWeather &&
      (!weather ||
        (destinationWeather
          .landslide_risk_index || 0) >
          (weather.landslide_risk_index ||
            0))
    ) {
      weather = destinationWeather;
    }

    const risk =
      evaluateSegmentRisk(
        segment,
        disruption,
        weather
      );

    const edge = {
      segmentId: Number(segment.id),
      originId,
      destinationId,
      highwayCode:
        segment.highway_code,
      distanceKm: Number(
        segment.distance_km
      ),
      baseTransitTimeMin: Number(
        segment.base_transit_time_min
      ),
      terrainType:
        segment.terrain_type,
      roadCondition:
        segment.road_condition,
      riskScore: risk.riskScore,
      severityBand:
        risk.severityBand,
      isBlocked: risk.isBlocked,
      disruption,
    };

    if (!graph.has(originId)) {
      graph.set(originId, []);
    }

    graph.get(originId).push(edge);

    // Bidirectional road
    if (
      Number(segment.is_bidirectional) ===
      1
    ) {
      const reverseEdge = {
        ...edge,
        originId: destinationId,
        destinationId: originId,
      };

      if (!graph.has(destinationId)) {
        graph.set(destinationId, []);
      }

      graph
        .get(destinationId)
        .push(reverseEdge);
    }
  });

  return {
    graph,
    locationsMap,
  };
};

// ============================================================
// HEURISTIC
// ============================================================

const calculateHeuristic = (
  locationA,
  locationB
) => {
  if (!locationA || !locationB) {
    return 0;
  }

  return haversineDistance(
    Number(locationA.latitude),
    Number(locationA.longitude),
    Number(locationB.latitude),
    Number(locationB.longitude)
  );
};

// ============================================================
// FIND PATH
// ============================================================

const findPath = (
  graph,
  locationsMap,
  originId,
  destinationId,
  mode
) => {
  const startId = Number(originId);
  const endId = Number(destinationId);

  if (
    !graph.has(startId) ||
    !graph.has(endId)
  ) {
    return null;
  }

  const distances = new Map();
  const previous = new Map();
  const visited = new Set();

  distances.set(startId, 0);

  const queue = [
    {
      id: startId,
      cost: 0,
    },
  ];

  while (queue.length > 0) {
    queue.sort(
      (a, b) => a.cost - b.cost
    );

    const current =
      queue.shift();

    const currentId =
      current.id;

    if (
      visited.has(currentId)
    ) {
      continue;
    }

    visited.add(currentId);

    if (
      currentId === endId
    ) {
      break;
    }

    const edges =
      graph.get(currentId) || [];

    for (const edge of edges) {
      // Never use blocked roads
      if (edge.isBlocked) {
        continue;
      }

      let edgeCost;

      if (mode === "fastest") {
        edgeCost =
          edge.baseTransitTimeMin;

        if (edge.disruption) {
          if (
            edge.disruption.severity ===
            "high"
          ) {
            edgeCost += 60;
          } else {
            edgeCost += 30;
          }
        }
      } else {
        // Safest route
        edgeCost =
          edge.distanceKm +
          edge.distanceKm *
            edge.riskScore *
            10;
      }

      const newDistance =
        (distances.get(
          currentId
        ) ?? Infinity) +
        edgeCost;

      const oldDistance =
        distances.get(
          edge.destinationId
        ) ?? Infinity;

      if (
        newDistance <
        oldDistance
      ) {
        distances.set(
          edge.destinationId,
          newDistance
        );

        previous.set(
          edge.destinationId,
          {
            nodeId: currentId,
            edge,
          }
        );

        const destination =
          locationsMap.get(
            edge.destinationId
          );

        const heuristic =
          calculateHeuristic(
            destination,
            locationsMap.get(endId)
          );

        queue.push({
          id: edge.destinationId,
          cost:
            newDistance +
            heuristic,
        });
      }
    }
  }

  if (!distances.has(endId)) {
    return null;
  }

  // ==========================================================
  // RECONSTRUCT PATH
  // ==========================================================

  const pathNodes = [];
  const pathEdges = [];

  let currentId = endId;

  while (currentId !== startId) {
    pathNodes.unshift(
      currentId
    );

    const previousNode =
      previous.get(currentId);

    if (!previousNode) {
      return null;
    }

    pathEdges.unshift(
      previousNode.edge
    );

    currentId =
      previousNode.nodeId;
  }

  pathNodes.unshift(startId);

  // ==========================================================
  // ROUTE METRICS
  // ==========================================================

  let totalDistanceKm = 0;
  let totalTransitTimeMin = 0;
  let totalRisk = 0;
  let riskCount = 0;

  const hazards = [];

  pathEdges.forEach((edge) => {
    totalDistanceKm +=
      edge.distanceKm;

    totalTransitTimeMin +=
      edge.baseTransitTimeMin;

    if (
      Number.isFinite(
        edge.riskScore
      )
    ) {
      totalRisk +=
        edge.riskScore;

      riskCount++;
    }

    if (edge.disruption) {
      hazards.push({
        ...edge.disruption,
        road_segment_id:
          edge.segmentId,
        highway_code:
          edge.highwayCode,
      });
    }
  });

  const averageRiskScore =
    riskCount > 0
      ? Number(
          (
            totalRisk /
            riskCount
          ).toFixed(2)
        )
      : 0;

  const severityBand =
    getSeverityBand(
      averageRiskScore
    );

  return {
    totalDistanceKm: Number(
      totalDistanceKm.toFixed(2)
    ),

    totalTransitTimeMin,

    averageRiskScore,

    severityBand,

    nodesCount:
      pathNodes.length,

    pathNodes,

    pathSegments:
      pathEdges.map(
        (edge) => edge.segmentId
      ),

    hazardsEncountered:
      hazards,
  };
};

// ============================================================
// MAIN OFFLINE ROUTE ANALYSIS
// ============================================================

export const analyzeOfflineRoute = async (
  originId,
  destinationId
) => {
  console.log(
    "📱 OFFLINE ROUTING STARTED"
  );

  const locations =
    await getLocalLocations();

  const segments =
    await getLocalRoadSegments();

  const disruptions =
    await getLocalDisruptions();

  const weather =
    await getLocalWeatherData();

  console.log(
    `📦 Offline data: ${locations.length} locations, ${segments.length} segments, ${disruptions.length} disruptions, ${weather.length} weather`
  );

  if (
    locations.length === 0 ||
    segments.length === 0
  ) {
    throw new Error(
      "Offline routing data is not available. Please connect to the internet once to download route data."
    );
  }

  const {
    graph,
    locationsMap,
  } = buildGraph(
    locations,
    segments,
    disruptions,
    weather
  );

  const fastestRoute =
    findPath(
      graph,
      locationsMap,
      originId,
      destinationId,
      "fastest"
    );

  const safestRoute =
    findPath(
      graph,
      locationsMap,
      originId,
      destinationId,
      "safest"
    );

  if (
    !fastestRoute &&
    !safestRoute
  ) {
    throw new Error(
      "No offline route found between the selected locations."
    );
  }

  let recommendation =
    "Safest route recommended.";

  if (
    fastestRoute &&
    safestRoute
  ) {
    if (
      fastestRoute.totalTransitTimeMin <=
        safestRoute.totalTransitTimeMin &&
      fastestRoute.averageRiskScore <=
        safestRoute.averageRiskScore +
          0.10
    ) {
      recommendation =
        "Fastest route is also reasonably safe.";
    } else if (
      safestRoute.averageRiskScore <
      fastestRoute.averageRiskScore
    ) {
      recommendation =
        "Safest route recommended due to lower risk.";
    } else {
      recommendation =
        "Fastest route recommended for shorter travel time.";
    }
  } else if (safestRoute) {
    recommendation =
      "Safest available route recommended.";
  } else {
    recommendation =
      "Fastest available route recommended.";
  }

  const result = {
    fastestRoute,
    safestRoute,
    recommendation,

    // Important for UI
    aiEngineStatus:
      "Offline SQLite Routing Engine",

    routingMode: "offline",
  };

  console.log(
    "✅ OFFLINE ROUTE RESULT:",
    result
  );

  return result;
};