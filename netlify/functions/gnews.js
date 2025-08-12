export async function handler(event) {
  const API_KEY = process.env.GNEWS_API_KEY;
  const query = event.queryStringParameters.q || "latest";
  const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=en&token=${API_KEY}`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      return {
        statusCode: res.status,
        body: JSON.stringify({
          error: `Failed to fetch news: ${res.statusText}`,
        }),
      };
    }
    const data = await res.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
}
