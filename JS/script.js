const apiUrl = 'https://restcountries.com/v2/all';
const paisInput = document.getElementById('pais-input');
const filtroContinente = document.getElementById('filtro-continente');
const filtroMenorPopulacao = document.getElementById('filtro-menor-populacao');
const filtroMaiorPopulacao = document.getElementById('filtro-maior-populacao');
const paisesList = document.getElementById('paisesList');
const favoritosList = document.getElementById('favoritosList');
const totalPaises = document.getElementById('totalPaises');
const totalPopulacao = document.getElementById('totalPopulacao');
const totalPaisesFavoritos = document.getElementById('totalPaisesFavoritos');
const totalPopulacaoFavoritos = document.getElementById('totalPopulacaoFavoritos');
const voltarPaisesButton = document.getElementById('voltar-lista-paises-button');

let todosOsPaises = [];
let paisesFavoritos = [];
//-----------------------------------------------------------------//
// inglês para português
const traducaoPaises = {
    'Brazil': 'Brasil',
};

// retornar nome traduzido do país
function getNomeTraduzido(pais) {
    return traducaoPaises[pais.nome] || pais.nome;
}
//-------------------------------------------------------------------//

// atualiza a população e quantidade de países na aba de favoritos
function atualizarPopulacaoEQuantidadeFavoritos() {
    totalPopulacaoFavoritos.textContent = paisesFavoritos.reduce((total, pais) => total + pais.populacao, 0);
    totalPaisesFavoritos.textContent = paisesFavoritos.length;
}
//-------------------------------------------------------------------//
// atualiza a população e quantidade de países na aba de países
function atualizarPopulacaoEQuantidadePaises() {
    const totalPopulacaoPaises = todosOsPaises.reduce((total, pais) => total + pais.populacao, 0);
    const quantidadePaises = todosOsPaises.length;
    totalPaises.textContent = quantidadePaises;
    totalPopulacao.textContent = totalPopulacaoPaises;
}
//-------------------------------------------------------------------//
// adiciona um país aos favoritos
function adicionarAosFavoritos(pais) {
    const indice = todosOsPaises.findIndex(p => p.nome === pais.nome);
    if (indice !== -1) {
        todosOsPaises.splice(indice, 1);
        atualizarListaPaises();
        paisesFavoritos.push(pais);
        atualizarListaFavoritos();
        atualizarPopulacaoEQuantidadeFavoritos();
        atualizarPopulacaoEQuantidadePaises();
    }
}
//-------------------------------------------------------------------//
// remove um país dos favoritos
function removerDosFavoritos(pais) {
    const indice = paisesFavoritos.findIndex(p => p.nome === pais.nome);
    if (indice !== -1) {
        paisesFavoritos.splice(indice, 1);
        atualizarListaFavoritos();
        todosOsPaises.push(pais);
        atualizarListaPaises();
        atualizarPopulacaoEQuantidadeFavoritos();
        atualizarPopulacaoEQuantidadePaises();
    }
}
//-------------------------------------------------------------------//
// filtra os países com base no continente selecionado
function filtrarPorContinente(continente) {
    if (continente === 'Todos') {
        atualizarListaPaises(); // Selecione "Todos", exiba todos os países
    } else {
        const paisesFiltrados = todosOsPaises.filter(pais => pais.continente === continente);
        atualizarListaPaises(paisesFiltrados);
    }
}
//-------------------------------------------------------------------//
// filtra os países por menor população
function ordenarPorMenorPopulacao() {
    const paisesOrdenados = [...todosOsPaises];
    paisesOrdenados.sort((a, b) => a.populacao - b.populacao);
    atualizarListaPaises(paisesOrdenados);
}

// filtra os países por maior população
function ordenarPorMaiorPopulacao() {
    const paisesOrdenados = [...todosOsPaises];
    paisesOrdenados.sort((a, b) => b.populacao - a.populacao);
    atualizarListaPaises(paisesOrdenados);
}
//-------------------------------------------------------------------//
// Event listener para o botão "Buscar"
document.getElementById('buscar-pais-button').addEventListener('click', () => {
    const nomePais = paisInput.value;

    const pais = todosOsPaises.find(pais => pais.nome.toLowerCase() === nomePais.toLowerCase());

    if (pais) {
        paisesList.innerHTML = '';

        const li = document.createElement('li');
        const nomeTraduzido = getNomeTraduzido(pais);
        li.innerHTML = `<strong>${nomeTraduzido}</strong> <img src="${pais.bandeira}" width="20"> População: ${pais.populacao}`;
        const botaoAdicionar = document.createElement('button');
        botaoAdicionar.textContent = 'Favorito';
        botaoAdicionar.addEventListener('click', () => adicionarAosFavoritos(pais));
        li.appendChild(botaoAdicionar);
        paisesList.appendChild(li);
    } else {
        paisesList.innerHTML = 'País não encontrado';
    }
});
//-------------------------------------------------------------------//
// Event listener para o botão "Voltar"
voltarPaisesButton.addEventListener('click', () => {
    paisInput.value = '';
    paisesList.innerHTML = '';
    atualizarListaPaises();
});

filtroContinente.addEventListener('change', () => {
    const selectedContinente = filtroContinente.value;
    filtrarPorContinente(selectedContinente);
});

filtroMenorPopulacao.addEventListener('click', () => {
    ordenarPorMenorPopulacao();
});

filtroMaiorPopulacao.addEventListener('click', () => {
    ordenarPorMaiorPopulacao();
});

async function buscarPaises() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        todosOsPaises = data.map(pais => ({
            nome: pais.name,
            bandeira: pais.flags.png,
            populacao: pais.population,
            continente: pais.region,
        }));

        atualizarListaPaises();
    } catch (erro) {
        console.error('Erro ao buscar países:', erro);
    }
}
//-------------------------------------------------------------------//
function atualizarListaPaises(paises = todosOsPaises) {
    paisesList.innerHTML = '';
    paises.forEach(pais => {
        const li = document.createElement('li');
        const nomeTraduzido = getNomeTraduzido(pais);
        li.innerHTML = `<strong>${nomeTraduzido}</strong> <img src="${pais.bandeira}" width="20"> População: ${pais.populacao}`;
        const botaoAdicionar = document.createElement('button');
        botaoAdicionar.textContent = 'Favorito';
        botaoAdicionar.addEventListener('click', () => adicionarAosFavoritos(pais));
        li.appendChild(botaoAdicionar);
        paisesList.appendChild(li);
    });

    atualizarPopulacaoEQuantidadePaises();
}
//-------------------------------------------------------------------//
function atualizarListaFavoritos() {
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

    atualizarPopulacaoEQuantidadeFavoritos();
}
//-------------------------------------------------------------------//
buscarPaises();