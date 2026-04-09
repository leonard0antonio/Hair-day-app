// 1. DADOS INICIAIS E ESTADO DA APLICAÇÃO
const today = new Date().toISOString().split('T')[0];

// Array de agendamentos agora inclui a propriedade "date"
let appointments = [];
let selectedTime = null;

// Elementos do DOM
const form = document.getElementById('schedule-form');
const formDateInput = document.getElementById('date-input'); // Data do formulário (esquerda)
const filterDateInput = document.getElementById('filter-date'); // Data do filtro (direita)
const clientNameInput = document.getElementById('client-name');

// Configura os inputs de data para o dia atual ao abrir o app
formDateInput.value = today;
filterDateInput.value = today;

// Horários base do salão
const availableTimes = {
    morning: ["09:00", "10:00", "11:00", "12:00"],
    afternoon: ["13:00", "14:00", "15:00", "16:00", "17:00", "18:00"],
    evening: ["19:00", "20:00", "21:00"]
};

// 2. FUNÇÃO PARA GERAR BOTÕES DE HORÁRIO (Esquerda)
function renderTimeButtons() {
    const selectedDate = formDateInput.value;

    const createButtons = (times, containerId) => {
        const container = document.getElementById(containerId);
        container.innerHTML = ''; 
        
        times.forEach(time => {
            // VERIFICAÇÃO CHAVE: Já existe agendamento nesta DATA e neste HORÁRIO?
            const isBooked = appointments.some(app => app.date === selectedDate && app.time === time);
            
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'time-btn';
            btn.textContent = time;
            btn.dataset.time = time;
            
            if (isBooked) {
                btn.disabled = true; // Desabilita se estiver ocupado
            } else {
                btn.addEventListener('click', () => selectTime(btn));
            }
            
            container.appendChild(btn);
        });
    };

    createButtons(availableTimes.morning, 'morning-times');
    createButtons(availableTimes.afternoon, 'afternoon-times');
    createButtons(availableTimes.evening, 'evening-times');
}

// 3. FUNÇÃO DE SELEÇÃO DE HORÁRIO
function selectTime(clickedBtn) {
    document.querySelectorAll('.time-btn').forEach(btn => btn.classList.remove('selected'));
    clickedBtn.classList.add('selected');
    selectedTime = clickedBtn.dataset.time;
}

// 4. FUNÇÃO PARA RENDERIZAR A AGENDA (Direita - O Filtro!)
function renderAgenda() {
    document.getElementById('list-morning').innerHTML = '';
    document.getElementById('list-afternoon').innerHTML = '';
    document.getElementById('list-evening').innerHTML = '';

    // Pega a data que o usuário quer visualizar no calendário da direita
    const viewingDate = filterDateInput.value;
    
    // O SEGREDO DO FILTRO: Pega apenas os agendamentos que batem com a data do filtro
    const dailyAppointments = appointments.filter(app => app.date === viewingDate);
    
    // Ordena por horário crescente
    dailyAppointments.sort((a, b) => a.time.localeCompare(b.time));

    dailyAppointments.forEach(app => {
        const hour = parseInt(app.time.split(':')[0]); 
        
        const li = document.createElement('li');
        li.innerHTML = `
            <span class="schedule-time">${app.time}</span>
            <span class="schedule-name">${app.name}</span>
        `;

        if (hour >= 9 && hour <= 12) {
            document.getElementById('list-morning').appendChild(li);
        } else if (hour >= 13 && hour <= 18) {
            document.getElementById('list-afternoon').appendChild(li);
        } else if (hour >= 19 && hour <= 21) {
            document.getElementById('list-evening').appendChild(li);
        }
    });
}

// 5. EVENTOS DOS CALENDÁRIOS (Atualização em tempo real)

// Quando mudar a data no formulário da esquerda: recarrega os botões de horário
formDateInput.addEventListener('change', function() {
    selectedTime = null; 
    renderTimeButtons();
    
    // (Opcional UX) Se quiser que ao mudar a data de agendamento a agenda mude junto:
    filterDateInput.value = formDateInput.value;
    renderAgenda();
});

// Quando mudar a data do filtro da direita: recarrega a lista
filterDateInput.addEventListener('change', function() {
    renderAgenda();
});

// 6. EVENTO DE SUBMISSÃO (AGENDAR)
form.addEventListener('submit', function(e) {
    e.preventDefault();

    const nameValue = clientNameInput.value;
    const dateValue = formDateInput.value; 

    if (!selectedTime) {
        alert("Por favor, selecione um horário válido.");
        return;
    }

    // Salva o agendamento com a DATA exata
    appointments.push({
        date: dateValue,
        time: selectedTime,
        name: nameValue
    });

    // Limpa os campos para o próximo
    clientNameInput.value = '';
    selectedTime = null;

    // Atualiza a tela
    renderTimeButtons();
    
    // Garante que a lista da direita está mostrando o dia em que o cara acabou de agendar
    filterDateInput.value = dateValue; 
    renderAgenda();
});

// 7. INICIALIZAÇÃO
renderTimeButtons();
renderAgenda();