// Variáveis para o cronômetro
let timer;
let totalTime = 0;
let isRunning = false;
let currentActivity = '';
let activities = JSON.parse(localStorage.getItem('activities')) || [];

// Variáveis para o gerenciamento de tarefas
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let streak = parseInt(localStorage.getItem('streak')) || 0;

// Elementos da UI
const taskInput = document.getElementById('task-input');
const tagSelect = document.getElementById('tag-select');
const taskLists = {
  saude: document.getElementById('task-list-saude'),
  estudo: document.getElementById('task-list-estudo'),
  lazer: document.getElementById('task-list-lazer'),
  trabalho: document.getElementById('task-list-trabalho'),
  outros: document.getElementById('task-list-outros')
};
const streakCount = document.getElementById('streak-count');
const streakBar = document.getElementById('streak-bar');
const finishDayBtn = document.getElementById('finish-day-btn');
const addTaskBtn = document.getElementById('add-task-btn');
const activityInput = document.getElementById('activity');
const timeDisplay = document.getElementById('time-display');
const historyList = document.getElementById('history-list');
const report = document.getElementById('report');

// Função para formatar o tempo do cronômetro
function formatTime(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Função para iniciar o cronômetro
function startTimer() {
  const activityInputValue = activityInput.value;
  if (activityInputValue === '') {
    alert('Digite a atividade antes de iniciar!');
    return;
  }
  currentActivity = activityInputValue;
  isRunning = true;
  timer = setInterval(() => {
    totalTime++;
    timeDisplay.textContent = formatTime(totalTime);
  }, 1000);
}

// Função para pausar o cronômetro
function pauseTimer() {
  if (isRunning) {
    clearInterval(timer);
    isRunning = false;
    saveActivity();
  }
}

// Função para resetar o cronômetro
function resetTimer() {
  clearInterval(timer);
  totalTime = 0;
  timeDisplay.textContent = '00:00:00';
}

// Função para salvar a atividade no histórico
function saveActivity() {
  const activity = {
    name: currentActivity,
    duration: totalTime,
    date: new Date().toLocaleDateString()
  };
  activities.push(activity);
  localStorage.setItem('activities', JSON.stringify(activities));
  totalTime = 0;
  currentActivity = '';
  activityInput.value = '';
  updateHistory();
}

// Função para atualizar o histórico de atividades
function updateHistory() {
  historyList.innerHTML = '';
  activities.forEach(activity => {
    const li = document.createElement('li');
    li.textContent = `${activity.name} - ${formatTime(activity.duration)} (${activity.date})`;
    historyList.appendChild(li);
  });
}

// Função para gerar o relatório semanal
function generateReport() {
  const currentWeek = new Date().getWeek();
  const weeklyActivities = activities.filter(activity => new Date(activity.date).getWeek() === currentWeek);
  const totalWeeklyTime = weeklyActivities.reduce((acc, activity) => acc + activity.duration, 0);
  report.innerHTML = `
    <strong>Relatório Semanal:</strong><br>
    Total de Tempo: ${formatTime(totalWeeklyTime)}<br>
    Número de Atividades: ${weeklyActivities.length}
  `;
}

// Função para obter a semana do ano
Date.prototype.getWeek = function() {
  const firstJan = new Date(this.getFullYear(), 0, 1);
  return Math.ceil(((this - firstJan) / 86400000 + firstJan.getDay() + 1) / 7);
};

// Função para atualizar o progresso do streak
function updateStreak() {
  streakCount.textContent = `Sequência: ${streak} dias`;
  const percentage = Math.min(streak * 10, 100);
  streakBar.style.width = `${percentage}%`;
}

// Função para renderizar a lista de tarefas
function renderTasks() {
  Object.keys(taskLists).forEach(key => {
    taskLists[key].innerHTML = '';
  });

  tasks.forEach(task => {
    const li = document.createElement('li');
    li.classList.toggle('completed', task.completed);
    li.innerHTML = `
      <span>${task.name}</span>
      <button onclick="toggleTaskCompletion('${task.tag}', ${tasks.indexOf(task)})">${task.completed ? 'Desmarcar' : 'Concluir'}</button>
    `;
    taskLists[task.tag].appendChild(li);
  });

  updateStreak();
}

// Função para adicionar uma nova tarefa
function addTask() {
  const taskName = taskInput.value.trim();
  const tag = tagSelect.value;

  if (taskName === '') {
    taskInput.classList.add('error');
    return;
  } else {
    taskInput.classList.remove('error');
  }

  const newTask = { name: taskName, tag: tag, completed: false };
  tasks.push(newTask);
  taskInput.value = '';
  saveData();
  renderTasks();
}

// Função para marcar a tarefa como concluída ou desmarcar
function toggleTaskCompletion(tag, index) {
  tasks[index].completed = !tasks[index].completed;
  saveData();
  renderTasks();
}

// Função para finalizar o dia (verificar streak)
function finishDay() {
  if (tasks.every(task => task.completed)) {
    streak++;
    alert('Parabéns! Você completou todas as tarefas do dia!');
  } else {
    streak = 0;
    alert('Ainda há tarefas não concluídas!');
  }

  tasks = [];
  saveData();
  renderTasks();
}

// Função para salvar dados no localStorage
function saveData() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
  localStorage.setItem('streak', streak);
}

// Função para iniciar a página
function initializePage() {
  renderTasks();
  updateHistory();
}

// Evento para adicionar tarefa
addTaskBtn.addEventListener('click', addTask);

// Evento para finalizar o dia
finishDayBtn.addEventListener('click', finishDay);

// Evento para iniciar o cronômetro
document.getElementById('start-button').addEventListener('click', startTimer);

// Evento para pausar o cronômetro
document.getElementById('pause-button').addEventListener('click', pauseTimer);

// Evento para resetar o cronômetro
document.getElementById('reset-button').addEventListener('click', resetTimer);

// Evento para gerar o relatório semanal
document.getElementById('generate-report-button').addEventListener('click', generateReport);

// Inicializar a página
window.onload = initializePage;

//////////////////////////////////////////////////////COLOCAR BANCO DE DADOS
