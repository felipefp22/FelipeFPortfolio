import axios from "axios";

export async function searchAddress(query) {
    console.log("Searching address for query:", query);
  try {
    const response = await axios.get("https://nominatim.openstreetmap.org/search", {
      params: {
        format: "json",
        q: query
      },
      headers: {
        "Accept-Language": "en",
      }
    });

    return response;
  } catch (error) {
    console.error("Error searching address:", error);
    return error?.response;
  }
}
