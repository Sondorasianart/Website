window.formspree =
  window.formspree ||
  function () {
    (formspree.q = formspree.q || []).push(arguments);
  };

formspree("initForm", {
  formElement: "#inquiry-form",
  formId: "mdayoaja",
  renderSuccess: ({ form }) => {
    const success = document.querySelector("[data-fs-success]");
    const error = document.querySelector("[data-fs-error]:not([data-fs-error=''])");

    if (error) {
      error.removeAttribute("data-fs-active");
      error.textContent = "";
    }

    if (success) {
      success.textContent = "Inquiry received. We'll be in touch shortly.";
      success.setAttribute("data-fs-active", "");
    }

    form.reset();
  },
  renderFormError: (_context, message) => {
    const error = document.querySelector("[data-fs-error]:not([data-fs-error=''])");

    if (error) {
      error.textContent = message || "There was a problem sending your inquiry. Please try again.";
      error.setAttribute("data-fs-active", "");
    }
  },
  onSubmit: () => {
    const success = document.querySelector("[data-fs-success]");
    const error = document.querySelector("[data-fs-error]:not([data-fs-error=''])");

    if (success) {
      success.removeAttribute("data-fs-active");
    }

    if (error) {
      error.removeAttribute("data-fs-active");
      error.textContent = "";
    }
  },
});
