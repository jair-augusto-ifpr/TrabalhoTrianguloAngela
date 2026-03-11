var listaTriangulos = [];
var coresTriangulos = ["#1a73e8", "#d93025", "#1e8e3e", "#9334e6", "#ea8600", "#0097a7"];

function trocarEntrada() {
  var modo = document.querySelector('input[name="entrada"]:checked').value;
  document.getElementById("bloco-lados").style.display = modo === "lados" ? "block" : "none";
  document.getElementById("bloco-angulos").style.display = modo === "angulos" ? "block" : "none";
  document.getElementById("bloco-pontos").style.display = modo === "pontos" ? "block" : "none";
  if (modo === "angulos") atualizarEsboco();
}

function dist(x1, y1, x2, y2) {
  return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
}

function obterDadosTriangulo() {
  var modo = document.querySelector('input[name="entrada"]:checked').value;
  var porAngulos = modo === "angulos";
  var porPontos = modo === "pontos";
  var ladoA, ladoB, ladoC, angA, angB, angC;
  var xA, yA, xB, yB, xC, yC;

  if (porPontos) {
    xA = parseFloat(document.getElementById("pAx").value);
    yA = parseFloat(document.getElementById("pAy").value);
    xB = parseFloat(document.getElementById("pBx").value);
    yB = parseFloat(document.getElementById("pBy").value);
    xC = parseFloat(document.getElementById("pCx").value);
    yC = parseFloat(document.getElementById("pCy").value);
    if ([xA, yA, xB, yB, xC, yC].some(function(v) { return isNaN(v); }))
      return { err: "Preencha todas as coordenadas." };
    var det = xA * (yB - yC) + xB * (yC - yA) + xC * (yA - yB);
    if (Math.abs(det) < 1e-10) return { err: "Os três pontos são colineares (determinante = 0). Não formam triângulo." };
    ladoA = dist(xB, yB, xC, yC);
    ladoB = dist(xA, yA, xC, yC);
    ladoC = dist(xA, yA, xB, yB);
  } else if (porAngulos) {
    angA = parseFloat(document.getElementById("angA").value);
    angB = parseFloat(document.getElementById("angB").value);
    angC = parseFloat(document.getElementById("angC").value);
    var vA = !isNaN(angA) && document.getElementById("angA").value.trim() !== "";
    var vB = !isNaN(angB) && document.getElementById("angB").value.trim() !== "";
    var vC = !isNaN(angC) && document.getElementById("angC").value.trim() !== "";
    var nAng = (vA ? 1 : 0) + (vB ? 1 : 0) + (vC ? 1 : 0);
    if (nAng < 2) return { err: "Informe pelo menos 2 ângulos." };
    if (!vA) angA = 180 - angB - angC;
    else if (!vB) angB = 180 - angA - angC;
    else angC = 180 - angA - angC;
    if (angA <= 0 || angB <= 0 || angC <= 0 || angA >= 180 || angB >= 180 || angC >= 180) return { err: "Ângulos inválidos." };
    if (nAng === 3 && Math.abs(angA + angB + angC - 180) > 0.01) return { err: "Soma dos ângulos deve ser 180°." };
    var rad = function(d) { return d * Math.PI / 180; };
    ladoC = 1;
    ladoA = Math.sin(rad(angA)) / Math.sin(rad(angC));
    ladoB = Math.sin(rad(angB)) / Math.sin(rad(angC));
    xA = 0; yA = 0;
    xB = ladoC; yB = 0;
    xC = (ladoC * ladoC + ladoB * ladoB - ladoA * ladoA) / (2 * ladoC);
    yC = Math.sqrt(Math.max(0, ladoB * ladoB - xC * xC));
  } else {
    ladoA = parseFloat(document.getElementById("ladoA").value);
    ladoB = parseFloat(document.getElementById("ladoB").value);
    ladoC = parseFloat(document.getElementById("ladoC").value);
    if (isNaN(ladoA) || isNaN(ladoB) || isNaN(ladoC)) return { err: "Valores numéricos obrigatórios." };
    if (ladoA <= 0 || ladoB <= 0 || ladoC <= 0) return { err: "Lados devem ser positivos." };
    if (!(ladoA + ladoB > ladoC && ladoA + ladoC > ladoB && ladoB + ladoC > ladoA)) return { err: "Não formam triângulo." };
    xA = 0; yA = 0;
    xB = ladoC; yB = 0;
    xC = (ladoC * ladoC + ladoB * ladoB - ladoA * ladoA) / (2 * ladoC);
    yC = Math.sqrt(Math.max(0, ladoB * ladoB - xC * xC));
  }
  var baricentroX = (xA + xB + xC) / 3, baricentroY = (yA + yB + yC) / 3;
  var incentroX = (ladoA * xA + ladoB * xB + ladoC * xC) / (ladoA + ladoB + ladoC);
  var incentroY = (ladoA * yA + ladoB * yB + ladoC * yC) / (ladoA + ladoB + ladoC);
  var angA2, angB2, angC2;
  if (porAngulos) { angA2 = angA; angB2 = angB; angC2 = angC; }
  else {
    var r2d = function(r) { return r * 180 / Math.PI; };
    angA2 = r2d(Math.acos((ladoB * ladoB + ladoC * ladoC - ladoA * ladoA) / (2 * ladoB * ladoC)));
    angB2 = r2d(Math.acos((ladoA * ladoA + ladoC * ladoC - ladoB * ladoB) / (2 * ladoA * ladoC)));
    angC2 = r2d(Math.acos((ladoA * ladoA + ladoB * ladoB - ladoC * ladoC) / (2 * ladoA * ladoB)));
  }
  var tipo = "Escaleno";
  if (ladoA === ladoB && ladoB === ladoC) tipo = "Equilátero";
  else if (ladoA === ladoB || ladoA === ladoC || ladoB === ladoC) tipo = "Isósceles";
  var perimetro = ladoA + ladoB + ladoC;
  var s = perimetro / 2;
  var area = Math.sqrt(s * (s - ladoA) * (s - ladoB) * (s - ladoC));
  return { ladoA: ladoA, ladoB: ladoB, ladoC: ladoC, xA: xA, yA: yA, xB: xB, yB: yB, xC: xC, yC: yC, baricentroX: baricentroX, baricentroY: baricentroY, incentroX: incentroX, incentroY: incentroY, angA: angA2, angB: angB2, angC: angC2, tipo: tipo, perimetro: perimetro, area: area };
}

function adicionarTriangulo() {
  document.getElementById("terceiroAngulo").textContent = "";
  var dados = obterDadosTriangulo();
  if (dados.err) {
    document.getElementById("resultado").textContent = dados.err;
    return;
  }
  var id = Date.now();
  var idx = listaTriangulos.length % coresTriangulos.length;
  listaTriangulos.push({ id: id, visible: true, color: coresTriangulos[idx], ladoA: dados.ladoA, ladoB: dados.ladoB, ladoC: dados.ladoC, xA: dados.xA, yA: dados.yA, xB: dados.xB, yB: dados.yB, xC: dados.xC, yC: dados.yC, baricentroX: dados.baricentroX, baricentroY: dados.baricentroY, incentroX: dados.incentroX, incentroY: dados.incentroY, angA: dados.angA, angB: dados.angB, angC: dados.angC, tipo: dados.tipo, perimetro: dados.perimetro, area: dados.area });
  document.getElementById("resultado").textContent = "Adicionado: " + dados.tipo + ".";
  renderListaTriangulos();
  redesenharCanvas();
}

function toggleTriangulo(id) {
  var t = listaTriangulos.find(function(x) { return x.id === id; });
  if (t) { t.visible = !t.visible; renderListaTriangulos(); redesenharCanvas(); }
}

function removerTriangulo(id) {
  listaTriangulos = listaTriangulos.filter(function(x) { return x.id !== id; });
  renderListaTriangulos();
  redesenharCanvas();
}

function renderListaTriangulos() {
  var ul = document.getElementById("lista-triangulos-ul");
  ul.innerHTML = "";
  listaTriangulos.forEach(function(t, i) {
    var li = document.createElement("li");
    li.className = "triangulo-item";
    t.num = i + 1;
    var nome = "T" + (i + 1) + " " + t.tipo;
    li.innerHTML = "<label class=\"triangulo-toggle\"><input type=\"checkbox\" " + (t.visible ? "checked" : "") + " /> <span class=\"triangulo-nome\">" + nome + "</span></label> <span class=\"triangulo-dados\">a=" + t.ladoA.toFixed(1) + " b=" + t.ladoB.toFixed(1) + " c=" + t.ladoC.toFixed(1) + "</span> <button type=\"button\" class=\"btn-remover\">Remover</button>";
    li.querySelector("input").onclick = function() { toggleTriangulo(t.id); };
    li.querySelector(".btn-remover").onclick = function() { removerTriangulo(t.id); };
    ul.appendChild(li);
  });
}

function atualizarEsboco() {
  var canvas = document.getElementById("esboco");
  var ctx = canvas.getContext("2d");
  var w = canvas.width;
  var h = canvas.height;
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, w, h);
  var angA = parseFloat(document.getElementById("angA").value);
  var angB = parseFloat(document.getElementById("angB").value);
  var angC = parseFloat(document.getElementById("angC").value);
  var vA = !isNaN(angA) && document.getElementById("angA").value.trim() !== "";
  var vB = !isNaN(angB) && document.getElementById("angB").value.trim() !== "";
  var vC = !isNaN(angC) && document.getElementById("angC").value.trim() !== "";
  var n = (vA ? 1 : 0) + (vB ? 1 : 0) + (vC ? 1 : 0);
  if (n < 2) return;
  if (!vA) angA = 180 - angB - angC;
  else if (!vB) angB = 180 - angA - angC;
  else angC = 180 - angA - angB;
  if (angA <= 0 || angB <= 0 || angC <= 0 || angA >= 180 || angB >= 180 || angC >= 180) return;
  var rad = function(d) { return d * Math.PI / 180; };
  var rA = rad(angA), rB = rad(angB), rC = rad(angC);
  var xA = 0, yA = 0;
  var xB = 1, yB = 0;
  var ac = Math.sin(rB) / Math.sin(rC);
  var xC = ac * Math.cos(rA);
  var yC = ac * Math.sin(rA);
  var minX = Math.min(xA, xB, xC);
  var maxX = Math.max(xA, xB, xC);
  var minY = Math.min(yA, yB, yC);
  var maxY = Math.max(yA, yB, yC);
  var rangeX = maxX - minX || 1;
  var rangeY = maxY - minY || 1;
  var margin = 30;
  var scale = Math.min((w - 2 * margin) / rangeX, (h - 2 * margin) / rangeY);
  var ox = margin - minX * scale;
  var oy = h - margin + minY * scale;
  function toCanvas(x, y) {
    return { x: ox + x * scale, y: oy - y * scale };
  }
  var pA = toCanvas(xA, yA), pB = toCanvas(xB, yB), pC = toCanvas(xC, yC);
  ctx.fillStyle = "#e8f4fc";
  ctx.strokeStyle = "#2980b9";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(pA.x, pA.y);
  ctx.lineTo(pB.x, pB.y);
  ctx.lineTo(pC.x, pC.y);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#1a252f";
  ctx.font = "14px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("A (" + angA.toFixed(0) + "°)", pA.x, pA.y - 10);
  ctx.fillText("B (" + angB.toFixed(0) + "°)", pB.x, pB.y - 10);
  ctx.fillText("C (" + angC.toFixed(0) + "°)", pC.x, pC.y + 18);
  ctx.beginPath();
  ctx.arc(pA.x, pA.y, 4, 0, Math.PI * 2);
  ctx.arc(pB.x, pB.y, 4, 0, Math.PI * 2);
  ctx.arc(pC.x, pC.y, 4, 0, Math.PI * 2);
  ctx.fillStyle = "#2980b9";
  ctx.fill();
}

function atualizarPainelDados() {
  var visiveis = listaTriangulos.filter(function(t) { return t.visible; });
  var painel = document.getElementById("painel-dados");
  if (visiveis.length === 0) {
    painel.innerHTML = "<p class=\"painel-dados-vazio\">Nenhum triângulo visível. Marque um na lista acima.</p>";
    return;
  }
  var html = "<p class=\"painel-dados-titulo\">Dados</p>";
  visiveis.forEach(function(t) {
    html += "<div class=\"painel-dados-item\" style=\"border-left-color:" + t.color + "\">";
    html += "<p class=\"painel-dados-nome\">T" + t.num + " " + t.tipo + "</p>";
    html += "<p class=\"painel-dados-linhas\">Lados: a=" + t.ladoA.toFixed(2) + " &nbsp; b=" + t.ladoB.toFixed(2) + " &nbsp; c=" + t.ladoC.toFixed(2) + "</p>";
    html += "<p class=\"painel-dados-linhas\">Ângulos: " + t.angA.toFixed(1) + "° &nbsp; " + t.angB.toFixed(1) + "° &nbsp; " + t.angC.toFixed(1) + "°</p>";
    html += "<p class=\"painel-dados-linhas\">Perímetro: " + t.perimetro.toFixed(2) + " &nbsp; Área: " + t.area.toFixed(2) + "</p>";
    html += "<p class=\"painel-dados-linhas\">Baricentro G: (" + t.baricentroX.toFixed(2) + ", " + t.baricentroY.toFixed(2) + ") &nbsp; Incentro I: (" + t.incentroX.toFixed(2) + ", " + t.incentroY.toFixed(2) + ")</p>";
    html += "</div>";
  });
  painel.innerHTML = html;
}

function redesenharCanvas() {
  var canvas = document.getElementById("plano");
  var ctx = canvas.getContext("2d");
  var width = canvas.width;
  var height = canvas.height;
  var margin = 55;
  var visiveis = listaTriangulos.filter(function(t) { return t.visible; });

  ctx.fillStyle = "#fafbfc";
  ctx.fillRect(0, 0, width, height);

  if (visiveis.length === 0) {
    ctx.fillStyle = "#5f6368";
    ctx.font = "14px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Adicione triângulos e use a lista para ativar ou desativar.", width / 2, height / 2);
    atualizarPainelDados();
    return;
  }

  var gap = 1.2;
  var offsets = [];
  var worldMinX = Infinity, worldMaxX = -Infinity, worldMinY = Infinity, worldMaxY = -Infinity;
  visiveis.forEach(function(t) {
    var minTx = Math.min(t.xA, t.xB, t.xC);
    var maxTx = Math.max(t.xA, t.xB, t.xC);
    var minTy = Math.min(t.yA, t.yB, t.yC);
    var maxTy = Math.max(t.yA, t.yB, t.yC);
    var w = maxTx - minTx || 1;
    var h = maxTy - minTy || 1;
    var prev = offsets[offsets.length - 1];
    var ox = offsets.length === 0 ? 0 : (prev.x + prev.maxTx + gap - minTx);
    offsets.push({ x: ox, y: 0, w: w, h: h, minTx: minTx, maxTx: maxTx });
    worldMinX = Math.min(worldMinX, ox + minTx);
    worldMaxX = Math.max(worldMaxX, ox + maxTx);
    worldMinY = Math.min(worldMinY, minTy);
    worldMaxY = Math.max(worldMaxY, maxTy);
  });
  var pad = Math.max((worldMaxX - worldMinX), (worldMaxY - worldMinY)) * 0.15;
  worldMinX -= pad;
  worldMaxX += pad;
  worldMinY -= pad;
  worldMaxY += pad;
  var viewW = worldMaxX - worldMinX || 1;
  var viewH = worldMaxY - worldMinY || 1;
  var drawH = height - margin * 2;
  var scale = Math.min((width - 2 * margin) / viewW, drawH / viewH);
  var ox = margin - worldMinX * scale;
  var oy = height - margin + worldMinY * scale;

  function toCanvas(wx, wy) {
    return { x: ox + wx * scale, y: oy - wy * scale };
  }

  var range = Math.max(viewW, viewH);
  var step = 1;
  if (range > 20) step = 5;
  if (range > 50) step = 10;
  if (range <= 5) step = 0.5;
  if (range <= 2) step = 0.25;
  if (range <= 0.5) step = 0.1;
  var firstX = Math.floor(worldMinX / step) * step;
  var lastX = Math.ceil(worldMaxX / step) * step;
  var firstY = Math.floor(worldMinY / step) * step;
  var lastY = Math.ceil(worldMaxY / step) * step;

  ctx.strokeStyle = "#e8eaed";
  ctx.lineWidth = 1;
  for (var x = firstX; x <= lastX; x += step) {
    var p = toCanvas(x, 0);
    if (p.x >= 0 && p.x <= width) {
      ctx.beginPath();
      ctx.moveTo(p.x, 0);
      ctx.lineTo(p.x, height);
      ctx.stroke();
    }
  }
  for (var y = firstY; y <= lastY; y += step) {
    p = toCanvas(0, y);
    if (p.y >= 0 && p.y <= height) {
      ctx.beginPath();
      ctx.moveTo(0, p.y);
      ctx.lineTo(width, p.y);
      ctx.stroke();
    }
  }
  ctx.strokeStyle = "#5f6368";
  ctx.lineWidth = 1.5;
  var orig = toCanvas(0, 0);
  ctx.beginPath();
  ctx.moveTo(orig.x, 0);
  ctx.lineTo(orig.x, height);
  ctx.moveTo(0, orig.y);
  ctx.lineTo(width, orig.y);
  ctx.stroke();

  var fmt = function(v) { return Number.isInteger(v) ? String(v) : v.toFixed(1); };
  ctx.fillStyle = "#5f6368";
  ctx.font = "10px system-ui, sans-serif";
  ctx.textAlign = "center";
  for (var x = firstX; x <= lastX; x += step) {
    var p = toCanvas(x, 0);
    if (p.x >= margin - 5 && p.x <= width - margin + 5)
      ctx.fillText(Math.abs(x) < step * 0.01 ? "0" : fmt(x), p.x, orig.y + 11);
  }
  for (var y = firstY; y <= lastY; y += step) {
    p = toCanvas(0, y);
    if (p.y >= margin - 5 && p.y <= height - margin + 5) {
      ctx.textAlign = "right";
      ctx.fillText(Math.abs(y) < step * 0.01 ? "0" : fmt(y), orig.x - 4, p.y + 3);
      ctx.textAlign = "center";
    }
  }
  ctx.textAlign = "left";

  visiveis.forEach(function(t, i) {
    var off = offsets[i];
    desenharUmTriangulo(ctx, t, off.x, off.y, toCanvas, t.color);
  });

  atualizarPainelDados();
}

function desenharUmTriangulo(ctx, t, offsetX, offsetY, toCanvas, cor) {
  function w(x, y) { return toCanvas(offsetX + x, offsetY + y); }
  var pA = w(t.xA, t.yA), pB = w(t.xB, t.yB), pC = w(t.xC, t.yC);
  var hexToRgba = function(hex, a) {
    var n = parseInt(hex.slice(1), 16);
    return "rgba(" + (n >> 16) + "," + ((n >> 8) & 255) + "," + (n & 255) + "," + a + ")";
  };
  ctx.fillStyle = hexToRgba(cor, 0.18);
  ctx.beginPath();
  ctx.moveTo(pA.x, pA.y);
  ctx.lineTo(pB.x, pB.y);
  ctx.lineTo(pC.x, pC.y);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = cor;
  ctx.lineWidth = 2;
  ctx.stroke();
  var r = Math.min(14, Math.hypot(pB.x - pA.x, pB.y - pA.y) * 0.15);
  function arco(px, py, startAng, endAng) {
    ctx.beginPath();
    ctx.arc(px, py, r, -startAng, -endAng, true);
    ctx.stroke();
  }
  var dirAB = Math.atan2(pB.y - pA.y, pB.x - pA.x);
  var dirAC = Math.atan2(pC.y - pA.y, pC.x - pA.x);
  var dirBA = Math.atan2(pA.y - pB.y, pA.x - pB.x);
  var dirBC = Math.atan2(pC.y - pB.y, pC.x - pB.x);
  var dirCA = Math.atan2(pA.y - pC.y, pA.x - pC.x);
  var dirCB = Math.atan2(pB.y - pC.y, pB.x - pC.x);
  arco(pA.x, pA.y, dirAB, dirAC);
  arco(pB.x, pB.y, dirBA, dirBC);
  arco(pC.x, pC.y, dirCA, dirCB);
  ctx.fillStyle = "#1a252f";
  ctx.font = "10px system-ui, sans-serif";
  ctx.textAlign = "center";
  var midA = (dirAB + dirAC) / 2;
  var midB = (dirBA + dirBC) / 2;
  var midC = (dirCA + dirCB) / 2;
  ctx.fillText(t.angA.toFixed(0) + "°", pA.x + (r + 4) * Math.cos(-midA), pA.y + (r + 4) * Math.sin(-midA));
  ctx.fillText(t.angB.toFixed(0) + "°", pB.x + (r + 4) * Math.cos(-midB), pB.y + (r + 4) * Math.sin(-midB));
  ctx.fillText(t.angC.toFixed(0) + "°", pC.x + (r + 4) * Math.cos(-midC), pC.y + (r + 4) * Math.sin(-midC));
  function ponto(cx, cy, cor) {
    ctx.fillStyle = cor;
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
  ponto(pA.x, pA.y, cor);
  ponto(pB.x, pB.y, cor);
  ponto(pC.x, pC.y, cor);
  var pG = w(t.baricentroX, t.baricentroY);
  var pI = w(t.incentroX, t.incentroY);
  ponto(pG.x, pG.y, "#d93025");
  ponto(pI.x, pI.y, "#1e8e3e");
  ctx.fillStyle = "#1a252f";
  ctx.font = "9px system-ui, sans-serif";
  ctx.fillText("A", pA.x - 8, pA.y - 6);
  ctx.fillText("B", pB.x + 8, pB.y - 6);
  ctx.fillText("C", pC.x - 6, pC.y + 12);
  ctx.fillText("G", pG.x + 7, pG.y + 3);
  ctx.fillText("I", pI.x + 7, pI.y + 3);
}

document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("angA").addEventListener("input", atualizarEsboco);
  document.getElementById("angB").addEventListener("input", atualizarEsboco);
  document.getElementById("angC").addEventListener("input", atualizarEsboco);
  document.querySelectorAll('input[name="entrada"]').forEach(function(r) {
    r.addEventListener("change", trocarEntrada);
  });
});
