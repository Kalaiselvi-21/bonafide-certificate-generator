// Add any interactive JavaScript here

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  if (form) {
    form.addEventListener("submit", () => {
      console.log("Form submitted!");
    });
  }
});
