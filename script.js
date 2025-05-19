let etapaAtual = 0;
let imagemSelecionada = null;
const steps = document.querySelectorAll(".step");
const progress = document.getElementById("progress");
const senhaCorreta = "liberar2024";

function updateProgress() {
  const percent = ((etapaAtual) / (steps.length - 1)) * 100;
  progress.style.width = percent + "%";
}

function showStep(index) {
  steps.forEach((s, i) => s.classList.toggle("active", i === index));
  updateProgress();
}

function calcularTempoJuntos(data) {
  const hoje = new Date();
  const inicio = new Date(data);
  const diff = hoje - inicio;
  const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
  const anos = Math.floor(dias / 365);
  const meses = Math.floor((dias % 365) / 30);

  let texto = "";
  if (anos > 0) texto += `${anos} ano${anos > 1 ? "s" : ""}`;
  if (meses > 0) texto += `${anos > 0 ? " e " : ""}${meses} mês${meses > 1 ? "es" : ""}`;
  return texto || "Menos de um mês";
}

function nextStep() {
  if (etapaAtual < steps.length - 1) etapaAtual++;

  if (etapaAtual === 2) {
    const nome = document.getElementById("nome").value;
    const mensagem = document.getElementById("mensagem").value;
    const data = document.getElementById("data").value;

    document.getElementById("prevNome").innerText = nome;
    document.getElementById("prevMensagem").innerText = mensagem;
    document.getElementById("prevData").innerText = data + " (" + calcularTempoJuntos(data) + ")";

    if (imagemSelecionada) {
      const reader = new FileReader();
      reader.onload = function (e) {
        document.getElementById("previewImage").src = e.target.result;
      };
      reader.readAsDataURL(imagemSelecionada);
    }

    const musicaLink = document.getElementById("musica").value;
    const qrcodeDiv = document.getElementById("qrcode");
    qrcodeDiv.innerHTML = "";

    if (musicaLink) {
      const canvas = document.createElement("canvas");
      QRCode.toCanvas(canvas, musicaLink, { width: 128 }, function (err) {
        if (!err) qrcodeDiv.appendChild(canvas);
      });
    }
  }

  showStep(etapaAtual);
}

function prevStep() {
  if (etapaAtual > 0) etapaAtual--;
  showStep(etapaAtual);
}

document.getElementById("imagem").addEventListener("change", (e) => {
  imagemSelecionada = e.target.files[0];
});

document.getElementById("senha").addEventListener("input", () => {
  const senha = document.getElementById("senha").value;
  document.getElementById("botaoDownload").style.display = senha === senhaCorreta ? "block" : "none";
});

function baixarImagem() {
  html2canvas(document.getElementById("previewMontagem")).then(canvas => {
    canvas.toBlob(blob => {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "lembranca-do-casal.png";
      link.click();
    });
  });
}

document.getElementById("modeToggle").addEventListener("change", function () {
  document.body.classList.toggle("dark");
  document.getElementById("modeLabel").innerText = this.checked ? "Modo Escuro" : "Modo Claro";
});

showStep(etapaAtual);
