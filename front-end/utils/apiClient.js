const API_BASE_URL = process.env.API_URL || "http://localhost:3000";

async function request(method, path, req, body) {
  const headers = {};
  if (body) headers["Content-Type"] = "application/json";
  if (req.session?.token) headers.Authorization = `Bearer ${req.session.token}`;

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(10000),
    });
  } catch (err) {
    if (err.name === "TimeoutError") {
      const e = new Error(`Request timed out: ${method} ${path}`);
      e.statusCode = 504;
      throw e;
    }
    throw err;
  }

  const contentType = response.headers.get("content-type");
  if (!contentType?.includes("application/json")) {
    const err = new Error(`Non-JSON response: ${response.status} ${response.statusText}`);
    err.statusCode = response.status;
    throw err;
  }

  const json = await response.json();
  const statusCode = json.statuscode ?? response.status;

  if (!response.ok || json.status === "error") {
    const err = new Error(json?.data?.result || `Request failed (${statusCode})`);
    err.statusCode = statusCode;
    err.data = json.data;
    throw err;
  }

  return json.data;
}

module.exports = {
  get: (path, req) => request("GET", path, req),
  post: (path, req, body) => request("POST", path, req, body),
  put: (path, req, body) => request("PUT", path, req, body),
  delete: (path, req) => request("DELETE", path, req),
};
