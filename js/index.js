import { getAllCountries, getAllCitiesForCountry } from "./WorldService.js";
import { getAllTeams } from "./TeamService.js";

//$(document).ready(() => { })
$(() => {
  const $countriesDropdownList = $('#countries');
  const $citiesTable = $('#cities');
  const $teamsDiv = $('#teams');

  getAllCountries().then((countries) => {
    for(let country of countries) {
      $countriesDropdownList.append(
        $(`<option value="${ country.code }">${ country.name }</option>`)
      )      
    }
  });

  getAllTeams().then((teams) => {
    let items = teams.map((team) => {
      return `<li>${ team.name }</li>`;
    });
    $teamsDiv.append($(`<ul>${ items.join("") }</ul>`))
  });

  $countriesDropdownList.on('change', (e) => {
    let code = $(e.target).val();
    console.log(`Selected: ${ code }`);
    $citiesTable.removeClass("d-none");
    if (code) {
      $('tbody', $citiesTable).empty();
      getAllCitiesForCountry(code).then((cities) => {
        let $rows = cities.map((city) => {
          return(
            $(`<tr>
                <td>${ city.name }</td>
                <td>${ city.location.latitude }</td>
                <td>${ city.location.longitude }</td>
                <td>${ city.population }</td>
               </tr>`)
          );
        });
        $('tbody', $citiesTable).append($rows);
      });
    }
  });

  // $.ajax({
  //   url: 'http://localhost:3000/countries',
  //   method: 'GET',
  //   success: (countries, textStatus, jqXHR)  => {
  //     for(let country of countries) {
  //       $countriesDropdownList.append(
  //         $(`<option value="${ country.country_code }">${ country.country_name }</option>`)
  //       )
  //     }
  //   }
  // })
  
});