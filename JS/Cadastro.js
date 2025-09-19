// Pegar o Ano em que Estamos
document.getElementById('year').textContent = new Date().getFullYear();

// Revelar a Caixa de Especialidade Escondida
  function mostrarEspecialidade(mostrar) {
  const box = document.getElementById("boxEspecialidade");
  box.style.display = mostrar ? "block" : "none";

}

// Salvar as Informações no Local Storage
function salvar(event) {
  event.preventDefault();

// Criando Variaveis para serem Salvas no Local Storage
  const nome = document.getElementById("nome").value.trim(); // O Trim remove espaços em Branco
  const email = document.getElementById("email").value.toLowerCase().trim();
  const senha = document.getElementById("senha").value.trim();
  const tipo = document.querySelector("input[name='tipo']:checked").value;
  let especialidade = document.getElementById("especialidade").value;

// Objeto que Carrega Todos as Variáveis (Posteriormente será transformada em String)
  const usuario = { nome, email, senha, tipo, especialidade};

  // Caso a Opção Médico Seja Selecionada, a Option de Especialidades irá Aparecer
  if (tipo === "medico") {
  especialidade = document.getElementById("especialidade").value;
  if (!especialidade) {
    alert("Selecione a especialidade!");
    return;
  }
}

// Caso o Usuário Coloque um Email que já foi Salvo
  if (localStorage.getItem(email)) {
    alert("Este email já está cadastrado!");
    return;
  }
  

   // Confirmação Antes de Salvar
  const confirmar = confirm("Você tem certeza que seus dados estão corretos?");
  if (!confirmar) {
    return; 
  }
  
  // Mensagem de Cadastro Realizado e Redirecionamento para a Área de Login
  localStorage.setItem(email, JSON.stringify(usuario));
  alert("Cadastro realizado com sucesso!");

  window.location.href = "Login.html"; 
}

// Função do olhinho aberto e fechado
function olho() {
    const caixadetexto = document.getElementById('senha'); // id da imagem
    const imgdoolho = document.getElementById('imgdoolho'); //id da imagem tbm

    if (caixadetexto.type === 'password') {
        caixadetexto.type = 'text';
        imgdoolho.src = '../Imagens/olhoaberto-removebg-preview.png'; // imagem do olho aberto
    } else {
        caixadetexto.type = 'password';
        imgdoolho.src = '../Imagens/olho-removebg-preview.png'; // imagem do olho fechado
    }
  }




