const baseUrl = 'http://localhost:3000';

class WorldService {
  constructor(url) {
    this.url = url || baseUrl;
  }

  allCountries() {
    let url = `${ this.url }/countries`;
    console.log('Requesting all countries at ${ url }...');
    return $.ajax(url, {
      success: (data) => {
        return data;
      }
    });
  }

  getCitiesForCountry(country_code) {
    let url = `${ this.url }/countries/${ country_code }/cities`;
    console.log(`Requesting cities for ${ country_code } at ${ url }...`);
    return $.ajax(url, {
      success: (data) => {
        return data;
      }
    });
  }

  deleteCity(city_id) {
    let url = `${ this.url }/cities/${ city_id }`;
    console.log(`Deleting city (${ city_id }) at ${ url }...`);
    return $.ajax(url, {
      method: 'DELETE',
      success: (data) => {
        return data;
      }
    });
  }
}

$(document).ready(() => {
  const $countries = $('#countries');
  const $cities = $('#cities');

  const service = new WorldService();
  service.allCountries().then(countries => {
    for(let country of countries) {
      let $option = $(`<option value="${ country.country_code }">${ country.country_name }</option>`);
      $countries.append($option);
    }
  });

  $countries.on('change', (e) => {
    let $tbody = $('tbody', $cities);
    $tbody.empty();
    $('caption', $cities).html('No cities');

    let country_code = $countries.val();
    service.getCitiesForCountry(country_code).then(cities => {
      $cities.removeClass('d-none');
      for(let city of cities) {
        let $row = $(`<tr>
                        <td>${ city.city_name }</td>
                        <td>${ city.latitude }</td>
                        <td>${ city.longitude }</td>
                        <td>${ city.city_population }</td>
                        <td class="control-action">
                          <i data-city-id=${ city.city_id } class="action-delete text-danger bi bi-trash" />
                        </td>
                      </tr>`);
        $tbody.append($row);
      }
      $('caption', $cities).html(`${ cities.length } cities`);
    });
  });

  $cities.on('click', '.action-delete', (e) => {
    let city = $(e.target).data('city-id');
    service.deleteCity(city).then((result) => {
      console.log('[DELETE]', result);
      $(e.target).closest('tr').remove();
    });
  });
});
