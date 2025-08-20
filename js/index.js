// IIFE
(function($) {
  const baseUrl = 'http://localhost:3000';

  class WorldService {
    constructor(url) {
      this.url = url || baseUrl;   
    }

    getAllCountries() {
      const url = `${ baseUrl }/countries`;
      console.log(`Retrieving all countries from: ${ url }`);
      return fetch(url).then((res) => {
        return res.json();
      });
      // return new Promise((resolve,reject) => {
      //   const url = `${ baseUrl }/countries`;
      //   console.log(`Retrieving all countries from: ${ url }`);
      //   $.ajax({
      //     url: url,
      //     success: (countries) => {
      //       resolve(countries);
      //     },
      //     error: (res) => {
      //       reject([]);
      //     }  
      //   })
      // });
    }

    getAllCitiesForCountry(countryCode) {
      return new Promise((resolve,reject) => {
        const url = `${ baseUrl }/countries/${ countryCode }/cities`;
        console.log(`Retrieving all cites for ${ countryCode } from: ${ url }`);
        $.ajax({
          url: url,
          success: (cities) => {
            resolve(cities);
          },
          error: (res) => {
            reject([]);
          }  
        })
      });
    }
  }

  function renderCityTable(cities) {
    let rows = cities?.map((city,index) => {
                            return `<tr>
                                     <td>${ city.city_name }</td>
                                     <td>${ city.city_population.toLocaleString() }</td>
                                   </tr>`
                           }).join('');
    let $table = `
      <table class="table table-striped table-condensed">
       <thead>
         <tr>
           <th>Name</th>
           <th>Population</th>
         </tr>
       </thead>
       <tbody>
         ${ rows }
       </tbody>
       <tfoot>
         ${ cities?.length } cities
       </tfoot>
     </table>`;

     return $table;
   };


  $(() => {
    console.log("DOM Ready...");

    const service = new WorldService();
    const $content = $('#content');
    const $countries = $('#countries');

    service.getAllCountries().then((countries) => {
      for(let country of countries) {
        let $option = $(`<option data-name="${ country.country_name }" value="${ country.country_code }">${ country.country_name }</option>`);
        $countries.append($option);
      }
    });

    $countries.on('change', (e) => {
      let countryCode = $(e.target).val();  
      let $selected = $(':selected', e.target);
      if (countryCode) {
        console.log(`Country changed. Country: ${ countryCode }`);

        $content.empty();
        service.getAllCitiesForCountry(countryCode).then((cities) => {
          let $table = renderCityTable(cities);
          $content.append($table);
        });
      }
    });
  });
})(jQuery);