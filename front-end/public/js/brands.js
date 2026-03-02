document.addEventListener("DOMContentLoaded", () => {
  //DELETE
  document.querySelectorAll(".brand-delete-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const row = btn.closest("tr");
      const id = row.dataset.id;
      const name = row.querySelector(".brand-name").textContent.trim();
      if (!confirm(`Delete brand "${name}"?`)) return;
      try {
        const data = await apiDelete(`/brands/${id}`);
        if (data.status === "success") {
          row.remove();
          showAlert("Brand deleted");
        } else showAlert(data.data?.result || "Delete failed", "danger");
      } catch {
        showAlert("Request failed. Please try again.", "danger");
      }
    });
  });

  //EDIT
  document.querySelectorAll(".brand-edit-btn").forEach((btn) => {
    const row = btn.closest("tr");
    const id = row.dataset.id;
    const nameSpan = row.querySelector(".brand-name");
    const actionsDiv = row.querySelector(".brand-actions");
    const editForm = row.querySelector(".brand-edit-form");
    const editActions = row.querySelector(".brand-edit-actions");
    const input = editForm.querySelector("input");

    function openEdit() {
      nameSpan.classList.add("d-none");
      actionsDiv.classList.add("d-none");
      editForm.classList.remove("d-none");
      editActions.classList.remove("d-none");
      input.focus();
      input.select();
    }
    function closeEdit() {
      editForm.classList.add("d-none");
      editActions.classList.add("d-none");
      nameSpan.classList.remove("d-none");
      actionsDiv.classList.remove("d-none");
      input.value = nameSpan.textContent.trim();
    }
    async function saveEdit() {
      const name = input.value.trim();
      if (!name) return;
      try {
        const data = await apiPut(`/brands/${id}`, { name });
        if (data.status === "success") {
          nameSpan.textContent = name;
          closeEdit();
          showAlert("Brand updated");
        } else showAlert(data.data?.result || "Update failed", "danger");
      } catch {
        showAlert("Request failed. Please try again.", "danger");
      }
    }

    btn.addEventListener("click", openEdit);
    editActions.querySelector(".save-btn").addEventListener("click", saveEdit);
    editActions.querySelector(".cancel-btn").addEventListener("click", closeEdit);
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        saveEdit();
      }
      if (e.key === "Escape") {
        closeEdit();
      }
    });
  });

  //ADD
  const addBtn = document.getElementById("brand-add-btn");
  const addRow = document.getElementById("brand-add-row");
  const newInput = document.getElementById("brand-new-name");

  function openAdd() {
    addRow.classList.remove("d-none");
    addBtn.classList.add("d-none");
    newInput.focus();
  }
  function closeAdd() {
    addRow.classList.add("d-none");
    addBtn.classList.remove("d-none");
    newInput.value = "";
  }
  async function saveAdd() {
    const name = newInput.value.trim();
    if (!name) return;
    try {
      const data = await apiPost("/brands", { name });
      if (data.status === "success") {
        location.href = "/brands?flash=Brand+created&type=success";
      } else showAlert(data.data?.result || "Create failed", "danger");
    } catch {
      showAlert("Request failed. Please try again.", "danger");
    }
  }

  addBtn.addEventListener("click", (e) => {
    e.preventDefault();
    openAdd();
  });
  document.getElementById("brand-cancel-new-btn").addEventListener("click", closeAdd);
  document.getElementById("brand-save-new-btn").addEventListener("click", saveAdd);
  newInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      saveAdd();
    }
    if (e.key === "Escape") {
      closeAdd();
    }
  });
});
