const apiUrl = 'https://restcountries.com/v2/all';
const paisInput = document.getElementById('pais-input');
const buscarPaisButton = document.getElementById('buscar-pais-button');
const paisesList = document.getElementById('paisesList');
const favoritosList = document.getElementById('favoritosList');
const totalPaises = document.getElementById('totalPaises');
const totalPopulacao = document.getElementById('totalPopulacao');
const totalPaisesFavoritos = document.getElementById('totalPaisesFavoritos');
const totalPopulacaoFavoritos = document.getElementById('totalPopulacaoFavoritos');
const voltarPaisesButton = document.getElementById('voltar-lista-paises-button');

let todosOsPaises = [];
let paisesFavoritos = [];

// inglês para português
const traducaoPaises = {
    'Brazil': 'Brasil',

};

// obter o nome traduzido do país
function getNomeTraduzido(pais) {
    return traducaoPaises[pais.nome] || pais.nome;
}

// Atualiza a população e a quantidade de países aba de favoritos
function atualizarPopulacaoEQuantidadeFavoritos() {
    totalPopulacaoFavoritos.textContent = paisesFavoritos.reduce((total, pais) => total + pais.populacao, 0);
    totalPaisesFavoritos.textContent = paisesFavoritos.length;
}

// Atualiza a população e a quantidade de países aba de países
function atualizarPopulacaoEQuantidadePaises() {
    const totalPopulacaoPaises = todosOsPaises.reduce((total, pais) => total + pais.populacao, 0);
    const quantidadePaises = todosOsPaises.length;
    totalPaises.textContent = quantidadePaises;
    totalPopulacao.textContent = totalPopulacaoPaises;
}

// Add um país aos favoritos
function adicionarAosFavoritos(pais) {
    const indice = todosOsPaises.findIndex(p => p.nome === pais.nome);
    if (indice !== -1) {
        todosOsPaises.splice(indice, 1);
        atualizarListaPaises(); // Atualiza a lista de países
        paisesFavoritos.push(pais);
        atualizarListaFavoritos();
        atualizarPopulacaoEQuantidadeFavoritos(); // Atualiza a população e quantidade na aba de favoritos
        atualizarPopulacaoEQuantidadePaises(); // Atualiza a população e quantidade na aba de países
    }
}

// Remove um país dos favoritos
function removerDosFavoritos(pais) {
    const indice = paisesFavoritos.findIndex(p => p.nome === pais.nome);
    if (indice !== -1) {
        paisesFavoritos.splice(indice, 1);
        atualizarListaFavoritos();
        todosOsPaises.push(pais);
        atualizarListaPaises();
        atualizarPopulacaoEQuantidadeFavoritos(); // Atualiza a população e quantidade na aba de favoritos
        atualizarPopulacaoEQuantidadePaises(); // Atualiza a população e quantidade na aba de países
    }
}

// Event listener para o botão "Buscar"
buscarPaisButton.addEventListener('click', () => {
    const nomePais = paisInput.value;

    // Encontre o país nos dados
    const pais = todosOsPaises.find(pais => pais.nome.toLowerCase() === nomePais.toLowerCase());

    if (pais) {
        // Limpe a lista anterior
        paisesList.innerHTML = '';

        // Crie um novo item de lista com informações do país
        const li = document.createElement('li');
        const nomeTraduzido = getNomeTraduzido(pais);
        li.innerHTML = `<strong>${nomeTraduzido}</strong> <img src="${pais.bandeira}" width="20"> População: ${pais.populacao}`;
        const botaoAdicionar = document.createElement('button');
        botaoAdicionar.textContent = 'Favorito';
        botaoAdicionar.addEventListener('click', () => adicionarAosFavoritos(pais));
        li.appendChild(botaoAdicionar);
        paisesList.appendChild(li);
    } else {
        // Se o país não for encontrado, exiba uma mensagem de erro
        paisesList.innerHTML = 'País não encontrado';
    }
});

// Event listener para o botão "Voltar"
voltarPaisesButton.addEventListener('click', () => {
    // Limpe a entrada de texto
    paisInput.value = '';

    // Exiba a lista completa de países novamente
    paisesList.innerHTML = '';
    atualizarListaPaises();
});

// buscar dados dos países na API
async function buscarPaises() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        todosOsPaises = data.map(pais => ({
            nome: pais.name,
            bandeira: pais.flags.png,
            populacao: pais.population,
        }));

        atualizarListaPaises();
    } catch (erro) {
        console.error('Erro ao buscar países:', erro);
    }
}

// atualizar a lista de países
function atualizarListaPaises() {
    todosOsPaises.sort((a, b) => a.nome.localeCompare(b.nome));
    paisesList.innerHTML = '';
    todosOsPaises.forEach(pais => {
        const li = document.createElement('li');
        const nomeTraduzido = getNomeTraduzido(pais);
        li.innerHTML = `<strong>${nomeTraduzido}</strong> <img src="${pais.bandeira}" width="20"> População: ${pais.populacao}`;
        const botaoAdicionar = document.createElement('button');
        botaoAdicionar.textContent = 'Favorito';
        botaoAdicionar.addEventListener('click', () => adicionarAosFavoritos(pais));
        li.appendChild(botaoAdicionar);
        paisesList.appendChild(li);
    });

    atualizarPopulacaoEQuantidadePaises(); // Atualiza a população e quantidade na aba de países
}

// atualizar a lista de favoritos
function atualizarListaFavoritos() {
    paisesFavoritos.sort((a, b) => a.nome.localeCompare(b.nome));
    favoritosList.innerHTML = '';
    paisesFavoritos.forEach(pais => {
        const li = document.createElement('li');
        const nomeTraduzido = getNomeTraduzido(pais);
        li.innerHTML = `<strong>${nomeTraduzido}</strong> <img src="${pais.bandeira}" width="20"> População: ${pais.populacao}`;
        const botaoRemover = document.createElement('button');
        botaoRemover.textContent = 'Remover';
        botaoRemover.addEventListener('click', () => removerDosFavoritos(pais));
        li.appendChild(botaoRemover);
        favoritosList.appendChild(li);
    });

    atualizarPopulacaoEQuantidadeFavoritos(); // Atualiza a população e quantidade na aba de favoritos
}

// Inicializa a aplicação buscando os países
buscarPaises();
