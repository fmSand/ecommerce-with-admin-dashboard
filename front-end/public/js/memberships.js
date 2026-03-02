document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".membership-edit-btn").forEach((btn) => {
    const row = btn.closest("tr");
    const id = row.dataset.id;
    const discountSpan = row.querySelector(".membership-discount");
    const editForm = row.querySelector(".membership-edit-form");
    const editActions = row.querySelector(".membership-edit-actions");
    const input = editForm.querySelector("input");

    function openEdit() {
      input.value = row.dataset.discount;
      discountSpan.classList.add("d-none");
      editForm.classList.remove("d-none");
      editActions.classList.remove("d-none");
      btn.closest(".membership-actions").classList.add("d-none");
      input.focus();
      input.select();
    }

    function closeEdit() {
      editForm.classList.add("d-none");
      editActions.classList.add("d-none");
      discountSpan.classList.remove("d-none");
      btn.closest(".membership-actions").classList.remove("d-none");
    }

    async function saveEdit() {
      const discountPercent = Number(input.value);
      if (isNaN(discountPercent) || discountPercent < 0 || discountPercent > 100) {
        showAlert("Discount must be between 0 and 100", "danger");
        return;
      }

      try {
        const data = await apiPut(`/memberships/${id}`, { discountPercent });
        if (data.status === "success") {
          row.dataset.discount = discountPercent;
          discountSpan.textContent = `${discountPercent}%`;
          closeEdit();
          showAlert("Membership updated");
        } else {
          showAlert(data.data?.result || "Update failed", "danger");
        }
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
});
