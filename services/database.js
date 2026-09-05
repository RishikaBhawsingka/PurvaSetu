
import * as SQLite from "expo-sqlite";

let db;

/**
 * Initialize local SQLite database
 */
export const initDatabase = async () => {
  try {
    db = await SQLite.openDatabaseAsync("purvasetu.db");

    await db.execAsync(`
      -- ============================================
      -- 1. LOCATIONS (Graph Nodes)
      -- ============================================
      CREATE TABLE IF NOT EXISTS locations (
        id INTEGER PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        state TEXT,
        elevation_m INTEGER DEFAULT 100,
        location_type TEXT
      );

      -- ============================================
      -- 2. ROAD SEGMENTS (Graph Edges)
      -- ============================================
      CREATE TABLE IF NOT EXISTS road_segments (
        id INTEGER PRIMARY KEY NOT NULL,
        origin_location_id INTEGER NOT NULL,
        destination_location_id INTEGER NOT NULL,
        highway_code TEXT NOT NULL,
        distance_km REAL NOT NULL,
        base_transit_time_min INTEGER NOT NULL,
        terrain_type TEXT DEFAULT 'plain',
        road_condition TEXT DEFAULT 'good',
        slope_angle_deg REAL DEFAULT 0.0,
        is_bidirectional INTEGER DEFAULT 1,
        is_active INTEGER DEFAULT 1
      );

      -- ============================================
      -- 3. DISRUPTIONS (Road Hazards)
      -- ============================================
      CREATE TABLE IF NOT EXISTS disruptions (
        id INTEGER PRIMARY KEY NOT NULL,
        road_segment_id INTEGER NOT NULL,
        disruption_type TEXT NOT NULL,
        severity TEXT NOT NULL,
        description TEXT,
        status TEXT DEFAULT 'active',
        reported_at TEXT,
        expected_clearance TEXT
      );

      -- ============================================
      -- 4. WEATHER DATA
      -- ============================================
      CREATE TABLE IF NOT EXISTS weather_data (
        id INTEGER PRIMARY KEY NOT NULL,
        location_id INTEGER NOT NULL,
        rainfall_mm_24h REAL DEFAULT 0.0,
        wind_speed_kmh REAL DEFAULT 0.0,
        fog_visibility_m REAL DEFAULT 10000.0,
        landslide_risk_index REAL DEFAULT 0.0,
        flood_warning_level TEXT DEFAULT 'none',
        recorded_at TEXT
      );
          -- ============================================
      -- 5. USERS (Local Authentication)
      -- ============================================
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        phone TEXT NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);

      

    console.log("✅ SQLite database initialized");

    return db;
  } catch (error) {
    console.log("❌ SQLite initialization error:", error);
    throw error;
  }
};

/**
 * Get database instance
 */
export const getDatabase = async () => {
  if (!db) {
    await initDatabase();
  }

  return db;
};

/* =========================================================
   LOCATIONS
   ========================================================= */

export const saveLocations = async (locations) => {
  try {
    const database = await getDatabase();

    await database.withTransactionAsync(async () => {
      for (const location of locations) {
        await database.runAsync(
          `
          INSERT OR REPLACE INTO locations
          (
            id,
            name,
            latitude,
            longitude,
            state,
            elevation_m,
            location_type
          )
          VALUES (?, ?, ?, ?, ?, ?, ?)
          `,
          location.id,
          location.name,
          location.latitude,
          location.longitude,
          location.state || "",
          location.elevation_m || 100,
          location.location_type || "logistics_hub"
        );
      }
    });

    console.log(`✅ ${locations.length} locations saved to SQLite`);
  } catch (error) {
    console.log("❌ Error saving locations:", error);
    throw error;
  }
};

export const getLocalLocations = async () => {
  try {
    const database = await getDatabase();

    const locations = await database.getAllAsync(
      "SELECT * FROM locations ORDER BY name ASC"
    );

    console.log(`📦 SQLite locations loaded: ${locations.length}`);

    return locations;
  } catch (error) {
    console.log("❌ Error reading SQLite locations:", error);
    throw error;
  }
};

export const clearLocations = async () => {
  try {
    const database = await getDatabase();

    await database.runAsync("DELETE FROM locations");

    console.log("🗑️ SQLite locations cleared");
  } catch (error) {
    console.log("❌ Error clearing locations:", error);
  }
};

/* =========================================================
   ROAD SEGMENTS
   ========================================================= */

export const saveRoadSegments = async (segments) => {
  try {
    const database = await getDatabase();

    await database.withTransactionAsync(async () => {
      for (const segment of segments) {
        await database.runAsync(
          `
          INSERT OR REPLACE INTO road_segments
          (
            id,
            origin_location_id,
            destination_location_id,
            highway_code,
            distance_km,
            base_transit_time_min,
            terrain_type,
            road_condition,
            slope_angle_deg,
            is_bidirectional,
            is_active
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `,
          segment.id,
          segment.origin_location_id,
          segment.destination_location_id,
          segment.highway_code,
          segment.distance_km,
          segment.base_transit_time_min,
          segment.terrain_type || "plain",
          segment.road_condition || "good",
          segment.slope_angle_deg || 0,
          segment.is_bidirectional ? 1 : 0,
          segment.is_active === false ? 0 : 1
        );
      }
    });

    console.log(`✅ ${segments.length} road segments saved to SQLite`);
  } catch (error) {
    console.log("❌ Error saving road segments:", error);
    throw error;
  }
};

export const getLocalRoadSegments = async () => {
  try {
    const database = await getDatabase();

    const segments = await database.getAllAsync(
      "SELECT * FROM road_segments WHERE is_active = 1"
    );

    console.log(`📦 SQLite road segments loaded: ${segments.length}`);

    return segments;
  } catch (error) {
    console.log("❌ Error reading road segments:", error);
    throw error;
  }
};

export const clearRoadSegments = async () => {
  try {
    const database = await getDatabase();

    await database.runAsync("DELETE FROM road_segments");

    console.log("🗑️ SQLite road segments cleared");
  } catch (error) {
    console.log("❌ Error clearing road segments:", error);
  }
};

/* =========================================================
   DISRUPTIONS
   ========================================================= */

export const saveDisruptions = async (disruptions) => {
  try {
    const database = await getDatabase();

    await database.withTransactionAsync(async () => {
      for (const disruption of disruptions) {
        await database.runAsync(
          `
          INSERT OR REPLACE INTO disruptions
          (
            id,
            road_segment_id,
            disruption_type,
            severity,
            description,
            status,
            reported_at,
            expected_clearance
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `,
          disruption.id,
          disruption.road_segment_id,
          disruption.disruption_type,
          disruption.severity,
          disruption.description || "",
          disruption.status || "active",
          disruption.reported_at || null,
          disruption.expected_clearance || null
        );
      }
    });

    console.log(`✅ ${disruptions.length} disruptions saved to SQLite`);
  } catch (error) {
    console.log("❌ Error saving disruptions:", error);
    throw error;
  }
};

export const getLocalDisruptions = async () => {
  try {
    const database = await getDatabase();

    const disruptions = await database.getAllAsync(
      "SELECT * FROM disruptions WHERE status = 'active'"
    );

    console.log(`📦 SQLite active disruptions loaded: ${disruptions.length}`);

    return disruptions;
  } catch (error) {
    console.log("❌ Error reading disruptions:", error);
    throw error;
  }
};

export const clearDisruptions = async () => {
  try {
    const database = await getDatabase();

    await database.runAsync("DELETE FROM disruptions");

    console.log("🗑️ SQLite disruptions cleared");
  } catch (error) {
    console.log("❌ Error clearing disruptions:", error);
  }
};

/* =========================================================
   WEATHER DATA
   ========================================================= */

export const saveWeatherData = async (weatherRecords) => {
  try {
    const database = await getDatabase();

    await database.withTransactionAsync(async () => {
      for (const weather of weatherRecords) {
        await database.runAsync(
          `
          INSERT OR REPLACE INTO weather_data
          (
            id,
            location_id,
            rainfall_mm_24h,
            wind_speed_kmh,
            fog_visibility_m,
            landslide_risk_index,
            flood_warning_level,
            recorded_at
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `,
          weather.id,
          weather.location_id,
          weather.rainfall_mm_24h || 0,
          weather.wind_speed_kmh || 0,
          weather.fog_visibility_m || 10000,
          weather.landslide_risk_index || 0,
          weather.flood_warning_level || "none",
          weather.recorded_at || null
        );
      }
    });

    console.log(`✅ ${weatherRecords.length} weather records saved to SQLite`);
  } catch (error) {
    console.log("❌ Error saving weather data:", error);
    throw error;
  }
};

export const getLocalWeatherData = async () => {
  try {
    const database = await getDatabase();

    const weather = await database.getAllAsync(
      "SELECT * FROM weather_data"
    );

    console.log(`📦 SQLite weather records loaded: ${weather.length}`);

    return weather;
  } catch (error) {
    console.log("❌ Error reading weather data:", error);
    throw error;
  }
};

export const clearWeatherData = async () => {
  try {
    const database = await getDatabase();

    await database.runAsync("DELETE FROM weather_data");

    console.log("🗑️ SQLite weather data cleared");
  } catch (error) {
    console.log("❌ Error clearing weather data:", error);
  }
};

/* =========================================================
   CLEAR ALL OFFLINE ROUTING DATA
   ========================================================= */

export const clearOfflineRoutingData = async () => {
  try {
    const database = await getDatabase();

    await database.withTransactionAsync(async () => {
      await database.runAsync("DELETE FROM road_segments");
      await database.runAsync("DELETE FROM disruptions");
      await database.runAsync("DELETE FROM weather_data");
      await database.runAsync("DELETE FROM locations");
    });

    console.log("🗑️ All offline routing data cleared");
  } catch (error) {
    console.log("❌ Error clearing offline routing data:", error);
  }
};
import {
  getLocations,
  getRoadSegments,
  getDisruptions,
  getWeather,
} from "./api";

export const syncOfflineRoutingData = async () => {
  try {
    console.log("🔄 Starting offline routing data sync...");

    // 1. Fetch locations
    const locations = await getLocations();

    // 2. Fetch road network
    const roadSegments = await getRoadSegments();

    // 3. Fetch active disruptions
    const disruptions = await getDisruptions();

    // 4. Fetch weather
    const weather = await getWeather();

    console.log("📥 API data downloaded");

    // Save everything into mobile SQLite
    await saveLocations(locations);
    await saveRoadSegments(roadSegments);
    await saveDisruptions(disruptions);
    await saveWeatherData(weather);

    console.log("================================");
    console.log("✅ OFFLINE ROUTING DATA SYNCED");
    console.log(`📍 Locations: ${locations.length}`);
    console.log(`🛣️ Road segments: ${roadSegments.length}`);
    console.log(`⚠️ Disruptions: ${disruptions.length}`);
    console.log(`🌦️ Weather records: ${weather.length}`);
    console.log("================================");

    return {
      success: true,
      locations: locations.length,
      roadSegments: roadSegments.length,
      disruptions: disruptions.length,
      weather: weather.length,
    };

  } catch (error) {
    console.log("❌ OFFLINE SYNC FAILED:", error);

    return {
      success: false,
      error: error.message,
    };
  }
};
export const resetDatabase = async () => {
  try {
    const database = await getDatabase();

    await database.execAsync(`
      DROP TABLE IF EXISTS locations;
      DROP TABLE IF EXISTS road_segments;
      DROP TABLE IF EXISTS disruptions;
      DROP TABLE IF EXISTS weather_data;

      CREATE TABLE locations (
        id INTEGER PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        state TEXT,
        elevation_m INTEGER DEFAULT 100,
        location_type TEXT
      );

      CREATE TABLE road_segments (
        id INTEGER PRIMARY KEY NOT NULL,
        origin_location_id INTEGER NOT NULL,
        destination_location_id INTEGER NOT NULL,
        highway_code TEXT NOT NULL,
        distance_km REAL NOT NULL,
        base_transit_time_min INTEGER NOT NULL,
        terrain_type TEXT DEFAULT 'plain',
        road_condition TEXT DEFAULT 'good',
        slope_angle_deg REAL DEFAULT 0.0,
        is_bidirectional INTEGER DEFAULT 1,
        is_active INTEGER DEFAULT 1
      );

      CREATE TABLE disruptions (
        id INTEGER PRIMARY KEY NOT NULL,
        road_segment_id INTEGER NOT NULL,
        disruption_type TEXT NOT NULL,
        severity TEXT NOT NULL,
        description TEXT,
        status TEXT DEFAULT 'active',
        reported_at TEXT,
        expected_clearance TEXT
      );

      CREATE TABLE weather_data (
        id INTEGER PRIMARY KEY NOT NULL,
        location_id INTEGER NOT NULL,
        rainfall_mm_24h REAL DEFAULT 0.0,
        wind_speed_kmh REAL DEFAULT 0.0,
        fog_visibility_m REAL DEFAULT 10000.0,
        landslide_risk_index REAL DEFAULT 0.0,
        flood_warning_level TEXT DEFAULT 'none',
        recorded_at TEXT
      );
    `);

    console.log("🗑️ SQLite database reset");
    console.log("✅ SQLite database recreated with latest schema");
  } catch (error) {
    console.log("❌ SQLite reset failed:", error);
    throw error;
  }
};
/* =========================================================
   USERS / AUTHENTICATION
   ========================================================= */

export const createUser = async ({
  name,
  email,
  phone,
  password,
  role,
}) => {
  try {
    const database = await getDatabase();

    const result = await database.runAsync(
      `
      INSERT INTO users
      (name, email, phone, password, role)
      VALUES (?, ?, ?, ?, ?)
      `,
      name.trim(),
      email.trim().toLowerCase(),
      phone.trim(),
      password,
      role
    );

    console.log("✅ User created:", result.lastInsertRowId);

    return result;
  } catch (error) {
    console.log("❌ Error creating user:", error);
    throw error;
  }
};

export const getUserByEmail = async (email) => {
  try {
    const database = await getDatabase();

    const user = await database.getFirstAsync(
      `
      SELECT *
      FROM users
      WHERE email = ?
      `,
      email.trim().toLowerCase()
    );

    return user || null;
  } catch (error) {
    console.log("❌ Error finding user:", error);
    throw error;
  }
};

export const authenticateUser = async (
  email,
  password
) => {
  try {
    const database = await getDatabase();

    const user = await database.getFirstAsync(
      `
      SELECT id, name, email, phone, role
      FROM users
      WHERE email = ?
      AND password = ?
      `,
      email.trim().toLowerCase(),
      password
    );

    return user || null;
  } catch (error) {
    console.log("❌ Authentication error:", error);
    throw error;
  }
};
