(() => {
  const card = document.querySelector(".burn-ban-card");
  const heading = document.getElementById("burn-ban-heading");
  const detail = document.getElementById("burn-ban-detail");
  if (!card || !heading || !detail) return;

  // Official Texas A&M Forest Service county status feed; supports CORS.
  const endpoint = new URL("https://gis.tfs.tamu.edu/arcgis/rest/services/EOC/BurnBan/FeatureServer/0/query");
  endpoint.search = new URLSearchParams({
    where: "County='Van Zandt'",
    outFields: "County,BurnBan",
    returnGeometry: "false",
    f: "json",
  });
  let checking = false;

  async function checkStatus() {
    if (checking) return;
    checking = true;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    card.dataset.status = "unknown";
    heading.textContent = "Checking burn ban status…";
    detail.textContent = "Checking Texas A&M Forest Service reports for Van Zandt County.";

    try {
      const response = await fetch(endpoint, {
        signal: controller.signal,
        cache: "no-store",
        credentials: "omit",
      });
      if (!response.ok) throw new Error("Status request failed");
      const data = await response.json();
      const county = data.features?.[0]?.attributes;
      if (data.error || data.features?.length !== 1 || county?.County !== "Van Zandt" ||
          !["Yes", "No"].includes(county.BurnBan)) {
        throw new Error("Unrecognized county status");
      }

      const active = county.BurnBan === "Yes";
      card.dataset.status = active ? "active" : "inactive";
      heading.textContent = active ? "Burn ban in effect" : "No burn ban reported";
      const checked = new Date();
      const time = document.createElement("time");
      time.dateTime = checked.toISOString();
      time.textContent = new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium", timeStyle: "short", timeZone: "America/Chicago",
      }).format(checked) + " Central Time";
      detail.replaceChildren("Reported by Texas A&M Forest Service. Last checked ", time, ".");
    } catch {
      card.dataset.status = "unknown";
      heading.textContent = "Burn ban status unavailable";
      detail.textContent = "Unable to verify the current status. Check the county link before burning.";
    } finally {
      clearTimeout(timeout);
      checking = false;
    }
  }

  checkStatus();
  setInterval(checkStatus, 5 * 60 * 1000);
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) checkStatus();
  });
})();
