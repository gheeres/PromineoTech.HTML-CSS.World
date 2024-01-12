import WorldService from './WorldService.js';

$(document).ready(() => {
  const $countries = $('#countries');
  const $cities = $('#cities');
 
  //const service = new WorldService('http://localhost:3000');
  const service = new WorldService();

  service.getAllCountries().then((countries) => {
    for(const country of countries) {
      $countries.append(`<option value="${ country.country_code }">${ country.country_name }</option>`);
    }
  });
  
  $countries.on('change', (e) => {
    const country_code = $countries.val();
    service.getCitiesForCountry(country_code).then((cities) => {
      const $body = $('tbody', $cities);
      $body.empty();
      cities.forEach((city) => {
        $body.append(`
          <tr>
            <td>${ city.city_name }</td>
            <td>${ city.latitude }</td>
            <td>${ city.longitude }</td>
            <td>${ city.city_population }</td>
          </tr>
        `);
        $cities.removeClass('d-none');
      });
    });
  });
});