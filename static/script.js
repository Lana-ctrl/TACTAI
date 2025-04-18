async function fetchFatigueData() {
  try {
    const response = await fetch("/api/fatigue");
    const data = await response.json();
    return data.fatigue_data;
  } catch (error) {
    console.error("Error fetching fatigue data:", error);
    return [];
  }
}

async function populateLists() {
  const players = await fetchFatigueData();

  // Render substitution suggestions
  document.getElementById("substitutionList").innerHTML = players
    .filter(p => p.fatigue > 80 || p.performance < 6)
    .map(p => `<li>Substitute ${p.name} - Fatigue: ${p.fatigue}%</li>`)
    .join("");

  // Calculate fatigue distribution for doughnut
  const fatigued = players.filter(p => p.fatigue > 80).length;
  const active = players.length - fatigued;

  const doughnutChart = new Chart(document.getElementById("doughnutChart"), {
    type: "doughnut",
    data: {
      labels: ["Active", "Fatigued"],
      datasets: [{
        data: [active, fatigued],
        backgroundColor: ["#4caf50", "#f44336"]
      }]
    },
    options: {
      cutout: "70%",
      plugins: { legend: { position: "bottom" } }
    }
  });
}

function renderCharts() {
  // Keep this function for the other static charts
  new Chart(document.getElementById("lineChart"), {
    type: "line",
    data: {
      labels: ["0", "5", "10", "15", "20", "25", "HT"],
      datasets: [{
        label: "Speed (km/h)",
        data: [7.5, 7.3, 7.0, 6.5, 6.7, 6.4, 6.0],
        borderColor: "#5d5fef",
        backgroundColor: "rgba(93, 95, 239, 0.2)",
        fill: true,
        tension: 0.3
      }]
    }
  });

  new Chart(document.getElementById("barChart"), {
    type: "bar",
    data: {
      labels: ["Left Back", "Center Mid", "Right Wing"],
      datasets: [{
        label: "Weakness Level",
        data: [80, 45, 60],
        backgroundColor: "#ff6b6b"
      }]
    }
  });

  new Chart(document.getElementById("radarChart"), {
    type: "radar",
    data: {
      labels: ["Passing", "Shooting", "Dribbling", "Stamina", "Vision"],
      datasets: [{
        label: "Player 10",
        data: [8, 9, 7, 6, 8],
        backgroundColor: "rgba(93, 95, 239, 0.3)",
        borderColor: "#5d5fef"
      }]
    }
  });

  new Chart(document.getElementById("pieChart"), {
    type: "pie",
    data: {
      labels: ["Offensive", "Defensive", "Tactical"],
      datasets: [{
        data: [40, 35, 25],
        backgroundColor: ["#5d5fef", "#ff6b6b", "#ffa726"]
      }]
    }
  });
}

// Init
renderCharts();
populateLists();

  