export const baseUrl = "http://localhost:5000/api";

export const postRequest = async (url, body) => {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    // Try to read response as text to log it
    const text = await response.text();
    console.log("Raw POST response:", text); // Log raw response text

    // Parse JSON if the response is valid
    const data = JSON.parse(text); // Use JSON.parse to handle potential errors

    console.log("POST Request:", url, body, data);

    if (!response.ok) {
      let message = data?.message || "An error occurred";
      return { error: true, message };
    }

    return data;
  } catch (error) {
    console.error("Error making POST request:", error);
    return { error: true, message: "Network error or server is down" };
  }
};



export const getRequest = async (url) => {
  try {
    const response = await fetch(url);

    // Try to parse the response as JSON
    const data = await response.json();

    console.log("GET Request:", url, data);

    // Check if the response was not okay (status code not in the range 200-299)
    if (!response.ok) {
      let message = data?.message || "An error occurred";
      return { error: true, message };
    }

    return data; // Return the parsed JSON data
  } catch (error) {
    console.error("Error making GET request:", error);
    return { error: true, message: "Network error or server is down" };
  }
};
