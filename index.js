document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const randomBeerBtn = document.getElementById('random-beer-btn');
    const beerName = document.querySelector('.beer-name');
    const beerImage = document.querySelector('.beer-card img');

    // Function to handle form submission
    searchForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const searchTerm = searchInput.value.trim();
        if (searchTerm !== '') {
            // Perform beer search using the searchTerm
            const beers = await searchBeer(searchTerm);
            // Display search results (list of beer names)
            displaySearchResults(beers);
        }
    });

    // Function to handle click event for random beer button
    randomBeerBtn.addEventListener('click', async () => {
        // Get a random beer
        const randomBeer = await getRandomBeer();
        displayBeer(randomBeer);
    });

    // Function to search for beers using the Punk API
    async function searchBeer(query) {
        const response = await fetch(`https://api.punkapi.com/v2/beers?beer_name=${query}`);
        const data = await response.json();
        return data;
    }

    // Function to display search results
    function displaySearchResults(beers) {
        // Clear previous search results
        beerName.textContent = '';
        beerImage.src = '';
        // Display each beer name in the search results
        beers.forEach((beer) => {
            const beerItem = document.createElement('div');
            beerItem.textContent = beer.name;
            // Append beer item to the main section
            document.querySelector('main').appendChild(beerItem);
        });
    }

    // Function to get a random beer from the Punk API
    async function getRandomBeer() {
        const response = await fetch('https://api.punkapi.com/v2/beers/random');
        const [randomBeer] = await response.json();
        return randomBeer;
    }

    // Function to display a beer
    function displayBeer(beer) {
        beerName.textContent = beer.name;
        beerImage.src = beer.image_url;
    }
});
