
const defaultBaseUrl = 'http://localhost:3000'
class WorldService {
  constructor(baseUrl) {
    this.baseUrl = baseUrl || defaultBaseUrl;
  }  

  /**
   * Retrieves all of the available countries.
   * @returns The countries.
   */
  async getAllCountries() {
    const url = `${ this.baseUrl }/countries`;
    console.log(`Requesting ${ url }...`);
    const response = await fetch(url);
    return response.json();
  }

  async deleteCountry(country) {
    const url = `${ this.baseUrl }/countries/${ country }`;
    console.log(`Requesting DELETE ${ url }...`);
    const response = await fetch(url, { 
      method: 'DELETE'
    });
    return response.json();
  }

  async deleteCity(city) {
    const url = `${ this.baseUrl }/cities/${ city }`;
    console.log(`Requesting DELETE ${ url }...`);
    const response = await fetch(url, { 
      method: 'DELETE'
    });
    return response.json();
  }  

  /**
   * Gets all cities for the specified country.
   * @param {String} country The country code.
   */
  async getCitiesForCountry(country) {
    const url = `${ this.baseUrl }/countries/${ country }/cities`;
    console.log(`Requesting ${ url }...`);
    const response = await fetch(url);
    return response.json();
  }
}

function createHTMLElement(html) {
  const template = document.createElement('template')  ;
  template.innerHTML = html;
  return template.content.firstElementChild;
}
const service = new WorldService();

class CountrySelect {
  constructor(el) {
    this.el = el;
    this.el.addEventListener('change', (e) => this.onChange(e));
    this.load();
  }  

  onChange(e) {
    const country = this.el.value;
    if (country) {
      this.el.dispatchEvent(new CustomEvent('country-change', { detail: { country: country } }));  
    }
  }

  async load() {
    const countries = await service.getAllCountries();
    this.render(countries);
  }

  render(countries) {
    countries.forEach((country) => {
      const option = createHTMLElement(`<option value="${ country.country_code }">${ country.country_name }</option>`);
      this.el.append(option);
    });
  }
}

//const countries = await service.getAllCountries();
//console.log(countries);

const citiesTable = document.querySelector('#cities tbody');
citiesTable.addEventListener('click', async (e) => {
  if (e.target.classList.contains('js-city-delete')) {
    const row = e.target.closest('tr');
    const city = row.dataset.city;
    if (city) {
      const response = await service.deleteCity(city);
      if (response.code === 200) {
        row.remove();  
      }
    }
  }
});
const countrySelect = new CountrySelect(document.querySelector('#countries')); // .getElementById('countries');
countrySelect.el.addEventListener('country-change', async (e) => {
  const country = e.detail.country;
  if (country) {
    citiesTable.parentElement.classList.remove('d-none');
    const cities = await service.getCitiesForCountry(country);
    while(citiesTable.firstChild) {
      citiesTable.removeChild(citiesTable.firstChild);
    }

    cities.forEach((city) => {
      const row = createHTMLElement(`
        <tr data-city=${ city.city_id }>
          <td>${ city.city_name }</td>
          <td>${ city.latitude }</td>
          <td>${ city.longitude }</td>
          <td>${ city.city_population }</td>
          <td><i class="js-city-delete bi bi-trash"></i></td>
        </tr>
      `);
      citiesTable.append(row);
    });
    
  }
});

