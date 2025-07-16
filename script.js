let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar-din');
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const currentScrollY = window.scrollY;

  if (currentScrollY >= maxScroll) {
    // In fondo → colore originale
    navbar.classList.remove('scrolled');
  } else {
    // Ovunque tranne in fondo → colore più chiaro
    navbar.classList.add('scrolled');
  }

  lastScrollY = currentScrollY;
});


/*timer*/
let chronoInterval;
let startTime;
let elapsed = 0;

function formatTime(ms) {
  const totalCenti = Math.floor(ms / 10); // centesimi di secondo
  const minutes = Math.floor(totalCenti / 6000);
  const seconds = Math.floor((totalCenti % 6000) / 100);
  const centi = totalCenti % 100;

  const mm = String(minutes).padStart(2, '0');
  const ss = String(seconds).padStart(2, '0');
  const cc = String(centi).padStart(2, '0');

  return `${mm}:${ss},${cc}`;
}

function updateDisplay() {
  const now = Date.now();
  const diff = now - startTime + elapsed;
  document.getElementById('chrono').textContent = formatTime(diff);
}

function startChrono() {
  if (chronoInterval) return; // evita doppio avvio

  startTime = Date.now();
  chronoInterval = setInterval(updateDisplay, 10);
}

function stopChrono() {
  if (!chronoInterval) return;

  elapsed += Date.now() - startTime;
  clearInterval(chronoInterval);
  chronoInterval = null;
}

function resetChrono() {
  clearInterval(chronoInterval);
  chronoInterval = null;
  elapsed = 0;
  document.getElementById('chrono').textContent = '00:00,00';
}


/*timer */
let timerInterval;
let timeLeft = 0;
let endTime;
let initialDuration = 0;

function formatTime(ms) {
  const totalCenti = Math.floor(ms / 10);
  const hours = Math.floor(totalCenti / 360000);
  const minutes = Math.floor((totalCenti % 360000) / 6000);
  const seconds = Math.floor((totalCenti % 6000) / 100);
  const centi = totalCenti % 100;

  const hh = String(hours).padStart(2, '0');
  const mm = String(minutes).padStart(2, '0');
  const ss = String(seconds).padStart(2, '0');
  const cc = String(centi).padStart(2, '0');

  return `${hh}:${mm}:${ss},${cc}`;
}


function updateTimerDisplay() {
  const now = Date.now();
  const remaining = endTime - now;

  if (remaining <= 0) {
    clearInterval(timerInterval);
    timerInterval = null;
    document.getElementById('timer-display').textContent = "00:00,00";
    showSetup();
    return;
  }

  document.getElementById('timer-display').textContent = formatTime(remaining);
  timeLeft = remaining;
}

function getInputDuration() {
  const hours = parseInt(document.getElementById('input-hours').value) || 0;
  const minutes = parseInt(document.getElementById('input-minutes').value) || 0;
  const seconds = parseInt(document.getElementById('input-seconds').value) || 0;

  return ((hours * 3600) + (minutes * 60) + seconds) * 1000;
}


function showSetup() {
  document.getElementById('timer-setup').style.display = 'flex';
  document.getElementById('timer-display').style.display = 'none';
}

function showTimer() {
  document.getElementById('timer-setup').style.display = 'none';
  document.getElementById('timer-display').style.display = 'block';
}

function startTimer() {
  if (timerInterval) return;

  // Se timer è a 0 (prima partenza o reset)
  if (timeLeft === 0) {
    initialDuration = getInputDuration();
    timeLeft = initialDuration;
  }

  if(timeLeft <= 0) {
    alert("Imposta un tempo maggiore di zero!");
    return;
  }

  showTimer();
  endTime = Date.now() + timeLeft;
  timerInterval = setInterval(updateTimerDisplay, 10);
}

function stopTimer() {
  if (!timerInterval) return;

  clearInterval(timerInterval);
  timerInterval = null;
}

function resetTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  timeLeft = 0;
  initialDuration = getInputDuration();
  document.getElementById('timer-display').textContent = formatTime(initialDuration);
  showSetup();
}


/*trasnsition e fissaggio motivation*/
const STORAGE_KEY = "motivazione";
const EXPIRY_KEY = "motivazione_expiry";

function salvaMotivazione() {
  const input = document.getElementById("motivationInput");
  const valore = input.value.trim();

  if (valore !== "") {
    localStorage.setItem(STORAGE_KEY, valore);
    localStorage.setItem(EXPIRY_KEY, Date.now() + 24 * 60 * 60 * 1000);
    mostraMotivazione(valore);
  }
}

function mostraMotivazione(testo) {
  const input = document.getElementById("motivationInput");
  const invia = document.getElementById("inviaBtn");
  const output = document.getElementById("motivazioneFissa");
  const modifica = document.getElementById("modificaBtn");

  input.style.display = "none";
  invia.style.display = "none";

  output.textContent = testo;
  output.style.display = "block";
  modifica.style.display = "inline-block";

  output.classList.remove("fade-in");
  void output.offsetWidth;
  output.classList.add("fade-in");
}

function modificaMotivazione() {
  const input = document.getElementById("motivationInput");
  const invia = document.getElementById("inviaBtn");
  const output = document.getElementById("motivazioneFissa");
  const modifica = document.getElementById("modificaBtn");

  // Ripristina input con valore precedente
  input.value = localStorage.getItem(STORAGE_KEY) || "";

  input.style.display = "block";
  invia.style.display = "inline-block";
  output.style.display = "none";
  modifica.style.display = "none";
}

function controllaMotivazione() {
  const valore = localStorage.getItem(STORAGE_KEY);
  const scadenza = localStorage.getItem(EXPIRY_KEY);

  if (valore && scadenza && Date.now() < parseInt(scadenza)) {
    mostraMotivazione(valore);
  } else {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(EXPIRY_KEY);
  }
}

window.addEventListener("DOMContentLoaded", controllaMotivazione);



/*counter workout*/
const ALLENAMENTO_KEY = "allenamento";
const ALLENAMENTO_TIME = "allenamento_time";
const COUNTER_KEY = "allenamento_counter";

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("btnSi").addEventListener("click", function(e) {
    e.preventDefault();
    handleAllenamento(true);
  });

  document.getElementById("btnNo").addEventListener("click", function(e) {
    e.preventDefault();
    handleAllenamento(false);
  });

  aggiornaCounter(); // aggiorna counter all'avvio
});

function handleAllenamento(risposta) {
  const giàRisposto = localStorage.getItem(ALLENAMENTO_TIME);
  const ora = Date.now();

  if (giàRisposto && ora < parseInt(giàRisposto)) {
    mostraMessaggio("Hai già risposto oggi");
    return;
  }

  if (risposta === true) {
    let counter = parseInt(localStorage.getItem(COUNTER_KEY)) || 0;
    localStorage.setItem(COUNTER_KEY, counter + 1);
    aggiornaCounter(); // AGGIORNA SUBITO IL COUNTER VISIVAMENTE

    // Salva la data nel formato YYYY-MM-DD
    let oggi = new Date();
    let keyData = `${oggi.getFullYear()}-${(oggi.getMonth()+1).toString().padStart(2,'0')}-${oggi.getDate().toString().padStart(2,'0')}`;
    localStorage.setItem(keyData, "trained");

    // Se hai una funzione per il calendario la chiami qui
    if (typeof renderCalendar === "function") {
      renderCalendar(currentDate);
    }
  }

  localStorage.setItem(ALLENAMENTO_KEY, risposta);
  localStorage.setItem(ALLENAMENTO_TIME, ora + 24 * 60 * 60 * 1000); // 24h

  mostraMessaggio("Counter aggiornato");
}

function mostraMessaggio(testo) {
  const msg = document.getElementById("messaggioAllenamento");
  msg.textContent = testo;
  msg.style.display = "block";
  msg.classList.remove("fade-in");
  void msg.offsetWidth; // reset animazione
  msg.classList.add("fade-in");
}

function aggiornaCounter() {
  const counter = parseInt(localStorage.getItem(COUNTER_KEY)) || 0;
  const el = document.getElementById("counterText");
  if (el) el.textContent = `ALLENAMENTI CORRENTI: ${counter} / 365`;
}


















/*schede*/
document.addEventListener("DOMContentLoaded", function () {
    // Carica i dati salvati
    const allInputs = document.querySelectorAll(".cont-schede-principale input");
    allInputs.forEach((input, index) => {
        const savedValue = localStorage.getItem("input_" + index);
        const isReadOnly = localStorage.getItem("readonly_" + index);
        if (savedValue !== null) input.value = savedValue;
        if (isReadOnly === "true") {
            input.setAttribute("readonly", true);
            input.classList.add("readonly-style");
        }
    });

    // Per ogni sezione Giorno (btn-schede)
    document.querySelectorAll('.btn-schede').forEach(function (section) {
        const confirmBtn = section.querySelector('a:nth-child(2)');
        const editBtn = section.querySelector('a:nth-child(1)');
        const inputs = section.parentElement.querySelectorAll('input');

        confirmBtn.addEventListener('click', function (e) {
            e.preventDefault();
            inputs.forEach((input, index) => {
                input.setAttribute('readonly', true);
                input.classList.add('readonly-style');
                // Salva il valore e lo stato read-only
                const globalIndex = Array.from(allInputs).indexOf(input);
                localStorage.setItem("input_" + globalIndex, input.value);
                localStorage.setItem("readonly_" + globalIndex, true);
            });
        });

        editBtn.addEventListener('click', function (e) {
            e.preventDefault();
            inputs.forEach((input, index) => {
                input.removeAttribute('readonly');
                input.classList.remove('readonly-style');
                const globalIndex = Array.from(allInputs).indexOf(input);
                localStorage.setItem("readonly_" + globalIndex, false);
            });
        });
    });

    // Salva mentre scrivi (facoltativo ma utile)
    allInputs.forEach((input, index) => {
        input.addEventListener('input', () => {
            localStorage.setItem("input_" + index, input.value);
        });
    });
});




/*calendario*/
(() => {
    const calendarDays = document.getElementById("calendarDays");
    const monthYear = document.getElementById("monthYear");
    const meseNomi = [
      "Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
      "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"
    ];

    let currentDate = new Date();

    function renderCalendar(date) {
  calendarDays.innerHTML = "";

  const anno = date.getFullYear();
  const mese = date.getMonth();

  monthYear.textContent = `${meseNomi[mese]} ${anno}`;

  let primoGiorno = new Date(anno, mese, 1);
  let primoGiornoSettimana = primoGiorno.getDay();
  primoGiornoSettimana = primoGiornoSettimana === 0 ? 6 : primoGiornoSettimana - 1;

  const giorniNelMese = new Date(anno, mese + 1, 0).getDate();
  const giorniNelMesePrec = new Date(anno, mese, 0).getDate();

  // Giorni del mese precedente
  for(let i = primoGiornoSettimana - 1; i >= 0; i--) {
    const dayNum = giorniNelMesePrec - i;
    const dayElem = document.createElement("div");
    dayElem.classList.add("day", "other-month");
    dayElem.textContent = dayNum;
    calendarDays.appendChild(dayElem);
  }

  const oggi = new Date();
  for(let i = 1; i <= giorniNelMese; i++) {
    const dayElem = document.createElement("div");
    dayElem.classList.add("day");
    dayElem.textContent = i;

    if(anno === oggi.getFullYear() && mese === oggi.getMonth() && i === oggi.getDate()) {
      dayElem.classList.add("today");
    }

    // *** Aggiungi questa parte per evidenziare i giorni allenati ***
    let keyData = `${anno}-${(mese+1).toString().padStart(2,'0')}-${i.toString().padStart(2,'0')}`;
    if(localStorage.getItem(keyData) === "trained") {
      dayElem.classList.add("trained");
    }

    calendarDays.appendChild(dayElem);
  }

  // Completa la griglia
  const totaleGiorniVisualizzati = primoGiornoSettimana + giorniNelMese;
  const giorniDaAggiungere = 42 - totaleGiorniVisualizzati;

  for(let i = 1; i <= giorniDaAggiungere; i++) {
    const dayElem = document.createElement("div");
    dayElem.classList.add("day", "other-month");
    dayElem.textContent = i;
    calendarDays.appendChild(dayElem);
  }
}

    document.getElementById("prevMonth").addEventListener("click", () => {
      currentDate.setMonth(currentDate.getMonth() - 1);
      renderCalendar(currentDate);
    });

    document.getElementById("nextMonth").addEventListener("click", () => {
      currentDate.setMonth(currentDate.getMonth() + 1);
      renderCalendar(currentDate);
    });

    // Render iniziale
    renderCalendar(currentDate);
  })();


  document.addEventListener("DOMContentLoaded", () => {
  renderCalendar(currentDate);
  mostraCounterAllenamenti();
});








