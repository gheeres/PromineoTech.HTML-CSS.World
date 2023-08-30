const $countrySelect = $('#countries');
const $citiesTable = $('#cities');
const $addCityButton = $('.control-add-city');
const $saveCityModalButton = $('#add-city .action-save');
const $formCityName = $('#city-name');
const $formCityLatitude = $('#city-latitude');
const $formCityLongitude = $('#city-longitude'); 
const $formCityPopulation = $('#city-population'); 

export default class App {
  constructor(service) {
    this.service = service;
  }

  intitialize() {
    this.service.getCountries().then(countries => {
      countries.forEach((country) => {
        $countrySelect.append(`<option value="${ country.country_code }">${ country.country_name }</option>`)
      });  
    });
    $countrySelect.on('change', (e) => {
      const $option = $('option:selected', $countrySelect);
      //const country = $option.val();
      //this.onCountryChange(country);
      this.onCountryChange($option.val());
    });
    $citiesTable.on('click', '.action-edit', (e) => {
      const $row = $(e.target).closest('[data-city]');
      const city_id = $row.data('city');
      this.onEditCity(city_id, $row);
    });
    $citiesTable.on('click', '.action-delete', (e) => {
      const $row = $(e.target).closest('[data-city]');
      const city_id = $row.data('city');
      this.onDeleteCity(city_id, $row);
    });
    $saveCityModalButton.on('click', (e) => {
      // TODO: Figure out if edit vs create
      this.onCreateCity();
      // this.onEditCity();
    });
  }

  onCountryChange(country) {
    if (country) {
      this.country = country;

      // Request all of the cities for Country
      this.service.getCities(country).then(cities => {
        this.renderCities(cities);
      });
      $addCityButton.removeClass('disabled');
    }
  }

  onEditCity(city_id, $row) {
    console.log('[EDIT]', city_id, $row[0]);
  }

  onCreateCity() {
    const city = {
      "country_code": this.country,
      "city_name": $formCityName.val(),
      "latitude": parseFloat($formCityLatitude.val()),
      "longitude": parseFloat($formCityLongitude.val()),
      "city_population": parseInt($formCityPopulation.val(), 10),
    };
    this.service.createCity(city).then(res => {
      const $tbody = $('tbody', $citiesTable);
      if (res.code === 200) {
        $tbody.prepend(this.#renderCityRow(res.data));
        const element = $('#add-city').get()[0];
        const modal = bootstrap.Modal.getInstance(element);
        modal.hide();
      }
    });
  }

  onDeleteCity(city_id, $row) {
    console.log('[DELETE]', city_id, $row[0]);
    this.service.deleteCity(city_id).then((res) => {
      //const country = $('option:selected', $countrySelect).val();  
      //this.onCountryChange(country);
      if (res.code === 200) {
        $row.remove();
      }
    });
  }

  #renderCityRow(city) {
    return `
      <tr data-city="${ city.city_id }">
        <td>${ city.city_name }</td>
        <td class="text-end">${ city.latitude }</td>
        <td class="text-end">${ city.longitude }</td>
        <td class="text-end">${ city.city_population?.toLocaleString() }</td>
        <td class="control-action">
          <i class="action-edit text-primary bi bi-pencil-square"></i>
          <i class="action-delete text-danger bi bi-trash"></i>
        </td>
      </tr>`;
  }

  renderCities(cities) {
    const $tbody = $('tbody', $citiesTable);
    $tbody.empty();
    cities.forEach(city => {
      $tbody.append(this.#renderCityRow(city));
    });
    $citiesTable.removeClass('d-none');
  }
}