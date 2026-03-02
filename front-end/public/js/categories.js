document.addEventListener("DOMContentLoaded", () => {
  //DELETE
  document.querySelectorAll(".category-delete-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const row = btn.closest("tr");
      const id = row.dataset.id;
      const name = row.querySelector(".category-name").textContent.trim();
      if (!confirm(`Delete category "${name}"?`)) return;
      try {
        const data = await apiDelete(`/categories/${id}`);
        if (data.status === "success") {
          row.remove();
          showAlert("Category deleted");
        } else showAlert(data.data?.result || "Delete failed", "danger");
      } catch {
        showAlert("Request failed. Please try again.", "danger");
      }
    });
  });

  //EDIT
  document.querySelectorAll(".category-edit-btn").forEach((btn) => {
    const row = btn.closest("tr");
    const id = row.dataset.id;
    const nameSpan = row.querySelector(".category-name");
    const actionsDiv = row.querySelector(".category-actions");
    const editForm = row.querySelector(".category-edit-form");
    const editActions = row.querySelector(".category-edit-actions");
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
        const data = await apiPut(`/categories/${id}`, { name });
        if (data.status === "success") {
          nameSpan.textContent = name;
          closeEdit();
          showAlert("Category updated");
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
  const addBtn = document.getElementById("category-add-btn");
  const addRow = document.getElementById("category-add-row");
  const newInput = document.getElementById("category-new-name");

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
      const data = await apiPost("/categories", { name });
      if (data.status === "success") {
        location.href = "/categories?flash=Category+created&type=success";
      } else showAlert(data.data?.result || "Create failed", "danger");
    } catch {
      showAlert("Request failed. Please try again.", "danger");
    }
  }

  addBtn.addEventListener("click", (e) => {
    e.preventDefault();
    openAdd();
  });
  document.getElementById("category-cancel-new-btn").addEventListener("click", closeAdd);
  document.getElementById("category-save-new-btn").addEventListener("click", saveAdd);
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
