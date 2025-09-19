// Paciente JS

// Transforma em JSON e retorna os dados que eu salvei no login (nome, tipo, especialidade).
const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

// Bloqueio de acesso
if (!usuarioLogado || usuarioLogado.tipo !== "paciente") {
  alert("Acesso negado! Faça login novamente.");
  window.location.href = "Login.html";
}

// Mostrar o nome do usuário
document.getElementById("nomeUsuario").innerText = usuarioLogado?.nome;

// LogOut
function logout() {
  localStorage.removeItem("usuarioLogado");
  window.location.href = "Login.html";
}

// Carregar consultas disponíveis
function carregarConsultas() {

  // pega os dados do localstorage, transforma em JSON e faz a verificação
  let consultas = JSON.parse(localStorage.getItem("consultas")) || [];

  // seleciona onde os cards vão ser exibidos
  const lista = document.querySelector("#consultasCards");
  
  // limpa tudo antes de mostrar os cards, para eles não ficarem duplicados
  lista.innerHTML = "";

  // Filtrar apenas consultas sem paciente
  const consultasDisponiveis = consultas.filter((c) => !c.paciente);

  // Se o médico não tiver cadastrado nenhuma consulta, não vai aparecer nada
  if (consultasDisponiveis.length === 0) {
    lista.innerHTML = '<p class="nenhuma-consulta">Nenhuma consulta disponível no momento.</p>';
    return;
  }

  // Cria o card com todas as informações como nome do médico, data da consulta e etc
  consultasDisponiveis.forEach((c) => {
    const card = document.createElement("div");
    card.className = "card-consulta";
    card.innerHTML = `
      <h4>${c.especialidade}</h4>
      <p><strong>Médico:</strong> ${c.medico}</p>
      <p><strong>Data:</strong> ${c.data}</p>
      <p><strong>Hora:</strong> ${c.hora}</p>
      <button>Agendar</button>
    `;

    // Coloca o evento ao clicar o botão (tipo o onclick)
    card.querySelector("button").addEventListener("click", () => {
      const confirmar = confirm(
        `Deseja agendar uma consulta ${c.especialidade} com ${c.medico} em ${c.data} às ${c.hora}?`
      );
      // se o paciente clicar em cancelar, a consulta é cancelada 
      if (!confirmar) return;

      // Atualiza o campo paciente na lista de consultas
      let todasConsultas = JSON.parse(localStorage.getItem("consultas")) || [];
      const indexConsulta = todasConsultas.findIndex(
        (cons) =>
          cons.medico === c.medico &&
          cons.data === c.data &&
          cons.hora === c.hora &&
          !cons.paciente
      );

      // Marca a consulta do paciente e atualiza ela no localstorage
      if (indexConsulta !== -1) {
        todasConsultas[indexConsulta].paciente = usuarioLogado.nome;
        localStorage.setItem("consultas", JSON.stringify(todasConsultas));
      }

      // Salva no histórico do paciente, transformando em JSON (objeto) e String
      let agendamentos =
        JSON.parse(localStorage.getItem("agendamentos_" + usuarioLogado.email)) || []; // Verificação
      agendamentos.push(c);
      localStorage.setItem(
        "agendamentos_" + usuarioLogado.email,
        JSON.stringify(agendamentos)
      );

      // Envia e-mail de confirmação
      emailjs
        .send("service_b8s5nhn", "template_fap4dqr", {
          to_email: usuarioLogado.email,
          paciente: usuarioLogado.nome,
          medico: c.medico,
          especialidade: c.especialidade,
          data: c.data,
          hora: c.hora,
        })
        .then(
          function (response) {
            alert("Consulta agendada e e-mail enviado com sucesso!");
          },
          function (error) {
            alert(
              "Consulta agendada, mas houve erro ao enviar o e-mail: " +
                JSON.stringify(error)
            );
          }
        );
        // Fim do EmailJS

      // Atualiza as listas
      carregarConsultas();
      carregarHistorico();
    });
    
    // Adiciona a lista no body da página
    lista.appendChild(card);
  });
}

// Carregar histórico de agendamentos
function carregarHistorico() {
  const historico =
    JSON.parse(localStorage.getItem("agendamentos_" + usuarioLogado.email)) || [];
  const listaHistorico = document.querySelector("#cardsHistorico");

  // Limpa os cards antes de adicionar outros cards
  listaHistorico.innerHTML = "";

  // Se não há agendamentos para agendar, esse texto irá aparecer
  if (historico.length === 0) {
    listaHistorico.innerHTML = '<p class="nenhum-agendamento">Você ainda não tem agendamentos.</p>';
    return;
  }

  // Informações dos Cards como nome do Médico, data e hora e o botão de cancelar
  historico.forEach((c, index) => {
    const card = document.createElement("div");
    card.className = "card-historico";
    card.innerHTML = `
      <h4>${c.especialidade}</h4>
      <p><strong>Médico:</strong> ${c.medico}</p>
      <p><strong>Data:</strong> ${c.data}</p>
      <p><strong>Hora:</strong> ${c.hora}</p>
      <button class="cancelar">Cancelar</button>
    `;

    // Evento de clicar no botão (tipo o onclick)
    card.querySelector(".cancelar").addEventListener("click", () => {
      const confirmar = confirm(
        `Deseja cancelar o agendamento da consulta ${c.especialidade} com ${c.medico}?`
      );
      // se o paciente escolher não cancelar a consulta, o código retorna e o horário não é cancelado
      if (!confirmar) return;

      // Remove do histórico do paciente e atualiza o localstorage
      historico.splice(index, 1);
      localStorage.setItem(
        "agendamentos_" + usuarioLogado.email,
        JSON.stringify(historico)
      );

      // Atualiza a consulta no array geral, removendo o paciente para liberar o horário
      let todasConsultas = JSON.parse(localStorage.getItem("consultas")) || [];
      const indexConsulta = todasConsultas.findIndex(
        (cons) =>
          cons.medico === c.medico &&
          cons.data === c.data &&
          cons.hora === c.hora
      );
      if (indexConsulta !== -1) {
        todasConsultas[indexConsulta].paciente = null;
        localStorage.setItem("consultas", JSON.stringify(todasConsultas));
      }

      // Envia e-mail de cancelamento
      emailjs
        .send("service_wumrdbh", "template_s1jz1qc", {
          to_email: usuarioLogado.email,
          paciente: usuarioLogado.nome,
          medico: c.medico,
          especialidade: c.especialidade,
          data: c.data,
          hora: c.hora,
        })
        .then(
          function (response) {
            alert("Agendamento cancelado e e-mail enviado com sucesso!");
          },
          function (error) {
            alert(
              "Agendamento cancelado, mas houve erro ao enviar o e-mail: " +
                JSON.stringify(error)
            );
          }
        );

      carregarConsultas();
      carregarHistorico();
    });

    // Adiciona no body da página
    listaHistorico.appendChild(card);
  });
}

// Inicializa
document.addEventListener("DOMContentLoaded", () => {
  carregarConsultas();
  carregarHistorico();
});
