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