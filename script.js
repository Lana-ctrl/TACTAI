async function renderFatigueData() {
  try {
    const response = await fetch("/api/fatigue");
    const data = await response.json();
    const players = data.fatigue_data;

    if (players.length === 0) {
      console.error("No players found");
      return;
    }

    // Select a random player
    const randomPlayer = players[Math.floor(Math.random() * players.length)];

    const container = document.getElementById("fatigueContainer");
    if (!container) {
      console.error("Fatigue container not found");
      return;
    }

    container.innerHTML = ""; // Clear previous data if any

    const card = document.createElement("div");
    card.className = "fatigue-player";

    card.innerHTML = `
      <img src="/static/images/${randomPlayer.Photo}" alt="${randomPlayer["Player Name"]}">
      <div class="fatigue-details">
        <strong>${randomPlayer["Player Name"]}</strong>
        <span>❤️ HR: ${randomPlayer["HR (bpm)"]} bpm</span>
        <span>🏃 Speed: ${randomPlayer["Speed (km/h)"]} km/h</span>
        <span>🌬️ Breathing: ${randomPlayer["Breathing (/min)"]} /min</span>
        <span>🌡️ Temp: ${randomPlayer["Temp (°C)"]} °C</span>
        <span>🟢 Level: ${randomPlayer["Fatigue Level"]}</span>
      </div>
    `;

    container.appendChild(card);
  } catch (err) {
    console.error("Error loading fatigue data:", err);
  }
}

// Call the function on page load
renderFatigueData();



  