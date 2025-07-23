/*******carica foto STEP! *****/


// Selezioni
const uploadBtn   = document.getElementById('uploadBtn');
const uploadInput = document.getElementById('uploadInput');
const photosDiv   = document.getElementById('photos');

// Quando clicchi il button, “apri” il file picker
uploadBtn.addEventListener('click', () => {
  uploadInput.click();
});

// Al cambio del file input, leggi e mostra l’immagine
uploadInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (ev) => {
    const container = document.createElement('div');
    container.className = 'photo-container';

    const img = document.createElement('img');
    img.src = ev.target.result;
    img.className = 'photo-box';

    const del = document.createElement('button');
    del.textContent = 'Elimina';
    del.className = 'delete-btn';
    del.addEventListener('click', () => container.remove());

    container.appendChild(img);
    container.appendChild(del);
    photosDiv.appendChild(container);
  };
  reader.readAsDataURL(file);

  // resetta l’input per poter ri-caricare lo stesso file se vuoi
  uploadInput.value = '';
});


/*CARICA STEP3*/
/**
 * Inizializza un uploader di foto
 * @param {string} btnId       ID del button che apre il file picker
 * @param {string} inputId     ID dell'input type=file nascosto
 * @param {string} photosDivId ID del container dove appendere le foto
 */
function initPhotoUploader(btnId, inputId, photosDivId) {
  const btn   = document.getElementById(btnId);
  const input = document.getElementById(inputId);
  const div   = document.getElementById(photosDivId);

  if (!btn || !input || !div) {
    console.warn(`initPhotoUploader: elemento non trovato ${btnId}, ${inputId} o ${photosDivId}`);
    return;
  }

  // quando clicchi il button, “apri” il file picker
  btn.addEventListener('click', () => input.click());

  // al cambio del file input, leggi e mostra l’immagine
  input.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const container = document.createElement('div');
      container.className = 'photo-container';

      const img = document.createElement('img');
      img.src = ev.target.result;
      img.className = 'photo-box';

      const del = document.createElement('button');
      del.textContent = 'Elimina';
      del.className = 'delete-btn';
      del.addEventListener('click', () => container.remove());

      container.appendChild(img);
      container.appendChild(del);
      div.appendChild(container);
    };
    reader.readAsDataURL(file);

    // resetta per poter ri-caricare lo stesso file se vuoi
    input.value = '';
  });
}

// inizializza entrambi gli step
window.addEventListener('DOMContentLoaded', () => {
  initPhotoUploader('uploadBtn-before', 'uploadInput-before', 'photos-before');
  initPhotoUploader('uploadBtn-after',  'uploadInput-after',  'photos-after');
});






