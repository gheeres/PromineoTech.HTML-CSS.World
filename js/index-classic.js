import WorldService from './WorldService.js';

const service = new WorldService();


/**
 * Renders the cities into the table. 
 * @param {jQuery} $table The table to render results into the body.
 * @param {Array.Object} cities The collection of cities.
 * @returns {jQuery} The table body.
 */
function clearTable($table) {
  const $tbody = $('tbody', $table);
  $tbody.empty();

  $table.addClass('d-none');
  return $tbody;
}

/**
 * Renders the cities into the table. 
 * @param {jQuery} $table The table to render results into the body.
 * @param {Array.Object} cities The collection of cities.
 */
function renderTable($table, cities) {
  const $tbody = clearTable($table);

  cities.forEach((city) => {
    $tbody.append($(`
      <tr data-city-id="${ city.city_id }">
        <td>${ city.city_name }</td>
        <td class="text-end">${ city.latitude }</td>
        <td class="text-end">${ city.longitude }</td>
        <td class="text-end">${ city.city_population.toLocaleString() || '' }</td>
        <td class="text-end control-action">
          <i data-city-id="${ city.city_id }" class="action-edit text-primary bi bi-pencil-square"></i>
          <i data-city-id="${ city.city_id }" class="action-delete text-danger bi bi-trash "></i>
        </td>
      </tr>
    `));
  });
  
  const $caption = $('caption', $table);
  $caption.html(`${ cities.length } cities`);
  
  $table.removeClass('d-none');
  return $tbody;
}

/**
 * Adds a notification to the notification area in the application.
 * @param {String} level The level of the notification (primary, secondary, success, danger, warning, info, ligh, dark, muted)
 * @param {String} title The title for the notification.
 * @param {String} message The contents of the notification.
 * @param {Object} options Additional options for the bootstrap.Toast component.
 * @returns {bootstrap.Total} The initialized bootstrap toast component.
 */
function addNotification(level, title, message, options) {
  const $el = $(`
    <div class="toast align-items-center" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="toast-header bg-${ level } text-white">
        <strong class="me-auto">${ title }</strong>
        <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
      <div class="toast-body">
        ${ message }
      </div>
    </div>
  `);
  $('#notification').append($el);

  const toast = new bootstrap.Toast($el, { autohide: true, delay: 3000, ...options });
  toast.show();
  return toast;
}

/**
 * Renders the countries into the select / dropdown list.
 * @param {jQuery} $select The select/dropdown list to render into.
 * @param {Array.Object} countries The collection of cities.
 */
function renderSelect($select, countries) {
  $select.children().slice(1).empty(); // Delete everything except place holder
  countries.forEach((country) => {
    $select.append(`<option value="${ country.country_code }">${ country.country_name }</option>`)
  });
  return countries;
}

$(document).ready(() => {
  const $addCityNavLink = $('.control-add-city');
  const $citiesTable = $('#cities');
  const $countriesSelect = $('#countries');

  let notification = addNotification('info', 'Initialization', 'Loading page components...', { autohide: false });
  service.getCountries().then((countries) => {
    renderSelect($countriesSelect, countries);
    notification.hide();
  });

  $citiesTable.on('click', '.action-edit', (e) => {
    console.log('Edit row...');
  });
  $citiesTable.on('click', '.action-delete', (e) => {
    const $element = $(e.target).closest('[data-city-id]');
    const city_id = $element.data('city-id');
    if (city_id) {
      service.deleteCity(city_id).then((response) => {
        $element.closest('tr').remove();
        addNotification('success', 'OK', `Removed city from country`);
      }).catch((err) => {
        addNotification('danger', 'Error', `Failed to delete requested city.`);
      });
    }
  });
  $countriesSelect.on('change', (e) => {
    const $option = $('option:selected', $countriesSelect);
    if ($option.length) {
      $addCityNavLink.removeClass('disabled');

      const country = $option.val();
      console.log(`Country selected: [${ country }] ${ $option.text() }`)
      let notification = addNotification('info', 'Initialization', 
                                         `Getting cities for [${ country }] ${ $option.text() }...`,
                                         { autohide: false });
      service.getCitiesForCountry(country).then((cities) => {
        renderTable($citiesTable, cities);
      }).catch((err) => {
        addNotification('danger', 'Error', `No cities found for [${ country }] ${ $option.text() }`);
        clearTable($citiesTable);
      }).finally(() => {
        notification.hide();
      });
    } else {
      $addCityNavLink.addClass('disabled');
    }
  });

  $('#add-city .action-save').on('click', (e) => {
    const $status = $('#add-city .control-status');

    const country_code = $countriesSelect.val();
    const city_name = $('#city-name').val();
    const city_latitude = parseFloat($('#city-latitude').val());
    const city_longitude = parseFloat($('#city-longitude').val());
    const city_population = parseInt($('#city-population').val(), 10);

    const city = {
      country_code: country_code,
      city_name: city_name,
      city_latitude: city_latitude,
      city_longitude: city_longitude,
      city_population: city_population
    };
    service.addCity(city).then((response) => {
      console.log(response);
      console.log('Saved!');
      console.log('Now we have to render to table...');
    }).catch((error) => {

    });

  });
});