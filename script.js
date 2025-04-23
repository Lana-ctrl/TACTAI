let players = [];
let currentIndex = 0;

async function loadPlayers() {
  try {
    const res = await fetch("/api/fatigue");
    const data = await res.json();
    players = data.fatigue_data;

    if (players.length > 0) {
      showPlayer(currentIndex);
      setInterval(() => {
        currentIndex = (currentIndex + 1) % players.length;
        showPlayer(currentIndex);
      }, 30000);
    } else {
      document.getElementById("playerName").textContent = "No player data.";
    }
  } catch (err) {
    console.error("Failed to load fatigue data:", err);
  }
}

async function showPlayer(i) {
  const p = players[i];
  if (!p) return;

  // Populate fields
  document.getElementById("playerPhoto").src = `/static/${p["Photo"]}`;
  document.getElementById("playerName").textContent = p["Player Name"];
  document.getElementById("playerPosition").textContent = p["Position"];
  document.getElementById("playerRole").textContent = p["Role"];
  document.getElementById("hr").textContent = p["HR (bpm)"];
  document.getElementById("speed").textContent = p["Speed (km/h)"];
  document.getElementById("breathing").textContent = p["Breathing (/min)"];
  document.getElementById("temp").textContent = p["Temp (°C)"];

  // Fatigue bar color
  const fatigueBar = document.getElementById("fatigueLevelIcon");
  fatigueBar.className = "fatigue-bar";
  if (p["Fatigue Level"] === "Green") fatigueBar.style.backgroundColor = "#4caf50";
  else if (p["Fatigue Level"] === "Yellow") fatigueBar.style.backgroundColor = "#ffc107";
  else if (p["Fatigue Level"] === "Red") fatigueBar.style.backgroundColor = "#f44336";
  else fatigueBar.style.backgroundColor = "#888";

  // Fetch substitute suggestions if needed
  if (p["Fatigue Level"] === "Red") {
    try {
      const res = await fetch(`/api/substitute/${encodeURIComponent(p["Player Name"])}`);
      const subs = await res.json();
      document.getElementById("subSuggestion").innerHTML =
        subs.length > 0
          ? `⚠️ Suggested Subs:<br>${subs.map(s => `${s.Name} (${s.Position})`).join("<br>")}`
          : "No suitable substitutes available.";
    } catch {
      document.getElementById("subSuggestion").textContent = "Failed to load subs.";
    }
  } else {
    document.getElementById("subSuggestion").textContent = "✅ No substitution needed";
  }

  console.log(`Now showing: ${p["Player Name"]}`);
}

loadPlayers();
