(function($,undefined) {
  const baseUrl = 'http://localhost:3000'  
  
  /**
   * Service wrapper for getting API results for Countries of the world
   */
  class WorldService {
    constructor(url) {
      this.url = url || baseUrl;
    }

    /**
     * Retrieves all countries.
     * @returns The promise from the request
     */
    getAllCountries() {
      let url = `${ this.url }/countries`;
      console.log(`Requesting all countries at ${ url } ...`);
      return $.ajax(url, {
        error: (jqXHR, textStatus, errorThrown) => {
          console.log('OOPS...');
        },
        success: (countries, textStatus, jqXHR) => {
        }  
      });
    }

    /**
     * Get's all of hte cities for the specified country code.
     * @param {String} country_code The unique code for the country.
     */
    getCitiesForCountry(country_code) {
      if (! country_code) {
        return Promise.resolve([]);
      }  

      let url = `${ baseUrl }/countries/${ country_code }/cities`;
      console.log(`Requesting cities for country (${ country_code }) at ${ url } ...`);
      return $.ajax(url, { 
        error: (jqXHR, textStatus, errorThrown) => {
          console.log('OOPS...');
        },
        success: (cities, textStatus, jqXHR) => {
        }  
      });
    }

    deleteCityById(city_id) {
      // Make ajax request with DELETE verb.
      let url = `${ this.url }/cities/${ city_id }`
      $.ajax(url, {
        method : 'DELETE',
        contentType: '',
      })  
    }
  }


  $(function() {
    const service = new WorldService();
    const $selectCountries = $('#countries');
    const $tableCities = $('#cities tbody');

    let url = `${ baseUrl }/countries`;
    service.getAllCountries().then(countries => {
      $selectCountries.children().slice(1).empty();
      for(let country of countries) {
        let $option = $(`<option value="${ country.country_code }">
                           ${ country.country_name }
                         </option>`) 
        $selectCountries.append($option)
      }
    });

    $selectCountries.on('change', (e) => {
      let country_code = $(e.target).val();
      if (country_code) {
        $tableCities.empty();
        $tableCities.parent().addClass("d-none");
        service.getCitiesForCountry(country_code).then((cities) => {
          for (let city of cities) {
            let $row = $(`<tr>
                            <td>${ city.city_name }</td>
                            <td>${ city.latitude }</td>
                            <td>${ city.longitude }</td>
                            <td>${ city.city_population?.toLocaleString() }</td>
                            <td></td>
                          </tr>`);
            $tableCities.append($row);
          }
          $tableCities.parent().removeClass("d-none");
        });
      }
    });
  });
})(jQuery);