const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const randomBeerBtn = document.getElementById("random-beer-btn");
const beerName = document.querySelector(".beer-name");
const beerImage = document.querySelector(".beer-card img");
const searchResults = document.getElementById("search-results");
const paginationButtons = document.getElementById("pagination-buttons");
const mainErrorMessage = document.getElementById("main-error-message");
const errorMessage = document.getElementById("error-message");

document.addEventListener("DOMContentLoaded", async () => {
  // Function to handle form submission
  searchForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const searchTerm = searchInput.value.trim();
    if (!isValidSearchTerm(searchTerm)) {
      mainErrorMessage.textContent = "Please enter a valid search term.";
      return; // Прекращаем выполнение функции, если введенный термин поиска невалиден
    }
    try {
      if (searchTerm !== "") {
        const beers = await searchBeer(searchTerm);
        displaySearchResults(beers);
      }
    } catch (error) {
      console.error("Error searching for beers:", error);
      // Дополнительная обработка ошибок, если это необходимо
    }
  });
  await getRandomAndDisplayBeer();
  randomBeerBtn.addEventListener("click", async () => {
    await getRandomAndDisplayBeer();
  });
  // Function to handle click event for random beer button
  async function getRandomAndDisplayBeer() {
    const randomBeer = await getRandomBeer();
    displayBeer(randomBeer);

    // Store the random beer data in a data attribute
    randomBeerBtn.setAttribute("data-random-beer", JSON.stringify(randomBeer));
  }
});
// Function to validate the search term
function isValidSearchTerm(searchTerm) {
  // Use a regular expression to check for special characters
  const regex = /^[a-zA-Z0-9\s]+$/;
  return regex.test(searchTerm);
}

// Function to search for beers using the Punk API
async function searchBeer(query) {
  const response = await fetch(
    `https://api.punkapi.com/v2/beers?beer_name=${query}`
  );
  const data = await response.json();
  return data;
}

// Display search results with pagination
function displaySearchResults(beers) {
  const itemsPerPage = 10;
  let currentPage = 1;

  function paginateResults() {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedBeers = beers.slice(startIndex, endIndex);

    searchResults.innerHTML = ""; // Clear previous search results
    paginatedBeers.forEach((beer) => {
      const beerItem = document.createElement("li");
      beerItem.textContent = beer.name;
      beerItem.classList.add("beer-item");
      beerItem.addEventListener("click", () => {
        navigateToBeerInfoPage(beer.name);
      });
      searchResults.appendChild(beerItem);
    });

    updatePaginationButtons();
  }

  function updatePaginationButtons() {
    const totalPages = Math.ceil(beers.length / itemsPerPage);
    paginationButtons.innerHTML = "";

    for (let i = 1; i <= totalPages; i++) {
      const pageBtn = document.createElement("button");
      pageBtn.textContent = i;
      pageBtn.classList.add("pagination-btn");
      if (i === currentPage) {
        pageBtn.disabled = true;
        pageBtn.classList.add("active");
      }
      pageBtn.addEventListener("click", () => {
        currentPage = i;
        paginateResults();
      });
      paginationButtons.appendChild(pageBtn);
    }
  }

  paginateResults();
}

function navigateToBeerInfoPage(beerName) {
  const url = `beer-details.html?name=${encodeURIComponent(beerName)}`;
  window.location.href = url;
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
  // Check if there is an image URL
  if (beer.image_url) {
    beerImage.src = beer.image_url;
    beerImage.alt = "Beer Image";
    beerImage.style.display = "block"; // Show the image element
    // errorMessage.textContent = ""; // Clear any previous error message
  } else {
    beerImage.style.display = "none"; // Hide the image element
    errorMessage.textContent = "Error: No image available"; // Display error message
  }
}
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
    const beerDetails = data[0];
    return beerDetails;
  } catch (error) {
    errorMessage.textContent =
      "Error fetching drink information. Please try again later.";
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

  // Check if there is an image URL
  if (beerDetails.image_url) {
    // If there is an image URL, create an image element and set its source
    const beerImage = document.createElement("img");
    beerImage.src = beerDetails.image_url;
    beerImage.classList.add("beer-image");
    card.appendChild(beerImage);
  } else {
    // If there is no image URL, display a message
    const noImageMessage = document.createElement("p");
    noImageMessage.textContent = "No image available for this drink";
    card.appendChild(noImageMessage);
    console.error("No URL for the drink image");
  }

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

// ?beer_name=Hello My Name Is Lieke
//Russian Doll – India Pale Ale
const currentYear = new Date().getFullYear();
document.getElementById("current-year").textContent = currentYear;
