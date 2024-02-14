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
    const randomBeer = JSON.parse(
      randomBeerBtn.getAttribute("data-random-beer")
    );

    const url = `beer-details.html?name=${randomBeer.name}`;
    window.location.href = url;

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    const nameBeer = urlParams.get("name");
  });

async function fetchBeerDetails(beerName) {
  try {
    const response = await fetch(
      `https://api.punkapi.com/v2/beers?beer_name=${beerName}&description=true&volume=true&abv=true&ingredients=true&food_pairing=true&brewers_tips=true`
    );

    const data = await response.json();
    // Предполагая, что API вернуло массив объектов, и выбираем первый объект (первый напиток с таким именем)
    const beerDetails = data[0];
    return beerDetails;
  } catch (error) {
    console.error("Ошибка при получении информации о напитке:", error);
  }
}

function displayBeerDetails(beerDetails) {
  if (!beerDetails) {
    console.error("No information about the drink");
    return;
  }

  const card = document.createElement("div");
  card.classList.add("beer-card");

  if (beerDetails.image_url) {
    beerImage.src = beerDetails.image_url;
  } else {
    console.error("No URL for the drink image");
  }

  const beerInfo = document.createElement("div");
  beerInfo.classList.add("beer-info");

  beerName.textContent = beerDetails.name;

  const description = document.createElement("p");
  description.textContent = `Description: ${beerDetails.description}`;

  const volume = document.createElement("p");
  volume.textContent = `Volume: ${
    beerDetails.volume ? beerDetails.volume.value : "N/A"
  } ${beerDetails.volume ? beerDetails.volume.unit : "N/A"}`;

  const abv = document.createElement("p");
  abv.textContent = `ABV: ${beerDetails.abv ? beerDetails.abv : "N/A"}`;

  const ingredients = document.createElement("p");
  ingredients.textContent = `Ingredients: ${getIngredients(
    beerDetails.ingredients
  )}`;

  const foodPairing = document.createElement("p");
  foodPairing.textContent = `Food Pairing: ${
    beerDetails.food_pairing ? beerDetails.food_pairing : "N/A"
  }`;

  const brewersTips = document.createElement("p");
  brewersTips.textContent = `Brewers Tips: ${
    beerDetails.brewers_tips ? beerDetails.brewers_tips : "N/A"
  }`;

  beerInfo.appendChild(beerName);
  beerInfo.appendChild(description);
  beerInfo.appendChild(abv);
  beerInfo.appendChild(volume);
  beerInfo.appendChild(ingredients);
  beerInfo.appendChild(foodPairing);
  beerInfo.appendChild(brewersTips);

  card.appendChild(img);
  card.appendChild(beerInfo);

  // Clear previous beer card
  const wrapper = document.querySelector(".wrapper");
  wrapper.innerHTML = "";
  wrapper.appendChild(card);
}

fetchBeerDetails(beerName).then((beerDetails) => {
  displayBeerDetails(beerDetails);
});

// Function to get a string representation of ingredients
function getIngredients(ingredients) {
  let ingredientArray = [];

  if (ingredients.malt) {
    ingredientArray.push("Malt:\n");
    ingredients.malt.forEach((malt) => {
      ingredientArray.push(
        `  ${malt.name}: ${malt.amount.value} ${malt.amount.unit}`
      );
    });
  }

  if (ingredients.hops) {
    ingredientArray.push("\nHops:\n");
    ingredients.hops.forEach((hop) => {
      ingredientArray.push(
        `  ${hop.name}: ${hop.amount.value} ${hop.amount.unit} (${hop.add} - ${hop.attribute})`
      );
    });
  }

  if (ingredients.yeast) {
    ingredientArray.push("\nYeast:\n"); // Add a new line after the category label
    ingredientArray.push(`${ingredients.yeast}`);
  }

  return ingredientArray.join("\n");
}
