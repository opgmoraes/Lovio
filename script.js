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
  const anos = hoje.getFullYear() - inicio.getFullYear();
  const meses = hoje.getMonth() - inicio.getMonth();
  const dias = hoje.getDate() - inicio.getDate();

  let totalMeses = anos * 12 + meses;
  if (dias < 0) totalMeses -= 1;

  const anosFinal = Math.floor(totalMeses / 12);
  const mesesFinal = totalMeses % 12;

  let texto = "";
  if (anosFinal > 0) texto += anosFinal + " ano" + (anosFinal > 1 ? "s" : "");
  if (mesesFinal > 0) texto += (anosFinal > 0 ? " e " : "") + mesesFinal + " mês" + (mesesFinal > 1 ? "es" : "");

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
    } else {
      document.getElementById("previewImage").style.display = "none";
    }

    const musicaLink = document.getElementById("musica").value;
    document.getElementById("qrcode").innerHTML = "";
    if (musicaLink) {
      QRCode.toCanvas(document.createElement('canvas'), musicaLink, { width: 128 }, function (err, canvas) {
        if (!err) document.getElementById("qrcode").appendChild(canvas);
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
  html2canvas(document.getElementById("preview")).then(canvas => {
    canvas.toBlob(blob => {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "memoria.png";
      link.click();
    });
  });
}

document.getElementById("modeToggle").addEventListener("change", function () {
  document.body.classList.toggle("dark");
  document.getElementById("modeLabel").innerText = this.checked ? "Modo Escuro" : "Modo Claro";
});

showStep(etapaAtual);
