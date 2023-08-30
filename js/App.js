const $addCityNavLink = $('.control-add-city');
const $citiesTable = $('#cities');
const $countrySelect = $('#countries');
const $notification = $('#notification');

export default class App {
  /**
   * Creates an instance of the App class.
   * @param {WorldService} service The backend service for data.
   */
  constructor(service) {
    this.service = service;
  }

  /**
   * Adds a notification to the notification area in the application.
   * @param {String} level The level of the notification (primary, secondary, success, danger, warning, info, ligh, dark, muted)
   * @param {String} title The title for the notification.
   * @param {String} message The contents of the notification.
   * @param {Object} options Additional options for the bootstrap.Toast component.
   * @returns {bootstrap.Total} The initialized bootstrap toast component.
   */
  notify(level, title, message, options) {
    console.log(`App.notify(${ JSON.stringify(level) }, ${ JSON.stringify(title) }, ${ JSON.stringify(message) }, ${ JSON.stringify(options) })`);

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
    $notification.append($el);
  
    const toast = new bootstrap.Toast($el, { autohide: true, delay: 3000, ...options });
    toast.show();
    return toast;
  }

  /**
   * Selects the country.
   * @param {String} code The country code to select.
   */
  select(code) {
    console.log(`App.render(${ JSON.stringify(code) })`);

    this.service.getCountry(code).then((country) => {
      let notification = this.notify('info', 'Initialization', 
                                     `Getting cities for [${ country.country_code }] ${ country.country_name }...`,
                                     { autohide: false });
      this.service.getCitiesForCountry(country.country_code).then((cities) => {
        this.render(cities);
      }).catch((err) => {
        this.notify('danger', 'Error', `No cities found for [${ country.country_code }] ${ country.country_name }`);
        clearTable($citiesTable);
      }).finally(() => {
        notification.hide();
      });
    });
  }

  /**
   * Renders the cities into the table.
   * @param {Array} cities The list of cities to render.
   */
  render(cities) {
    console.log(`App.render(${ (cities || []).length })`);

    const $tbody = $('tbody', $citiesTable);
    const $caption = $('caption', $citiesTable);
    $caption.html('');
    $tbody.empty();

    if (cities && cities.length) {
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
      
      $caption.html(`${ cities.length } cities`);
      $citiesTable.removeClass('d-none');
    }
    else {
      $citiesTable.addClass('d-none');
    }
  }
  
  /**
   * Removes the city.
   * @param {Number} city The unique id of the city to be removed.
   */
  delete(city_id) {
    console.log(`App.delete(${ JSON.stringify(city_id) })`);

    if (city_id) {
      this.service.deleteCity(city_id).then((response) => {
        console.log(response);
        const $row = $(`tbody tr[data-city-id=${ city_id }]`, $citiesTable);
        $row.remove();

        this.notify('success', 'OK', `Removed "${ response.data.city_name }" from country.`);
      }).catch((response) => {
        this.notify('danger', 'Error', `Failed to delete city. ${ response.message }`);
      });
    }
  }
  
  /**
   * Adds the city.
   * @param {Object} city The city to add.
   */  
  add(city) {
    console.log(`App.add(${ JSON.stringify(city) })`);

    if (city) {
      this.service.addCity(city).then((response) => {
        this.notify('success', 'OK', `Created "${ response.data.city_name }" (${ response.data.city_id }).`);
        var modal = bootstrap.Modal.getInstance($('#add-city'));
        modal.hide();
        
        console.log('Now we have to render to table...');
      }).catch((error) => {
        this.notify('danger', 'Error', `Failed to create city. ${ response.message }`);
      });
    }
  }

  /**
   * Initializes the page or sets the default values.
   */
  initialize() {
    console.log(`App.initialize()`);
    
    let notification = this.notify('info', 'Initialization', 'Loading page components...', { autohide: false });
    this.service.getCountries().then((countries) => {
      $countrySelect.children().slice(1).empty(); // Delete everything except place holder
      countries.forEach((country) => {
        $countrySelect.append(`<option value="${ country.country_code }">${ country.country_name }</option>`)
      });
      notification.hide();
    });
  }

  /**
   * Starts the application processing.
   */
  run() {
    console.log(`App.run()`);

    $countrySelect.on('change', (e) => {
      const $option = $('option:selected', $countrySelect);
      if ($option.length) {
        $addCityNavLink.removeClass('disabled');
        this.select($option.val());
      } else {
        $addCityNavLink.addClass('disabled');
      }
    });
    $citiesTable.on('click', '.action-delete', (e) => {
      const $element = $(e.target).closest('[data-city-id]');
      const city_id = $element.data('city-id');
      if (city_id) {
        this.delete(city_id);
      }
    });
    $('#add-city .action-save').on('click', (e) => {
      const $status = $('#add-city .control-status');
      const city = {
        country_code: $countrySelect.val(),
        city_name: $('#city-name').val(),
        city_latitude: parseFloat($('#city-latitude').val()),
        city_longitude: parseFloat($('#city-longitude').val()),
        city_population: parseInt($('#city-population').val(), 10) || 0
      };
      this.add(city);
    });
  }
}