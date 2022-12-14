'use strict';

const mainDiv = document.getElementById('main-div');
const toggleDarkModeBtn = document.getElementById('toggle-dark-mode');
const searchInput = document.getElementById('search-input');
const searchArea = document.getElementById('input-area');
const filterInput = document.getElementById('filter-input');
const modalOverflow = document.querySelector('.modal-overflow');
const modal = document.querySelector('.modal');
const closeModalBtn = document.querySelector('#close-modal-btn');


const formatNumber = function (number) {
    return String(number).replace(/(.)(?=(\d{3})+$)/g, '$1,');
}

const clearMainDiv = function () {
    mainDiv.innerHTML = "";
    searchInput.value = "";
}

const renderError = function (message) {
    clearMainDiv();
    const errorMarkup = `
        <div class="error">
            <div class="error-header">Error</div>
            ${message}
        </div>
    `;
    mainDiv.insertAdjacentHTML('afterbegin', errorMarkup);
}

const addEventListenersToCards = function () {
    const allCards = document.querySelectorAll('.card');
    allCards.forEach(card => {
        card.addEventListener('click', function (e) {
            let element = e.target.closest('.card');
            handleModal(element.dataset.name);
        });
    })
}

const getData = async function (link) {
    const response = await fetch(link);
    if (!response.ok) {
        throw new Error("There is a problem with fetching data.");
    }
    const data = await response.json();
    return data;
}

const renderAllCountries = async function () {
    clearMainDiv();
    try {
        const data = await getData('https://restcountries.com/v3.1/all');
        data.forEach(country => {
            const markup = createCountryMarkup(country);
            mainDiv.insertAdjacentHTML('beforeend', markup);
        });
        addEventListenersToCards();
    }
    catch (error) {
        let message = error.message;
        if (error.message === "Failed to fetch")
            message = "You are offline. Connetct with Internet and try again.";
        else
            message = "Ups... There is a problem. Try again later.";
        renderError(message);
    }
}

const renderAllCountriesFromRegion = async function (region) {
    clearMainDiv();
    try {
        const data = await getData(`https://restcountries.com/v3.1/region/${region}`);
        data.forEach(country => {
            const markup = createCountryMarkup(country);
            mainDiv.insertAdjacentHTML('beforeend', markup);
        });
        addEventListenersToCards();
    }
    catch (error) {
        let message = error.message;
        if (error.message === "Failed to fetch")
            message = "You are offline. Connetct with Internet and try again.";
        else
            message = "Ups... There is a problem. Try again later.";
        renderError(message);
    }
}

const renderOneCountry = async function (country) {
    clearMainDiv();
    try {
        const data = await getData(`https://restcountries.com/v2/name/${country}`);
        const markup = createCountryMarkup(...data);
        mainDiv.insertAdjacentHTML('afterbegin', markup);
        addEventListenersToCards();
    }
    catch (error) {
        let message = error.message;
        if (error.message === "Failed to fetch")
            message = "You are offline. Connetct with Internet and try again.";
        else
            message = "Ups... Country not found.";
        renderError(message);
    }
}

const createCountryMarkup = function (data) {
    const markup = `
        <div class="card" data-name="${data.altSpellings[0]}">
            <div class="card-top-part">
                <img src="${data.flags.png}" alt="${data.name.common} flag">
            </div>
            <div class="card-bottom-part">
                <h2 class="card-title">${data.name.common ? data.name.common : data.name}</h2>
                <p>Population: <em class="population">${formatNumber(data.population)}</em></p>
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

const createModalMarkup = function (data) {
    let markup = `
        <div div class="modal-left-side" >
            <img src="${data.flags.png}" alt="${data.name.common} flag" class="modal-photo">
        </div>
        <div class="modal-right-side">
            <div class="modal-country-name" id="modal-country-name">
                ${data.name}
            </div>
            <div class="modal-info">
                <p>Native Name: <em class="modal-data">${data.nativeName}</em></p>
                <p>Population: <em class="modal-data">${formatNumber(data.population)}</em></p>
                <p>Region: <em class="modal-data">${data.region}</em></p>
                <p>Sub Region: <em class="modal-data">${data.subregion}</em></p>
                <p>Capital: <em class="modal-data">${data.capital}</em></p>
                <p>Top Level Domain: <em class="modal-data">${data.topLevelDomain}</em></p>
                <p>Currencies: <em class="modal-data">${data.currencies[0].name}</em></p>
                <p>Languages: <em class="modal-data">${data.languages[0].name}</em></p>
            </div>
            <div class="modal-border-countries">
                <p>Border Countries: </p>
                ${generateBorderCountryMarkup(data.borders)}
            </div>
        </div>
    `;
    return markup;
}

const generateBorderCountryMarkup = function (countries) {
    if (!countries) {
        return `<p>No border countries</p>`;
    }
    let markup = "";
    countries.forEach(country => {
        markup += `<button class="border-country" data-name="${country}">${country}</button>`;
    });
    return markup;
}

const addEventListenersToBorderCountriesBtn = function () {
    let borderCounriesBtn = document.querySelectorAll('.border-country');
    borderCounriesBtn.forEach(country => {
        country.addEventListener('click', function () {
            clearModal();
            handleModal(country.dataset.name);
        })
    })
}

const handleModal = async function (country) {
    try {
        const data = await getData(`https://restcountries.com/v2/alpha?codes=${country}`);
        const markup = createModalMarkup(...data);
        modal.insertAdjacentHTML('beforeend', markup);
        modalOverflow.classList.remove('hidden');

        addEventListenersToBorderCountriesBtn();
    }
    catch {
        renderError("There is a problem. Try again later.")
    }
}

const clearModal = function () {
    let rightSide = modal.querySelector('.modal-right-side');
    let leftSide = modal.querySelector('.modal-left-side');
    modal.removeChild(rightSide);
    modal.removeChild(leftSide);
}

const closeModal = function () {
    modalOverflow.classList.add('hidden');
}

const init = function () {
    let darkMode = localStorage.getItem('DarkMode');
    if (darkMode === "on") {
        switchOnDarkMode();
    }
    renderAllCountries();
}

// Event Listeners  /////////////////////////////////////////////////////////////////////////////////////////////////////////////
searchInput.addEventListener('search', function (e) {
    e.preventDefault();
    const country = searchInput.value.toLowerCase();
    renderOneCountry(country);
})

filterInput.addEventListener('change', function () {
    const regionChoice = filterInput.value;
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

closeModalBtn.addEventListener('click', function () {
    clearModal();
    closeModal();
});

window.addEventListener('click', function (e) {
    if (e.target == modalOverflow) {
        clearModal();
        closeModal();
    }
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

init();