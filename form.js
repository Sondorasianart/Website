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
      console.info("[Inquiry form] Posting to endpoint:", form.action);

      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: {
          Accept: "application/json",
        },
      });

      console.info("[Inquiry form] Response status:", response.status, response.statusText);

      const contentType = response.headers.get("content-type") || "";
      const rawBody = await response.text();
      let result = null;

      if (contentType.includes("application/json") && rawBody) {
        try {
          result = JSON.parse(rawBody);
        } catch (parseError) {
          console.error("[Inquiry form] Failed to parse JSON response:", parseError, rawBody);
        }
      }

      console.info("[Inquiry form] Parsed response payload:", result || rawBody);

      if (response.ok && (!result || result.ok !== false)) {
        console.info("[Inquiry form] Submission treated as success.");
        if (success) {
          success.textContent = "Inquiry received. We'll be in touch shortly.";
          success.setAttribute("data-fs-active", "");
        }

        form.reset();
        return;
      }

      console.warn("[Inquiry form] Submission treated as failure.");

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
        showFormError(result?.error || "Something went wrong and your inquiry was not sent. Please try again.");
      }
    } catch (error) {
      console.error("[Inquiry form] Network or unexpected error:", error);
      showFormError("Something went wrong and your inquiry was not sent. Please try again.");
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
      }
    }
  });
});
