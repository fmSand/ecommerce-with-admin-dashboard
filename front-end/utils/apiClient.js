const API_BASE_URL = process.env.API_URL || "http://localhost:3000";

async function request(method, path, req, body) {
  const headers = {};
  if (body) headers["Content-Type"] = "application/json";
  if (req.session?.token) headers.Authorization = `Bearer ${req.session.token}`;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const json = await response.json();
  const statusCode = json.statuscode ?? response.status;

  if (statusCode === 401) {
    const err = new Error(json?.data?.result || "Unauthorized");
    err.statusCode = 401;
    throw err;
  }
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
