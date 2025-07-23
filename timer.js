// timer.js

window.addEventListener("DOMContentLoaded", () => {
  // 1) cache degli elementi dopo che il DOM è pronto
  const inputYears  = document.getElementById("input-years");
  const inputMonths = document.getElementById("input-months");
  const inputWeeks  = document.getElementById("input-weeks");
  const display     = document.getElementById("timer-display");
  const startBtn    = document.getElementById("startBtn");
  const stopBtn     = document.getElementById("stopBtn");
  const resetBtn    = document.getElementById("resetBtn");

  let intervalId;
  let endDate;

  // 2) collega i bottoni
  startBtn.addEventListener("click", startTimer);
  stopBtn.addEventListener("click", stopTimer);
  resetBtn.addEventListener("click", resetTimer);

  // 3) definisci le funzioni
  function startTimer() {
    const years  = parseInt(inputYears.value ) || 0;
    const months = parseInt(inputMonths.value) || 0;
    const weeks  = parseInt(inputWeeks.value ) || 0;

    const totalDays = years*365 + months*30 + weeks*7;
    endDate = new Date(Date.now() + totalDays*24*60*60*1000);

    display.style.display = "block";
    updateDisplay();
    localStorage.setItem("endDate", endDate.toISOString());

    clearInterval(intervalId);
    intervalId = setInterval(updateDisplay, 1000);
  }

  function updateDisplay() {
    const now   = new Date();
    const diff  = endDate - now;

    if (diff <= 0) {
      clearInterval(intervalId);
      display.textContent = "00 anni, 00 mesi, 00 settimane";
      localStorage.removeItem("endDate");
      mostraNotificaFinale();
      return;
    }

    const totalDays = Math.floor(diff / (1000*60*60*24));
    const yrs       = Math.floor(totalDays / 365);
    const rem       = totalDays % 365;
    const mths      = Math.floor(rem / 30);
    const wks       = Math.floor((rem % 30) / 7);

    display.textContent =
      `${pad(yrs)} anni, ${pad(mths)} mesi, ${pad(wks)} settimane`;
  }

  function stopTimer() {
    clearInterval(intervalId);
  }

  function resetTimer() {
    stopTimer();
    inputYears.value  = 0;
    inputMonths.value = 0;
    inputWeeks.value  = 0;
    display.style.display = "none";
    localStorage.removeItem("endDate");
  }

  function pad(n) {
    return n.toString().padStart(2, "0");
  }

  function mostraNotificaFinale() {
    const msg = "📸 Carica la foto del tuo cambiamento fisico!";
    if ("Notification" in window) {
      Notification.requestPermission().then(p => {
        if (p === "granted") new Notification(msg);
        else alert(msg);
      });
    } else {
      alert(msg);
    }
  }

  // 4) riprendi il timer se ricarichi
  const saved = localStorage.getItem("endDate");
  if (saved) {
    endDate = new Date(saved);
    display.style.display = "block";
    updateDisplay();
    intervalId = setInterval(updateDisplay, 1000);
  }
});
