// Dados simulados
const activityData = {
    labels: ["Corrida", "Ciclismo", "Yoga", "Força"],
    data: [12, 8, 5, 10]
};

const competitionHistory = [
    { date: "10/10/2024", winner: "Você", performance: "Avançado" },
    { date: "15/09/2024", winner: "Amigo", performance: "Intermediário" },
    { date: "01/09/2024", winner: "Você", performance: "Avançado" }
];

// Inicializa o gráfico de atividades
function initActivityChart() {
    const ctx = document.getElementById("activityChart").getContext("2d");
    new Chart(ctx, {
        type: "bar",
        data: {
            labels: activityData.labels,
            datasets: [{
                label: "Frequência de Atividade",
                data: activityData.data,
                backgroundColor: ["#4caf50", "#ff9800", "#2196f3", "#9c27b0"]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: true },
            },
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

// Exibe estatísticas de atividade
function displayActivityStats() {
    const statsContainer = document.getElementById("activityStats");
    activityData.labels.forEach((activity, index) => {
        const frequency = activityData.data[index];
        const listItem = document.createElement("li");
        listItem.textContent = `${activity}: ${frequency} vezes`;
        statsContainer.appendChild(listItem);
    });
}

// Exibe histórico de competições
function displayCompetitionHistory() {
    const historyContainer = document.getElementById("competitionHistory");
    competitionHistory.forEach(competition => {
        const listItem = document.createElement("li");
        listItem.textContent = `Data: ${competition.date}, Vencedor: ${competition.winner}, Desempenho: ${competition.performance}`;
        historyContainer.appendChild(listItem);
    });
}

// Inicializa a página
window.onload = function() {
    initActivityChart();
    displayActivityStats();
    displayCompetitionHistory();
};
