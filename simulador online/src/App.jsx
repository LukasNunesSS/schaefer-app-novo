import React, { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function App() {
  const [comprimento, setComprimento] = useState(0);
  const [largura, setLargura] = useState(0);
  const [modelo, setModelo] = useState("classica");
  const [cliente, setCliente] = useState("");
  const [vendedor, setVendedor] = useState("");

  const calcularValor = () => {
    if (modelo === "classica") {
      const precoCm2 = 466;
      return comprimento * largura * precoCm2;
    }
    if (modelo === "cascata") {
      let precoMetro = 0;
      if (largura <= 100) precoMetro = 7820000;
      else if (largura <= 110) precoMetro = 8602000;
      else if (largura <= 120) precoMetro = 9384000;
      return precoMetro * (comprimento / 100);
    }
    if (modelo === "resina") {
      const precoResina = 5460000;
      const precoMadeiraPorCm = 46600;
      const larguraMadeira = (largura - 30) / 2;
      const custoMadeira = larguraMadeira * precoMadeiraPorCm * 2;
      const totalPorMetro = custoMadeira + precoResina;
      return totalPorMetro * (comprimento / 100);
    }
    return 0;
  };

  const gerarPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Orçamento de Mesa RS Schaefer", 20, 20);

    autoTable(doc, {
      startY: 30,
      head: [["Campo", "Valor"]],
      body: [
        ["Cliente", cliente],
        ["Vendedor", vendedor],
        ["Modelo", modelo.toUpperCase()],
        ["Comprimento (cm)", comprimento + " cm"],
        ["Largura (cm)", largura + " cm"],
        ["Valor Total", calcularValor().toLocaleString("pt-BR") + " Gs"],
        ["Data/Hora", new Date().toLocaleString("pt-BR")],
      ],
    });

    doc.save("orcamento_mesa_rs_schaefer.pdf");
  };

  return (
    <div style={{ maxWidth: 500, margin: "auto", padding: 20 }}>
      <h2>Simulador de Mesa RS Schaefer</h2>

      <label>Nome do Cliente</label>
      <input value={cliente} onChange={(e) => setCliente(e.target.value)} />

      <label>Nome do Vendedor</label>
      <input value={vendedor} onChange={(e) => setVendedor(e.target.value)} />

      <label>Modelo da Mesa</label>
      <select value={modelo} onChange={(e) => setModelo(e.target.value)}>
        <option value="classica">Clássica</option>
        <option value="cascata">Cascata</option>
        <option value="resina">Com Resina</option>
      </select>

      <label>Comprimento (cm)</label>
      <input type="number" value={comprimento} onChange={(e) => setComprimento(Number(e.target.value))} />

      <label>Largura (cm)</label>
      <input type="number" value={largura} onChange={(e) => setLargura(Number(e.target.value))} />

      <h3>Valor Total: {calcularValor().toLocaleString("pt-BR")} Gs</h3>

      <button onClick={gerarPDF}>Gerar PDF do Orçamento</button>
    </div>
  );
}