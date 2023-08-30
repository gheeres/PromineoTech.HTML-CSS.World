import WorldService from './WorldService.js';

const service = new WorldService();

// Observer pattern (Pub / Sub)
var queue = $({});
$.each({
  trigger: 'publish',
  on: 'subscribe',
  off: 'unsubscribe'
}, function(key, val) {
  jQuery.prototype[val] = function() {
     queue[key].apply(queue, arguments);
   };
});

$(document).ready(() => {
  // Alert / Notification Handling...
  const $notification = $('#notification');
  $notification.subscribe('notify', (e) => {
    const $el = $(`
      <div class="toast align-items-center" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="toast-header bg-${ e.level || 'info' } text-white">
          <strong class="me-auto">${ e.title || 'Notification '}</strong>
          <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
          ${ e.message }
        </div>
      </div>
    `);
    $notification.append($el);
    const toast = new bootstrap.Toast($el, { autohide: true, delay: 3000, ...e });
    toast.show();
  });

  const $countriesSelect = $('#countries');
  $countriesSelect.subscribe('initialize', (e) => {
    queue.publish({ type: 'notify', level: 'info', message: `Loading / initializing page elements...` });
    service.getCountries().then((countries) => {
      $countriesSelect.children().slice(1).empty(); // Delete everything except place holder
      countries.forEach((country) => {
        $countriesSelect.append(`<option value="${ country.country_code }">${ country.country_name }</option>`)
      });
    });
  });
  $countriesSelect.on('change', (e) => {
    const code = $(e.target).val();
    if (code) {
      service.getCountry(code).then((country) => {
        queue.publish({ type: 'country-changed', country: country });
      });
    }
  });

  const $citiesTable = $('#cities');
  $citiesTable.subscribe('country-changed', (e) => {
    const country = e.country;
    if (country) {
      queue.publish({ type: 'notify', level: 'info', 
                      message: `Loading cities for [${ country.country_code }] ${ country.country_name }...` });
      service.getCitiesForCountry(country.country_code).then((cities) => {
        $citiesTable.addClass('d-none');
        $('tbody', $citiesTable).empty();
        cities.forEach((city) => {
          queue.publish({ type: 'display-city', city: city });
        });
        $('caption', $citiesTable).html(`${ cities.length } cities`);
        $citiesTable.removeClass('d-none');
      }).catch((error) => {
        queue.publish({ type: 'notify', level: 'danger', 
                        message: `No cities found for [${ country.country_code }] ${ country.country_name }...` });
      });
    }
  });
  $('tbody', $citiesTable).subscribe('display-city', (e) => {
    const city = e.city;
    if (city) {
      $('tbody', $citiesTable).append($(`
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
    }
  });

  queue.publish({ type: 'initialize' });
});