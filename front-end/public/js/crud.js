async function apiPost(url, body) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

async function apiPut(url, body) {
  const res = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

async function apiDelete(url) {
  const res = await fetch(url, { method: "DELETE" });
  return res.json();
}

function showAlert(message, type = "success") {
  const container = document.getElementById("alert-container");
  if (!container) return;

  const icon =
    type === "success"
      ? "bi-check-circle-fill"
      : type === "warning"
        ? "bi-exclamation-circle-fill"
        : "bi-exclamation-triangle-fill";

  const role = type === "error" || type === "warning" ? "alert" : "status";
  container.innerHTML = `
    <div class="alert alert-theme-${type} alert-dismissible mb-3" role="${role}">
      <i class="bi ${icon} me-2" aria-hidden="true"></i>
      ${message}
      <button type="button" class="btn-close btn-close-sm ms-auto" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
  `;
}
