const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const randomBeerBtn = document.getElementById("random-beer-btn");
const beerName = document.querySelector(".beer-name");
const beerImage = document.querySelector(".beer-card img");

document.addEventListener("DOMContentLoaded", () => {
  // Function to handle form submission
  searchForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const searchTerm = searchInput.value.trim();
    if (searchTerm !== "") {
      // Perform beer search using the searchTerm
      const beers = await searchBeer(searchTerm);
      // Display search results (list of beer names)
      displaySearchResults(beers);
    }
  });

  // Function to handle click event for random beer button
  randomBeerBtn.addEventListener("click", async () => {
    // Get a random beer
    const randomBeer = await getRandomBeer();
    displayBeer(randomBeer);
    // Store the random beer data in a data attribute
    randomBeerBtn.setAttribute("data-random-beer", JSON.stringify(randomBeer));
  });

  // Function to search for beers using the Punk API
  async function searchBeer(query) {
    const response = await fetch(
      `https://api.punkapi.com/v2/beers?beer_name=${query}`
    );
    const data = await response.json();
    return data;
  }

  // Function to display search results
  function displaySearchResults(beers) {
    // Clear previous search results
    beerName.textContent = "";
    beerImage.src = "";
    // Display each beer name in the search results
    beers.forEach((beer) => {
      const beerItem = document.createElement("div");
      beerItem.textContent = beer.name;
      // Append beer item to the main section
      document.querySelector("main").appendChild(beerItem);
    });
  }

  // Function to get a random beer from the Punk API
  async function getRandomBeer() {
    const response = await fetch("https://api.punkapi.com/v2/beers/random");
    const [randomBeer] = await response.json();
    return randomBeer;
  }

  // Function to display a beer
  function displayBeer(beer) {
    beerName.textContent = beer.name;
    beerImage.src = beer.image_url;
  }
});

// Add event listener to the "See More" button
document
  .getElementById("more-info-beer-btn")
  .addEventListener("click", function () {
    // Get the random beer data stored in the button's data attribute
    const randomBeer = JSON.parse(
      document
        .getElementById("random-beer-btn")
        .getAttribute("data-random-beer")
    );

    // Create elements to display beer data
    const card = document.createElement("div");
    card.classList.add("beer-card");

    const img = document.createElement("img");
    img.src = randomBeer.image_url;
    img.alt = randomBeer.name;

    const beerInfo = document.createElement("div");
    beerInfo.classList.add("beer-info");

    // const nameHeader = document.createElement("h2");
    // nameHeader.textContent = `Name: ${randomBeer.name}`;

    beerName.textContent = randomBeer.name;

    const description = document.createElement("p");
    description.textContent = `Description: ${randomBeer.description}`;

    const volume = document.createElement("p");
    volume.textContent = `Volume: ${
      randomBeer.volume ? randomBeer.volume.value : "N/A"
    } ${randomBeer.volume ? randomBeer.volume.unit : "N/A"}`;

    const ingredients = document.createElement("p");
    ingredients.textContent = `Ingredients: ${
      Array.isArray(randomBeer.ingredients)
        ? getIngredients(randomBeer.ingredients)
        : "N/A"
    }`;

    const hops = document.createElement("p");
    hops.textContent = `Hops: ${
      Array.isArray(randomBeer.ingredients)
        ? getHops(randomBeer.ingredients)
        : "N/A"
    }`;

    const foodPairing = document.createElement("p");
    foodPairing.textContent = `Food Pairing: ${
      randomBeer.food_pairing ? randomBeer.food_pairing : "N/A"
    }`;

    const brewersTips = document.createElement("p");
    brewersTips.textContent = `Brewers Tips: ${
      randomBeer.brewers_tips ? randomBeer.brewers_tips : "N/A"
    }`;

    beerInfo.appendChild(beerName);
    beerInfo.appendChild(description);
    beerInfo.appendChild(volume);
    beerInfo.appendChild(ingredients);
    beerInfo.appendChild(hops);
    beerInfo.appendChild(foodPairing);
    beerInfo.appendChild(brewersTips);

    card.appendChild(img);
    card.appendChild(beerInfo);

    // Clear previous beer card
    const wrapper = document.querySelector(".wrapper");
    wrapper.innerHTML = "";
    wrapper.appendChild(card);
  });

// Function to get a string representation of ingredients
function getIngredients(ingredients) {
  return ingredients.map((ingredient) => ingredient.name).join(", ");
}

// Function to get a string representation of hops
function getHops(ingredients) {
  const hops = ingredients
    .filter((ingredient) => ingredient.category === "hops")
    .map((hop) => hop.name);
  return hops.length > 0 ? hops.join(", ") : "N/A";
}
