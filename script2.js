/*******carica foto */
document.addEventListener("DOMContentLoaded", () => {
  const uploadInput = document.getElementById("uploadFoto");
  const caricaBtn = document.getElementById("caricaBtn");
  const imgPreview = document.getElementById("immagineCaricata");

  // Clicca su bottone → apre file selector
  caricaBtn.addEventListener("click", () => {
    uploadInput.click();
  });

  // Al caricamento di un file
  uploadInput.addEventListener("change", function() {
    const file = this.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();

      reader.onload = function(e) {
        const base64 = e.target.result;
        localStorage.setItem("foto_utente", base64); // salva immagine
        mostraImmagine(base64);
      };

      reader.readAsDataURL(file);
    }
  });

  // Mostra immagine se già presente in localStorage
  const salvata = localStorage.getItem("foto_utente");
  if (salvata) {
    mostraImmagine(salvata);
  }

  function mostraImmagine(src) {
    imgPreview.src = src;
    imgPreview.style.display = "block";
  }
});






/*timer anni*/
let interval;
let endDate;

function startTimer() {
  const years = parseInt(document.getElementById("input-years").value) || 0;
  const months = parseInt(document.getElementById("input-months").value) || 0;
  const weeks = parseInt(document.getElementById("input-weeks").value) || 0;

  const totalDays = years * 365 + months * 30 + weeks * 7;
  const now = new Date();
  endDate = new Date(now.getTime() + totalDays * 24 * 60 * 60 * 1000);

  document.getElementById("timer-display").style.display = "block";
  updateDisplay();
  clearInterval(interval);
  interval = setInterval(updateDisplay, 1000);
}

function updateDisplay() {
  const now = new Date();
  let diff = endDate - now;

  if (diff <= 0) {
    clearInterval(interval);
    document.getElementById("timer-display").textContent = "00 anni, 00 mesi, 00 settimane";
    mostraNotificaFinale(); 
  }

  const totalDays = Math.floor(diff / (1000 * 60 * 60 * 24));
  let years = Math.floor(totalDays / 365);
  let remaining = totalDays % 365;
  let months = Math.floor(remaining / 30);
  let weeks = Math.floor((remaining % 30) / 7);

  document.getElementById("timer-display").textContent =
    `${pad(years)} anni, ${pad(months)} mesi, ${pad(weeks)} settimane`;
}

function stopTimer() {
  clearInterval(interval);
}

function resetTimer() {
  stopTimer();
  document.getElementById("input-years").value = 0;
  document.getElementById("input-months").value = 0;
  document.getElementById("input-weeks").value = 0;
  document.getElementById("timer-display").style.display = "none";
}

function pad(n) {
  return n.toString().padStart(2, '0');
}

function mostraNotificaFinale() {
  if ("Notification" in window) {
    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        new Notification("📸 È ora di caricare la foto della tua condizione attuale!");
      }
    });
  }
}


/*dinamic navbar*/
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