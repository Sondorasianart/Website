document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#inquiry-form");

  if (!form) {
    return;
  }

  const submitButton = form.querySelector("[data-fs-submit-btn]");
  const success = document.querySelector("[data-fs-success]");
  const formError = document.querySelector("[data-fs-error]:not([data-fs-error=''])");
  const fieldErrors = Array.from(form.querySelectorAll("[data-fs-error]"))
    .filter((node) => node.getAttribute("data-fs-error"));

  const clearStatus = () => {
    if (success) {
      success.removeAttribute("data-fs-active");
    }

    if (formError) {
      formError.removeAttribute("data-fs-active");
      formError.textContent = "";
    }

    fieldErrors.forEach((node) => {
      node.removeAttribute("data-fs-active");
      node.textContent = "";
    });

    form.querySelectorAll("[data-fs-field]").forEach((field) => {
      field.removeAttribute("aria-invalid");
    });
  };

  const showFormError = (message) => {
    if (!formError) {
      return;
    }

    formError.textContent = message;
    formError.setAttribute("data-fs-active", "");
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearStatus();

    if (submitButton) {
      submitButton.disabled = true;
    }

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: {
          Accept: "application/json",
        },
      });

      const result = await response.json();

      if (response.ok) {
        if (success) {
          success.textContent = "Inquiry received. We'll be in touch shortly.";
          success.setAttribute("data-fs-active", "");
        }

        form.reset();
        return;
      }

      if (Array.isArray(result?.errors) && result.errors.length) {
        result.errors.forEach((item) => {
          const fieldName = item.field;
          const message = item.message || "Please review this field.";

          if (fieldName) {
            const field = form.querySelector(`[name="${fieldName}"]`);
            const errorNode = form.querySelector(`[data-fs-error="${fieldName}"]`);

            if (field) {
              field.setAttribute("aria-invalid", "true");
            }

            if (errorNode) {
              errorNode.textContent = message;
              errorNode.setAttribute("data-fs-active", "");
              return;
            }
          }

          showFormError(message);
        });
      } else {
        showFormError(result?.error || "There was a problem sending your inquiry. Please try again.");
      }
    } catch (_error) {
      showFormError("There was a problem sending your inquiry. Please try again.");
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
      }
    }
  });
});
