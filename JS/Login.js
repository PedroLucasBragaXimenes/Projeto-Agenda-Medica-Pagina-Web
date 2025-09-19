// Pegar o Ano em que Estamos
document.getElementById('year').textContent = new Date().getFullYear();

// Pegar os Dados do LocalStorage
  function login(event) {
  event.preventDefault();

  const email = document.getElementById("email").value.toLowerCase().trim();
  const senha = document.getElementById("senha").value.trim();

  const usuario = JSON.parse(localStorage.getItem(email));

// Mensagem de "Login Realizado com Sucesso" e Mensagem de Erro "Email ou Senha Inválidos"
  if (usuario && usuario.senha === senha) {
    alert("Login realizado com sucesso!");
    localStorage.setItem("usuarioLogado", JSON.stringify(usuario));

    if (usuario.tipo === "paciente") {
      window.location.href = "paciente.html";
    }
     else if (usuario.tipo === "medico") {
      window.location.href = "medico.html";
    }
  } else {
    alert("Email ou senha inválidos!");
  }
}

// Função do olhinho aberto e fechado
function olho() {
    const caixadetexto = document.getElementById('senha');
    const imgdoolho = document.getElementById('imgdoolho');

    if (caixadetexto.type === 'password') {
        caixadetexto.type = 'text';
        imgdoolho.src = '../Imagens/olhoaberto-removebg-preview.png'; // imagem do olho aberto
    } else {
        caixadetexto.type = 'password';
        imgdoolho.src = '../Imagens/olho-removebg-preview.png'; // imagem do olho fechado
    }
  }

       
       
       