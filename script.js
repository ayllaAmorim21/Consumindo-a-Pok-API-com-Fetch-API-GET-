const formBusca = document.getElementById("form-busca");
const inputPokemon = document.getElementById("input-pokemon");
const mensagemStatus = document.getElementById("mensagem-status");
const cardPokemon = document.getElementById("card-pokemon");

const pokeId = document.getElementById("poke-id");
const pokeNome = document.getElementById("poke-nome");
const pokeHp = document.getElementById("poke-hp");
const pokeImg = document.getElementById("poke-img");
const pokeClasse = document.getElementById("poke-classe");
const pokeTipo = document.getElementById("poke-tipo");
const pokeAtaque = document.getElementById("poke-ataque");
const barraAtaque = document.getElementById("barra-ataque");
const pokeDefesa = document.getElementById("poke-defesa");
const barraDefesa = document.getElementById("barra-defesa");
const pokeMedidas = document.getElementById("poke-medidas");

async function buscarClassePokemon(urlEspecie, habilidadesFallback) {
    try {
        const resp = await fetch(urlEspecie);
        if (!resp.ok) throw new Error();
        const dadosEspecie = await resp.json();

        // Busca a classificação da carta (ex: "Mouse Pokémon" / "Seed Pokémon")
        const genero =
            dadosEspecie.genera.find((g) => g.language.name === "pt") ||
            dadosEspecie.genera.find((g) => g.language.name === "es") ||
            dadosEspecie.genera.find((g) => g.language.name === "en");

        if (genero) return genero.genus;
    } catch {
        // Se falhar, usa a habilidade principal como alternativa
    }

    return habilidadesFallback[0]?.ability?.name || "Padrão";
}

async function buscarPokemon(nomeOuId) {
    const termo = nomeOuId.toLowerCase().trim();

    if (!termo) {
        mensagemStatus.textContent = "Digite o nome ou número de um Pokémon.";
        cardPokemon.classList.add("oculto");
        return;
    }

    const url = `https://pokeapi.co/api/v2/pokemon/${termo}`;

    mensagemStatus.textContent = "Buscando carta Pokémon...";
    cardPokemon.classList.add("oculto");

    try {
        const resposta = await fetch(url);

        if (!resposta.ok) {
            throw new Error("Pokémon não encontrado!");
        }

        const dados = await resposta.json();

        // Tipo principal define a cor da carta
        const tipoPrincipal = dados.types[0].type.name;
        cardPokemon.dataset.tipo = tipoPrincipal;

        // Dados básicos
        pokeId.textContent = `#${String(dados.id).padStart(3, "0")}`;
        pokeNome.textContent = dados.name;
        pokeImg.src =
            dados.sprites?.other?.["official-artwork"]?.front_default ||
            dados.sprites?.front_default ||
            "";
        pokeImg.alt = `Imagem do ${dados.name}`;

        // Tipos
        const tipos = dados.types.map((item) => item.type.name).join(" / ");
        pokeTipo.textContent = tipos;

        // Status: HP, Poder (Ataque) e Defesa
        const hp = dados.stats.find((s) => s.stat.name === "hp")?.base_stat || 0;
        const ataque = dados.stats.find((s) => s.stat.name === "attack")?.base_stat || 0;
        const defesa = dados.stats.find((s) => s.stat.name === "defense")?.base_stat || 0;

        pokeHp.textContent = hp;
        pokeAtaque.textContent = ataque;
        pokeDefesa.textContent = defesa;

        // Calcula largura proporcional das barras (base 160 como referência visual)
        barraAtaque.style.width = `${Math.min((ataque / 160) * 100, 100)}%`;
        barraDefesa.style.width = `${Math.min((defesa / 160) * 100, 100)}%`;

        // Classe (espécie da carta)
        const classeTexto = await buscarClassePokemon(dados.species.url, dados.abilities);
        pokeClasse.textContent = `Classe: ${classeTexto}`;

        // Altura e peso no rodapé
        const alturaMetros = (dados.height / 10).toFixed(1);
        const pesoKg = (dados.weight / 10).toFixed(1);
        pokeMedidas.textContent = `Alt: ${alturaMetros}m | Peso: ${pesoKg}kg`;

        mensagemStatus.textContent = "";
        cardPokemon.classList.remove("oculto");
    } catch (erro) {
        mensagemStatus.textContent = erro.message;
    }
}

formBusca.addEventListener("submit", (event) => {
    event.preventDefault();
    buscarPokemon(inputPokemon.value);
});