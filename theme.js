if (!window.__jibuThemeInitialized) {
  window.__jibuThemeInitialized = true;

  document.addEventListener("DOMContentLoaded", () => {
    const savedMode = localStorage.getItem("jibu-theme");
    const isDark = savedMode === "dark";

    document.body.classList.toggle("dark", isDark);
    document.body.classList.toggle("light", !isDark);

    const toggleBtn = document.getElementById("toggleMode");
    if (toggleBtn && !toggleBtn.dataset.themeBound) {
      toggleBtn.dataset.themeBound = "true";
      toggleBtn.addEventListener("click", () => {
        const nextDark = !document.body.classList.contains("dark");
        document.body.classList.toggle("dark", nextDark);
        document.body.classList.toggle("light", !nextDark);
        localStorage.setItem("jibu-theme", nextDark ? "dark" : "light");
      });
    }
  });
}
