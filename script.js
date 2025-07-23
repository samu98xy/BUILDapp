/*cronometro*/
  // stato del cronometro
  let chronoInterval    = null;
  let chronoStartTime   = 0;    // timestamp di partenza (Date.now())
  let chronoElapsedTime = 0;    // millisecondi già trascorsi al momento del pause

  // riusa la tua funzione di formattazione (o rinominala se vuoi)
  function chronoFormatTime(ms) {
    let centi = Math.floor(ms / 10);
    const cc = centi % 100;
    centi = Math.floor(centi / 100);
    const ss = centi % 60;
    centi = Math.floor(centi / 60);
    const mm = centi % 60;
    const hh = Math.floor(centi / 60);

    const strH = String(hh).padStart(2, '0');
    const strM = String(mm).padStart(2, '0');
    const strS = String(ss).padStart(2, '0');
    const strC = String(cc).padStart(2, '0');

    return `${strH}:${strM}:${strS},${strC}`;
  }

  // aggiorna la visuale del cronometro
  function updateChronoDisplay() {
    const now       = Date.now();
    const elapsed   = now - chronoStartTime;     // tempo passato da start
    const totalMs   = chronoElapsedTime + elapsed;
    document.getElementById('chrono').textContent = chronoFormatTime(totalMs);
  }

  function startChrono() {
    if (chronoInterval) return;   // già in esecuzione
    // se parte da zero o da pausa
    chronoStartTime = Date.now();
    // l’intervallo ogni 100 ms (basta per 2 cifre di centesimi)
    chronoInterval = setInterval(updateChronoDisplay, 100);
  }

  function stopChrono() {
    if (!chronoInterval) return;
    clearInterval(chronoInterval);
    chronoInterval = null;
    // salva il tempo trascorso fino ad ora
    const now     = Date.now();
    chronoElapsedTime += now - chronoStartTime;
  }

  function resetChrono() {
    clearInterval(chronoInterval);
    chronoInterval    = null;
    chronoElapsedTime = 0;
    chronoStartTime   = 0;
    document.getElementById('chrono').textContent = '00:00:00,00';
  }






/*timer*/
  // timer “semplice” (evita collisioni con il round-timer)
  let simpleTimerInterval = null;
  let simpleTimeLeft      = 0;
  let simpleEndTime       = 0;


  function simpleFormatTime(ms) {
    // centesimi totali
    let centi = Math.floor(ms / 10);
    // estrai centesimi (00–99)
    const cc = centi % 100;
    centi = Math.floor(centi / 100);
    // estrai secondi (00–59)
    const ss = centi % 60;
    centi = Math.floor(centi / 60);
    // estrai minuti (00–59)
    const mm = centi % 60;
    centi = Math.floor(centi / 60);
    // ore rimanenti
    const hh = centi;

    const strH = String(hh).padStart(2, '0');
    const strM = String(mm).padStart(2, '0');
    const strS = String(ss).padStart(2, '0');
    const strC = String(cc).padStart(2, '0');

    return `${strH}:${strM}:${strS},${strC}`;
  }

  function simpleGetInputDuration() {
    const h = parseInt(document.getElementById('input-hours').value, 10)   || 0;
    const m = parseInt(document.getElementById('input-minutes').value, 10) || 0;
    const s = parseInt(document.getElementById('input-seconds').value, 10) || 0;
    return ((h * 3600) + (m * 60) + s) * 1000;
  }

  
  function simpleUpdateDisplay() {
    const now       = Date.now();
    const remaining = simpleEndTime - now;

    if (remaining <= 0) {
      clearInterval(simpleTimerInterval);
      simpleTimerInterval = null;

      // *** qui scatta il beep ***
      playBeep();

      document.getElementById('timer-display').textContent = "00:00:00,00";
      simpleShowSetup();
      return;
    }

    document.getElementById('timer-display').textContent = simpleFormatTime(remaining);
    simpleTimeLeft = remaining;
  }
  function simpleShowSetup() {
    document.getElementById('timer-setup').style.display   = 'flex';
    document.getElementById('timer-display').style.display = 'none';
  }

  function simpleShowTimer() {
    document.getElementById('timer-setup').style.display   = 'none';
    document.getElementById('timer-display').style.display = 'block';
  }

  function simpleStartTimer() {
    if (simpleTimerInterval) return;
    if (simpleTimeLeft === 0) {
      simpleTimeLeft = simpleGetInputDuration();
      if (simpleTimeLeft <= 0) {
        alert("Imposta un tempo maggiore di zero!");
        return;
      }
    }

    simpleShowTimer();
    simpleEndTime = Date.now() + simpleTimeLeft;
    simpleTimerInterval = setInterval(simpleUpdateDisplay, 100);
  }

  function simpleStopTimer() {
    if (!simpleTimerInterval) return;
    clearInterval(simpleTimerInterval);
    simpleTimerInterval = null;
  }

  function simpleResetTimer() {
    clearInterval(simpleTimerInterval);
    simpleTimerInterval = null;
    simpleTimeLeft = 0;
    const init = simpleGetInputDuration();
    document.getElementById('timer-display').textContent = simpleFormatTime(init);
    simpleShowSetup();
  }




/*timer round*/
let roundTimerInterval;
let roundTimeLeft = 0;
let pauseTimeLeft = 0;
let currentRound = 1;
let totalRounds = 1;
let isPause = false;

// Suono beep
function playBeep() {
  const beep = document.getElementById("beep-sound");
  if (beep) {
    beep.currentTime = 0;
    beep.play().catch((err) => console.log("Beep error:", err));
  }
}

function formatTime(seconds) {
  let m = Math.floor(seconds / 60);
  let s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function startRoundTimer() {
  if (roundTimerInterval) return; // evita doppi start

  const secRound = parseInt(document.getElementById('input-round-seconds').value) || 0;
  const pauseSec = parseInt(document.getElementById('input-pause-seconds').value) || 0;
  totalRounds = parseInt(document.getElementById('input-num-rounds').value) || 1;

  if (secRound <= 0) {
    alert("Imposta almeno 1 secondo per il round.");
    return;
  }

  roundTimeLeft = secRound;
  pauseTimeLeft = pauseSec;
  currentRound = 1;
  isPause = false;

  updateRoundTimerDisplay();

  roundTimerInterval = setInterval(() => {
    if (!isPause) {
      if (roundTimeLeft > 0) {
        roundTimeLeft--;
        updateRoundTimerDisplay();
      } else {
        playBeep();
        if (pauseTimeLeft > 0) {
          isPause = true;
          updateRoundTimerDisplay(true);
        } else {
          if (currentRound < totalRounds) {
            currentRound++;
            roundTimeLeft = secRound;
            isPause = false;
            updateRoundTimerDisplay();
          } else {
            stopRoundTimer();
            alert("Allenamento finito");
          }
        }
      }
    } else {
      if (pauseTimeLeft > 0) {
        pauseTimeLeft--;
        updateRoundTimerDisplay(true);
      } else {
        playBeep();
        if (currentRound < totalRounds) {
          currentRound++;
          roundTimeLeft = secRound;
          pauseTimeLeft = pauseSec;
          isPause = false;
          updateRoundTimerDisplay();
        } else {
          stopRoundTimer();
          alert("Allenamento finito");
        }
      }
    }
  }, 1000);
}


function stopRoundTimer() {
  clearInterval(roundTimerInterval);
  roundTimerInterval = null;
}

function resetRoundTimer() {
  stopRoundTimer();
  roundTimeLeft = 0;
  pauseTimeLeft = 0;
  currentRound = 1;
  isPause = false;
  document.getElementById('round-timer-display').textContent = "00:00";
}

function updateRoundTimerDisplay(isInPause = false) {
  const display = document.getElementById('round-timer-display');
  if (isInPause) {
    display.textContent = `Pausa: ${formatTime(pauseTimeLeft)}`;
  } else {
    display.textContent = `Round ${currentRound}/${totalRounds}: ${formatTime(roundTimeLeft)}`;
  }
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

/*
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
*/
function handleAllenamento(risposta) {
  const giàRisposto = localStorage.getItem(ALLENAMENTO_TIME);
  const ora = Date.now();

  if (giàRisposto && ora < parseInt(giàRisposto)) {
    mostraMessaggio("Hai già risposto oggi");
    return;
  }

  if (risposta === true) {
    // 1. Salva la data nel formato YYYY-MM-DD
    const oggi = new Date();
    const keyData = `${oggi.getFullYear()}-${(oggi.getMonth() + 1).toString().padStart(2, '0')}-${oggi.getDate().toString().padStart(2, '0')}`;
    localStorage.setItem(keyData, "trained");

    // 2. Incrementa il counter
    let counter = parseInt(localStorage.getItem(COUNTER_KEY)) || 0;
    localStorage.setItem(COUNTER_KEY, counter + 1);

    // 3. Se esiste il calendario, aggiornalo
    if (typeof renderCalendar === "function" && typeof currentDate !== "undefined") {
      renderCalendar(currentDate);
    }

    // 4. Se esiste il counter visuale, aggiornalo
    if (typeof mostraCounterAllenamenti === "function") {
      mostraCounterAllenamenti();
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


/*testing
function resetRispostaAllenamento() {
  localStorage.removeItem("allenamento_time");
  console.log("Test: risposta sbloccata, puoi cliccare di nuovo.");
}

HTML
  <button onclick="resetRispostaAllenamento()">Sblocca risposta</button>
*/

















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

if (document.getElementById("calendarDays")){
const calendarDays = document.getElementById("calendarDays");
const monthYear = document.getElementById("monthYear");
const mesiNomi = [
  "Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
  "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"
];

let currentDate = new Date();

function renderCalendar(date) {
  calendarDays.innerHTML = "";

  const anno = date.getFullYear();
  const mese = date.getMonth();

  monthYear.textContent = `${mesiNomi[mese]} ${anno}`;

  let primoGiorno = new Date(anno, mese, 1);
  let primoGiornoSettimana = primoGiorno.getDay();
  primoGiornoSettimana = primoGiornoSettimana === 0 ? 6 : primoGiornoSettimana - 1;

  const giorniNelMese = new Date(anno, mese + 1, 0).getDate();
  const giorniNelMesePrec = new Date(anno, mese, 0).getDate();

  // Giorni mese precedente
  for (let i = primoGiornoSettimana - 1; i >= 0; i--) {
    const dayElem = document.createElement("div");
    dayElem.classList.add("day", "other-month");
    dayElem.textContent = giorniNelMesePrec - i;
    calendarDays.appendChild(dayElem);
  }

  const oggi = new Date();

  for (let i = 1; i <= giorniNelMese; i++) {
    const dayElem = document.createElement("div");
    dayElem.classList.add("day");
    dayElem.textContent = i;

    if (anno === oggi.getFullYear() && mese === oggi.getMonth() && i === oggi.getDate()) {
      dayElem.classList.add("today");
    }

    const keyData = `${anno}-${(mese + 1).toString().padStart(2, '0')}-${i.toString().padStart(2, '0')}`;
    if (localStorage.getItem(keyData) === "trained") {
      dayElem.classList.add("trained");
    }

    calendarDays.appendChild(dayElem);
  }

  // Giorni mese successivo per completare griglia (fino a 42 celle)
  const totaleGiorniVisualizzati = primoGiornoSettimana + giorniNelMese;
  const giorniDaAggiungere = 42 - totaleGiorniVisualizzati;

  for (let i = 1; i <= giorniDaAggiungere; i++) {
    const dayElem = document.createElement("div");
    dayElem.classList.add("day", "other-month");
    dayElem.textContent = i;
    calendarDays.appendChild(dayElem);
  }
}

function mostraCounterAllenamenti() {
  let count = 0;
  for (let key in localStorage) {
    if (localStorage.getItem(key) === "trained") {
      count++;
    }
  }
  document.getElementById("counterText").textContent = `ALLENAMENTI CORRENTI: ${count} / 365`;
}

// Bottoni navigazione mese
document.getElementById("prevMonth").addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar(currentDate);
});

document.getElementById("nextMonth").addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar(currentDate);
});

// Bottone "Sì" → allenato oggi
document.getElementById("btnSi").addEventListener("click", (e) => {
  e.preventDefault();

  const oggi = new Date();
  const anno = oggi.getFullYear();
  const mese = (oggi.getMonth() + 1).toString().padStart(2, '0');
  const giorno = oggi.getDate().toString().padStart(2, '0');
  const keyData = `${anno}-${mese}-${giorno}`;

  localStorage.setItem(keyData, "trained");

  const messaggio = document.getElementById("messaggioAllenamento");
  messaggio.style.display = "block";
  messaggio.classList.add("fade-in");

  setTimeout(() => {
    messaggio.style.display = "none";
  }, 2000);

  renderCalendar(currentDate); // aggiorna subito il calendario
  mostraCounterAllenamenti(); // aggiorna counter
});

// Bottone "No" → rimuove eventualmente l'allenamento
document.getElementById("btnNo").addEventListener("click", (e) => {
  e.preventDefault();

  const oggi = new Date();
  const anno = oggi.getFullYear();
  const mese = (oggi.getMonth() + 1).toString().padStart(2, '0');
  const giorno = oggi.getDate().toString().padStart(2, '0');
  const keyData = `${anno}-${mese}-${giorno}`;

  localStorage.removeItem(keyData);

  renderCalendar(currentDate);
  mostraCounterAllenamenti();
});

// All'avvio
document.addEventListener("DOMContentLoaded", () => {
  renderCalendar(currentDate);
  mostraCounterAllenamenti();
});
}






















/*btn carica pdf*/
 document.addEventListener("DOMContentLoaded", () => {
      const inputSchede = document.getElementById("uploadSchedeFiles");
      const btnSchede = document.getElementById("btnSchedeUpload");
      const previewSchede = document.getElementById("previewSchedeArea");

      btnSchede.addEventListener("click", () => {
        inputSchede.click();
      });

      inputSchede.addEventListener("change", () => {
        const filesSchede = inputSchede.files;
        if (!filesSchede || filesSchede.length === 0) return;

        Array.from(filesSchede).forEach((fileSchede) => {
          const urlSchede = URL.createObjectURL(fileSchede);

          if (fileSchede.type.startsWith("image/")) {
            const containerSchede = document.createElement("div");

            const imgSchede = document.createElement("img");
            imgSchede.src = urlSchede;

            const btnSchedeDelete = document.createElement("button");
            btnSchedeDelete.textContent = "Elimina Scheda";
            btnSchedeDelete.className = "btnSchedeDelete";

            btnSchedeDelete.addEventListener("click", () => {
              previewSchede.removeChild(containerSchede);
            });

            containerSchede.appendChild(imgSchede);
            containerSchede.appendChild(btnSchedeDelete);
            previewSchede.appendChild(containerSchede);

          } else if (fileSchede.type === "application/pdf") {
            const containerSchede = document.createElement("div");

            const linkSchede = document.createElement("a");
            linkSchede.href = urlSchede;
            linkSchede.target = "_blank";
            linkSchede.textContent = "Apri il PDF Schede in un'altra scheda";
            linkSchede.style.display = "block";
            linkSchede.style.marginBottom = "10px";
            linkSchede.style.color = "blue";

            const btnSchedeDelete = document.createElement("button");
            btnSchedeDelete.textContent = "Elimina Schede";
            btnSchedeDelete.className = "btnSchedeDelete";

            btnSchedeDelete.addEventListener("click", () => {
              previewSchede.removeChild(containerSchede);
            });

            containerSchede.appendChild(linkSchede);
            containerSchede.appendChild(btnSchedeDelete);
            previewSchede.appendChild(containerSchede);
          } else {
            const pSchede = document.createElement("p");
            pSchede.textContent = "Tipo di file Scheda non supportato.";
            pSchede.style.color = "red";
            previewSchede.appendChild(pSchede);
          }
        });

        // Pulisce l’input per poter caricare di nuovo gli stessi file se serve
        inputSchede.value = "";
      });
    });



/*carica dieta*/
     document.addEventListener("DOMContentLoaded", () => {
      const inputDieta = document.getElementById("uploadDietaFiles");
      const btnDieta = document.getElementById("btnDietaUpload");
      const previewDieta = document.getElementById("previewDietaArea");

      btnDieta.addEventListener("click", () => {
        inputDieta.click();
      });

      inputDieta.addEventListener("change", () => {
        const filesDieta = inputDieta.files;
        if (!filesDieta || filesDieta.length === 0) return;

        Array.from(filesDieta).forEach((fileDieta) => {
          const urlDieta = URL.createObjectURL(fileDieta);

          if (fileDieta.type.startsWith("image/")) {
            const containerDieta = document.createElement("div");

            const imgDieta = document.createElement("img");
            imgDieta.src = urlDieta;

            const btnDietaDelete = document.createElement("button");
            btnDietaDelete.textContent = "Elimina Dieta";
            btnDietaDelete.className = "btnDietaDelete";

            btnDietaDelete.addEventListener("click", () => {
              previewDieta.removeChild(containerDieta);
            });

            containerDieta.appendChild(imgDieta);
            containerDieta.appendChild(btnDietaDelete);
            previewDieta.appendChild(containerDieta);

          } else if (fileDieta.type === "application/pdf") {
  const containerDieta = document.createElement("div");

  const linkDieta = document.createElement("a");
  linkDieta.href = urlDieta;
  linkDieta.target = "_blank";
  linkDieta.textContent = "Apri il PDF Scheda in un'altra scheda";
  linkDieta.style.display = "block";
  linkDieta.style.marginBottom = "10px";
  linkDieta.style.color = "blue";

  const btnDietaDelete = document.createElement("button");
  btnDietaDelete.textContent = "Elimina Dieta";
  btnDietaDelete.className = "btnDietaDelete";

  btnDietaDelete.addEventListener("click", () => {
    previewDieta.removeChild(containerDieta);
  });

  containerDieta.appendChild(linkDieta);
  containerDieta.appendChild(btnDietaDelete);
  previewDieta.appendChild(containerDieta);
} else {
            const pDieta = document.createElement("p");
            pDieta.textContent = "Tipo di file Dieta non supportato.";
            pDieta.style.color = "red";
            previewDieta.appendChild(pDieta);
          }
        });

        // Pulisce l’input per poter caricare di nuovo gli stessi file se serve
        inputDieta.value = "";
      });
    });



