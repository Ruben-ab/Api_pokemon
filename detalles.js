// Seleccionamos elementos del DOM
const pokemonContainer = document.querySelector(".pokemon-container");
const buttons = document.querySelectorAll(".button-container button");
const pagination = document.querySelectorAll(".pagination");
const heading = document.querySelector("#heading");

// Definimos las generaciones de Pokémon con su rango de IDs
const generations = [
  ["Kanto", 1, 151],
  ["Johto", 152, 251],
  ["Hoenn", 252, 386],
  ["Sinnoh", 387, 483],
  ["Unova", 494, 649]
];

// Variable para realizar un seguimiento de la generación actual
let currentGen = 0;
// Variable para controlar la primera carga de la página
let firstTime = true;

// Colores asociados a los tipos de Pokémon
const colors = {
  grass: "#d2f2c2",
  poison: "#f7cdf7",
  fire: "#ffd1b5",
  flying: "#eae3ff",
  water: "#c2f3ff",
  bug: "#e0e8a2",
  normal: "#e6e6c3",
  electric: "#fff1ba",
  ground: "#e0ccb1",
  fighting: "#fcada9",
  psychic: "#ffc9da",
  rock: "#f0e09c",
  fairy: "#ffdee5",
  steel: "#e6eaf0",
  ice: "#e8feff",
  ghost: "#dbbaff",
  dragon: "#c4bdff",
  dark: "#a9abb0"
};

// Creamos un contenedor para la barra de búsqueda
const searchBoxContainer = document.createElement("div");
searchBoxContainer.setAttribute("class", "search-box-container");
searchBoxContainer.innerHTML = `
  <input type="text" class="search-box" placeholder="Search"></input>
  <i class="fas fa-search"></i>
`;

// Función asincrónica para obtener información detallada de los Pokémon usando Axios
async function axiosGetDetailedPokemonInfo(pokemonID) {
  try {
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonID}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching detailed Pokemon info:", error);
    return null;
  }
}

// Función asincrónica para obtener información de los Pokémon usando Axios
async function axiosGetPokemons(pokemonStartID, pokemonEndID) {
  // Agregamos un loader mientras se cargan los Pokémon
  pokemonContainer.innerHTML = `<span class="loader"></span>`;

  // Deshabilitamos los botones durante la carga
  buttons.forEach((el) => {
    el.classList.add("restrict-click");
  });

  // Realizamos peticiones Axios para obtener la información de los Pokémon
  const axiosResponses = await Promise.all(
    Array.from({ length: pokemonEndID - pokemonStartID + 1 }, async (_, index) => {
      const pokemonID = pokemonStartID + index;
      const basicInfoResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonID}`);
      const detailedInfoResponse = await axiosGetDetailedPokemonInfo(pokemonID);

      return {
        basicInfo: basicInfoResponse.data,
        detailedInfo: detailedInfoResponse
      };
    })
  );

  // Limpiamos el contenedor después de cargar los Pokémon
  pokemonContainer.innerHTML = "";

  // Si es la primera carga, agregamos el contenedor de búsqueda al cuerpo del documento
  if (firstTime) {
    document.body.insertBefore(searchBoxContainer, pokemonContainer);
    firstTime = false;
  }

  // Iteramos sobre las respuestas de Axios y construimos las tarjetas de los Pokémon
  axiosResponses.forEach(({ basicInfo, detailedInfo }) => {
    const pokemonName = basicInfo.name;
    const pokemonTypes = basicInfo.types.map((item) => item.type.name);
    const imageURL = basicInfo.sprites.other["official-artwork"].front_default;

    pokemonContainer.innerHTML += `
      <div class="pc-container" data-pokemon-id="${basicInfo.id}">
        <div class="pokemon-card">
          <div class="card_front">
            <img src=${imageURL}></img>
            <div class="circle"></div>
            <h5 class="poke-id"> #${basicInfo.id} </h5>
            <h5 class="poke-name"> ${pokemonName.replace(/\w/, (ch) =>
              ch.toUpperCase()
            )} </h5>
            <h5> ${pokemonTypes
              .join(" / ")
              .replace(/\b\w/g, (ch) => ch.toUpperCase())} 
            </h5>
          </div>
          <div class="card_back">
            <div class="poke-stats-name">HP: ${detailedInfo.stats[0].base_stat}</div>
            <div class="poke-stats-bar"
              style="background: linear-gradient(to right, ${
                colors[pokemonTypes[0]]
              } ${detailedInfo.stats[0].base_stat}%, ${
      colors[pokemonTypes[0]]
    }71 ${detailedInfo.stats[0].base_stat}%"
            >
            </div>
            <div class="poke-stats-name">Attack: ${detailedInfo.stats[1].base_stat}</div>
            <div class="poke-stats-bar"
              style="background: linear-gradient(to right, ${
                colors[pokemonTypes[0]]
              } ${detailedInfo.stats[1].base_stat}%, ${
      colors[pokemonTypes[0]]
    }71 ${detailedInfo.stats[1].base_stat}%"
            >
            </div>
            <div class="poke-stats-name">Defense: ${detailedInfo.stats[2].base_stat}</div>
            <div class="poke-stats-bar"
              style="background: linear-gradient(to right, ${
                colors[pokemonTypes[0]]
              } ${detailedInfo.stats[2].base_stat}%, ${
      colors[pokemonTypes[0]]
    }71 ${detailedInfo.stats[2].base_stat}%"
            >
            </div>
            <div class="poke-stats-name">Special-Attack: ${detailedInfo.stats[3].base_stat}</div>
            <div class="poke-stats-bar"
              style="background: linear-gradient(to right, ${
                colors[pokemonTypes[0]]
              } ${detailedInfo.stats[3].base_stat}%, ${
      colors[pokemonTypes[0]]
    }71 ${detailedInfo.stats[3].base_stat}%"
            >
            </div>
            <div class="poke-stats-name">Special-Defense: ${detailedInfo.stats[4].base_stat}</div>
            <div class="poke-stats-bar"
              style="background: linear-gradient(to right, ${
                colors[pokemonTypes[0]]
              } ${detailedInfo.stats[4].base_stat}%, ${
      colors[pokemonTypes[0]]
    }71 ${detailedInfo.stats[4].base_stat}%"
            >
            </div>
            <div class="poke-stats-name">Speed: ${detailedInfo.stats[5].base_stat}</div>
            <div class="poke-stats-bar"
              style="background: linear-gradient(to right, ${
                colors[pokemonTypes[0]]
              } ${detailedInfo.stats[5].base_stat}%, ${
      colors[pokemonTypes[0]]
    }71 ${detailedInfo.stats[5].base_stat}%"
            >
            </div>
          </div>
        </div>
      </div>
    `;
  });

  // Habilitamos los botones después de cargar los Pokémon
  setTimeout(() => {
    buttons.forEach((el) => {
      el.classList.remove("restrict-click");
    });
  }, 500);

  // Configuramos el listener para la barra de búsqueda
  instantiateListener();
  // Configuramos el listener para las tarjetas Pokémon
  instantiatePokemonCardListeners();
}

// Función para configurar el listener de la barra de búsqueda
function instantiateListener() {
  const pokemons = document.querySelectorAll(".pokemon-card .poke-name");
  const searchBox = document.querySelector(".search-box");

  searchBox.addEventListener("keyup", (e) => {
    const inp = searchBox.value.toLowerCase();

    // Filtramos los Pokémon según el texto de búsqueda
    pokemons.forEach((pokemon) => {
      const name = pokemon.textContent.toLowerCase();
      if (name.indexOf(inp) !== -1) {
        pokemon.parentElement.parentElement.parentElement.style.display = "flex";
      } else {
        pokemon.parentElement.parentElement.parentElement.style.display = "none";
      }
    });
  });
}

// Función para configurar el listener de las tarjetas Pokémon
function instantiatePokemonCardListeners() {
  const pokemonCards = document.querySelectorAll(".pc-container");
  pokemonCards.forEach((card) => {
    card.addEventListener("click", () => {
      const pokemonId = card.dataset.pokemonId;
      showPokemonDetails(pokemonId);
    });
  });
}

// Función para mostrar los detalles del Pokémon al hacer clic
function showPokemonDetails(pokemonId) {
    // Construimos la URL de la página de detalles
    const detailsPageURL = `pokemon-details.html?id=${pokemonId}`;
  
    // Abrimos la nueva página en una nueva ventana o pestaña
    window.open(detailsPageURL, "_blank");
  }

// Función para mostrar los detalles del Pokémon al hacer clic
function showPokemonDetails(pokemonId) {
  const detailsContainer = document.querySelector(".pokemon-details-container");
  const closeButton = document.getElementById("close-btn");
  const detailsContent = document.getElementById("pokemon-details-content");

  // Llamada a la API para obtener información detallada del Pokémon
  axiosGetDetailedPokemonInfo(pokemonId).then((detailedInfo) => {
    if (detailedInfo) {
      // Construir el contenido de los detalles
      const htmlContent = `
        <h2>${detailedInfo.name}</h2>
        <img src="${detailedInfo.sprites.other['official-artwork'].front_default}" alt="${detailedInfo.name}">
        <p>Height: ${detailedInfo.height}</p>
        <p>Weight: ${detailedInfo.weight}</p>
        <p>Abilities: ${detailedInfo.abilities.map((ability) => ability.ability.name).join(', ')}</p>
        <!-- Agrega más detalles según tus necesidades -->
      `;

      // Mostrar los detalles y configurar el botón de cierre
      detailsContent.innerHTML = htmlContent;
      detailsContainer.style.display = "flex";

      closeButton.addEventListener("click", () => {
        detailsContainer.style.display = "none";
      });
    }
  });
}

// Configuramos listeners para los botones de paginación
buttons.forEach((el) => {
  el.addEventListener("click", (e) => {
    const searchBox = document.querySelector(".search-box");
    if (searchBox) {
      searchBox.value = "";
    }
    if (e.target.id === "right-btn" && !e.target.classList.contains("restrict-click")) {
      // Cambiamos a la siguiente generación al hacer clic en el botón derecho
      pagination[currentGen].classList.remove("current-page");
      currentGen = (currentGen + 1) % generations.length;
      pagination[currentGen].classList.add("current-page");
      heading.innerText = generations[currentGen][0] + " Pokédex";
      axiosGetPokemons(generations[currentGen][1], generations[currentGen][2]);
    } else if (e.target.id === "left-btn" && !e.target.classList.contains("restrict-click")) {
      // Cambiamos a la generación anterior al hacer clic en el botón izquierdo
      pagination[currentGen].classList.remove("current-page");
      currentGen = (currentGen - 1 + generations.length) % generations.length;
      pagination[currentGen].classList.add("current-page");
      heading.innerText = generations[currentGen][0] + " Pokédex";
      axiosGetPokemons(generations[currentGen][1], generations[currentGen][2]);
    }
  });
});

// Configuramos listeners para los botones de paginación
pagination.forEach((el) => {
  el.addEventListener("click", (e) => {
    const searchBox = document.querySelector(".search-box");
    if (searchBox) {
      searchBox.value = "";
    }
    if (!buttons[0].classList.contains("restrict-click")) {
      // Cambiamos a la generación seleccionada en la paginación
      pagination[currentGen].classList.remove("current-page");
      currentGen = el.textContent - 1;
      pagination[currentGen].classList.add("current-page");
      heading.innerText = generations[currentGen][0] + " Pokédex";
      axiosGetPokemons(generations[currentGen][1], generations[currentGen][2]);
    }
  });
});

// Inicializamos la carga de Pokémon para la primera generación
axiosGetPokemons(generations[0][1], generations[0][2]);
