const statusText = document.getElementById('status');
const phrases = [
    "BUSCANDO PULSO...",
    "VINCULANDO ANCLA BIOLÓGICA...",
    "SINCRONIZANDO...",
    "ADRENALINA DETECTADA",
    "MONITOREO ACTIVO"
];
let i = 0;
setInterval(() => {
    statusText.innerText = phrases[i % phrases.length];
    i++;
}, 3000);
