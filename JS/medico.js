// Médico JS

// Transforma em JSON e retorna os dados que eu salvei no login (nome, tipo, especialidade).
const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

// Bloqueia o Acesso
if (!usuarioLogado || usuarioLogado.tipo !== "medico") {
  alert("Acesso negado! Faça login novamente.");
  window.location.href = "Login.html";
}

// Mostrar nome e especialidade (a ? evita erro caso usuarioLogado seja null ou undefined)
document.getElementById("nomeUsuario").innerText = usuarioLogado?.nome;
document.getElementById("nomeEspecialidade").innerText =
  " de " + usuarioLogado?.especialidade;

// Logout
function logout() {
  localStorage.removeItem("usuarioLogado");
  window.location.href = "Login.html";
}

// Função para mostrar notificação 
function mostrarNotificacao(mensagem) {
  const notificacao = document.createElement("div");
  notificacao.className = "notificacao-toast"; // Cria uma Classe no CSS
  notificacao.innerText = mensagem;
  document.body.appendChild(notificacao); // Adiciona a notificação no body da página

  setTimeout(() => {
    notificacao.remove();
  }, 6000);
}

// Função para cadastrar horário
function agendar() {
  const data = document.getElementById("data").value; // consts para criar a consulta
  const horario = document.getElementById("horario").value;

  // Vê se o médico preencheu os campos
  if (!data || !horario || horario === "Selecione seu Horário") {
    alert("Insira uma data e um horário válidos!");
    return;
  }

  // Ajuda a impedir de selecionar um horario que já passou no dia de "hoje"
  const agora = new Date(); // Pega a data de "agora" do notebook
  const dataSelecionada = new Date(data + "T" + horario); // Serve para comparar

  // Impedir escolha de datas/horários passados
  if (dataSelecionada < agora) {
    alert("Você não pode cadastrar horários que já passaram!");
    return;
  }
  
  // Verificação
  let consultas = JSON.parse(localStorage.getItem("consultas")) || [];

  // Verificar se já existe consulta nesse dia e hora para este médico
  const existe = consultas.some(
    (checar) =>
      checar.medico.trim().toLowerCase() === usuarioLogado.nome.trim().toLowerCase() &&
      checar.data === data &&
      checar.hora === horario // Se tentar botar o mesmo horário, vai dar erro
  );
 
  // Aviso se colocar um horário já cadastrado
  if (existe) {
    alert("Você já cadastrou um horário neste dia e horário!");
    return;
  }

  // Objeto com as informações que estarão nos cards
  const consulta = {
    medico: usuarioLogado.nome.trim(),
    especialidade: usuarioLogado.especialidade,
    data,
    hora: horario,
    paciente: null
  };

  // Adiciona a nova consulta ao array de consultas e transforma o objeto em string
  consultas.push(consulta);
  localStorage.setItem("consultas", JSON.stringify(consultas));

 // Alert de sucesso no cadastro de horário
  alert("Horário cadastrado com sucesso!");
  carregarAgendamentos();
}

// Cards de Agendamento do Médico
function carregarAgendamentos() {
  const lista = document.querySelector("#agendamentosCards"); // Pega o container onde os cards de consulta serão exibidos.

  // Se o elemento não existir, essa função evitaria erros
  if (!lista) return; 

  // Limpa as consultas antigas, então se outro cadastro de médico for criado, não vai ter as consultas antigas
  lista.innerHTML = "";

  // Verificação,transformar em JSON e pegar informações do localstorage
  let consultas = JSON.parse(localStorage.getItem("consultas")) || [];

  // Filtra apenas consultas do médico logado que ainda não tenham paciente, o filter cria um novo array apenas com os elementos que atendem à condição.
  const consultasMedico = consultas.filter(
    (c) =>
      c.medico.trim().toLowerCase() === usuarioLogado.nome.trim().toLowerCase() &&
      !c.paciente
  );

  // Notificar cada consulta agendada, uma atrás da outra
  let notificacaoIndex = 0;
  consultas.forEach((c) => {
    if (
      c.medico.trim().toLowerCase() === usuarioLogado.nome.trim().toLowerCase() &&
      c.paciente &&
      !c.notificado // impede de mostrar a mesma notificação várias vezes
    ) {
      setTimeout(() => {
        mostrarNotificacao(`Consulta agendada com ${c.paciente} em ${c.data} às ${c.hora}`);
      }, notificacaoIndex * 5000); // intervalo de 5 segundinhos
      c.notificado = true; // marca como notificado
      notificacaoIndex++;
    }
  });

  // Atualiza o localstorage com as informações adicionadas
  localStorage.setItem("consultas", JSON.stringify(consultas));

  // Se o médico não tiver cadastrado nenhum horário, esse texto vai aparecer
  if (consultasMedico.length === 0) {
    lista.innerHTML = "<p class='esp2'>Você ainda não cadastrou nenhum horário disponível.</p>";
    return;
  }

  // Informações do Card, como especialidade, data, hora e etc
  consultasMedico.forEach((c) => {
    const card = document.createElement("div");
    card.className = "card-agendamento";
    card.innerHTML = `
      <p><strong>Especialidade:</strong> ${c.especialidade}</p>
      <p><strong>Data:</strong> ${c.data}</p>
      <p><strong>Hora:</strong> ${c.hora}</p>
      <p><strong>Paciente:</strong> Nenhum paciente ainda</p>
      <button class="cancelar">Cancelar</button>
    `;
    // Incorpora esse card no body
    lista.appendChild(card);

    // Cancela a Consulta que o Médico Cadastrou
    card.querySelector(".cancelar").addEventListener("click", () => {
      const confirmar = confirm(
        `Deseja cancelar a consulta de ${c.especialidade} em ${c.data} às ${c.hora}?`
      );
      // se o médico não cancelar, o código retorna basicamente
      if (!confirmar) return;
      
      // Remove do Array Consultas e usa o Filter para cancelar apenas o selecionado e não todos
      consultas = consultas.filter(
        (cons) =>
          !(
            cons.medico === c.medico &&
            cons.data === c.data &&
            cons.hora === c.hora
          )
      );

      // Atualiza o localstorage depois do cancelamento e mostra o alert
      localStorage.setItem("consultas", JSON.stringify(consultas));
      alert("Consulta cancelada com sucesso!");

      carregarAgendamentos();
    });
  });
}

// Inicializa as áreas
document.addEventListener("DOMContentLoaded", () => {
  carregarAgendamentos();
});
