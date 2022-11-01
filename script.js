'use strict';

const mainDiv = document.getElementById('main-div');
const toggleDarkModeBtn = document.getElementById('toggle-dark-mode');
const searchInput = document.getElementById('search-input');
const searchArea = document.getElementById('input-area');
const filterInput = document.getElementById('filter-input');

const clearMainDiv = function () {
    mainDiv.innerHTML = "";
    searchInput.value = "";
}

const renderAllCountries = async function () {
    clearMainDiv();
    try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        const data = await response.json();
        data.forEach(country => {
            const markup = createCountryMarkup(country);
            mainDiv.insertAdjacentHTML('beforeend', markup);
        })
    }
    catch (err) {
        console.log("coś nie tak");
    }
}

const renderAllCountriesFromRegion = async function (region) {
    clearMainDiv();
    try {
        const response = await fetch(`https://restcountries.com/v3.1/region/${region}`);
        const data = await response.json();
        data.forEach(country => {
            const markup = createCountryMarkup(country);
            mainDiv.insertAdjacentHTML('beforeend', markup);
        });
    }
    catch (error) {
        console.log(error);
    }
}

const renderOneCountry = async function (country) {
    clearMainDiv();
    try {
        const response = await fetch(`https://restcountries.com/v2/name/${country}`);
        const data = await response.json();
        console.log(...data);
        const markup = createCountryMarkup(...data);
        mainDiv.insertAdjacentHTML('afterbegin', markup);
    }
    catch (error) {
        console.log(error);
    }
}

const createCountryMarkup = function (data) {
    const markup = `
        <div class="card">
            <div class="card-top-part">
                <img src="${data.flags.png}" alt="${data.name.common} flag">
            </div>
            <div class="card-bottom-part">
                <h2 class="card-title">${data.name.common ? data.name.common : data.name}</h2>
                <p>Population: <em class="population">${data.population}</em></p>
                <p>Region: <em class="region">${data.region}</em></p>
                <p>Capital: <em class="capital">${data.capital}</em></p>
            </div>
        </div>
    `;
    return markup;
}

const switchOnDarkMode = function () {
    document.body.classList.add('dark-mode');
    toggleDarkModeBtn.innerHTML = `<i class="fa-regular fa-sun"></i>Light Mode`;
    localStorage.setItem('DarkMode', "on");
}

const switchOfDarkMode = function () {
    document.body.classList.remove('dark-mode');
    toggleDarkModeBtn.innerHTML = `<i class="fa-regular fa-moon"></i>Dark Mode`;
    localStorage.setItem('DarkMode', "off");
}

const init = function () {
    let darkMode = localStorage.getItem('DarkMode');
    if (darkMode === "on") {
        switchOnDarkMode();
    }
    renderAllCountries();
}

// Event Listeners
searchInput.addEventListener('search', function (e) {
    e.preventDefault();
    const country = searchInput.value.toLowerCase();
    renderOneCountry(country);
})

filterInput.addEventListener('change', function () {
    const regionChoice = filterInput.value;
    console.log(regionChoice);
    if (regionChoice === 'all') {
        renderAllCountries();
    }
    else {
        renderAllCountriesFromRegion(regionChoice);
    }
});

searchArea.addEventListener('click', function () {
    searchInput.focus();
})

toggleDarkModeBtn.addEventListener('click', () => {
    let darkMode = localStorage.getItem('DarkMode');

    if (darkMode === "off") {
        switchOnDarkMode();
    }
    else {
        switchOfDarkMode();
    }
});

init();