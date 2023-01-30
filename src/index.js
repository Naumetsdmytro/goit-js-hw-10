import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;
const inputEl = document.querySelector('#search-box');
const listEl = document.querySelector('.country-list');
const contEl = document.querySelector('.country-info');
inputEl.addEventListener('input', debounce(onInputChange, DEBOUNCE_DELAY));

function onInputChange(evt) {
  const inputValue = evt.target.value.trim();
  if (inputValue === '') {
    clearCountryInfo();
    clearCountryList();
    return;
  }
  fetchCountries(inputValue)
    .then(data => {
      if (data.status === 404) {
        throw new Error(data.status);
      }
      if (data.length > 10) {
        // clearCountryList();
        return Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      }
      if (data.length >= 2 && fetch.length <= 10) {
        clearCountryInfo();
        clearCountryList();
        listEl.insertAdjacentHTML('beforeend', createCountryList(data));
      }
      if (data.length === 1) {
        clearCountryList();
        clearCountryInfo();
        contEl.insertAdjacentHTML('beforeend', createCountryCard(data));
      }
      console.log(data);
    })
    .catch(
      () => Notiflix.Notify.failure('Oops, there is no country with that name'),
      clearCountryList(),
      clearCountryInfo()
    );
}

const createCountryList = counrtiesList => {
  const countriesRow = counrtiesList
    .map(({ name, flags }) => {
      return `<li class="country-list-item">
    <img src="${flags.png}"alt="${name.common}"width="40"height="40"/>
    <p class="list-country-text">${name.common}</p>
    </li>`;
    })
    .join(' ');
  return countriesRow;
};

const createCountryCard = data => {
  return data.map(({ name, capital, languages, population, flags }) => {
    const countryLang = Object.values(languages).join(', ');
    return `
    <img src="${flags.png}"alt="${name.common}"width="45"height="45"/>
    <h3 class="country-title">${name.common}</h3>
    <p class="country-text"><span class="country-text-title">Country capital:</span>${capital}</p>
    <p class="country-text"><span class="country-text-title">Population:</span>${population}</p>
    <p class="country-text"><span class="country-text-title">Languages:</span>${countryLang}</p>`;
  });
};

function clearCountryList() {
  listEl.innerHTML = '';
}
function clearCountryInfo() {
  contEl.innerHTML = '';
}
