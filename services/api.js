const API_URL = "http://192.168.50.219:5000";

// Check backend connection
export const checkBackend = async () => {
  try {
    const response = await fetch(`${API_URL}/health`);

    if (!response.ok) {
      throw new Error(`Backend returned ${response.status}`);
    }

    const data = await response.json();

    console.log("✅ BACKEND CONNECTED:", data);

    return data;
  } catch (error) {
    console.log("❌ BACKEND CONNECTION ERROR:", error);
    throw error;
  }
};

// Get all NER locations
export const getLocations = async () => {
  try {
    const response = await fetch(`${API_URL}/api/v1/locations`);

    if (!response.ok) {
      throw new Error(`Locations request failed: ${response.status}`);
    }

    const data = await response.json();

    console.log("✅ LOCATIONS LOADED:", data.count);

    return data.data;
  } catch (error) {
    console.log("❌ LOCATIONS ERROR:", error);
    throw error;
  }
};

// Analyze fastest vs safest route
export const analyzeRoute = async (originId, destinationId) => {
  try {
    const response = await fetch(
      `${API_URL}/api/v1/routes/analyze`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          origin_id: originId,
          destination_id: destinationId,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || `Route analysis failed: ${response.status}`
      );
    }

    console.log("✅ ROUTE ANALYSIS:", data);

    return data.data;
  } catch (error) {
    console.log("❌ ROUTE ANALYSIS ERROR:", error);
    throw error;
  }
};

export default API_URL;
// Get all road segments for offline routing
export const getRoadSegments = async () => {
  try {
    const response = await fetch(
      `${API_URL}/api/v1/road-segments`
    );

    if (!response.ok) {
      throw new Error(
        `Road segments request failed: ${response.status}`
      );
    }

    const data = await response.json();

    console.log("✅ ROAD SEGMENTS LOADED:", data.count);

    return data.data;
  } catch (error) {
    console.log("❌ ROAD SEGMENTS ERROR:", error);
    throw error;
  }
};

// Get active disruptions for offline routing
export const getDisruptions = async () => {
  try {
    const response = await fetch(
      `${API_URL}/api/v1/disruptions?status=active`
    );

    if (!response.ok) {
      throw new Error(
        `Disruptions request failed: ${response.status}`
      );
    }

    const data = await response.json();

    console.log("✅ DISRUPTIONS LOADED:", data.count);

    return data.data;
  } catch (error) {
    console.log("❌ DISRUPTIONS ERROR:", error);
    throw error;
  }
};

// Get weather data for offline routing
export const getWeather = async () => {
  try {
    const response = await fetch(
      `${API_URL}/api/v1/weather`
    );

    if (!response.ok) {
      throw new Error(
        `Weather request failed: ${response.status}`
      );
    }

    const data = await response.json();

    console.log("✅ WEATHER LOADED:", data.count);

    return data.data;
  } catch (error) {
    console.log("❌ WEATHER ERROR:", error);
    throw error;
  }
};