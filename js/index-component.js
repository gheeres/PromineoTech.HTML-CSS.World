import WorldService from './WorldService.js';

const service = new WorldService();

/**
 * Represents an alert or notification element for the page.
 */
class Alert {
  constructor(options) {
    this.level = options.level || 'info';
    this.title = options.title || 'Notification';
    this.message = options.message;
  }

  /**
   * Renders the HTML element.
   * @returns {JQuery<HTMLElement>} The HTML element.
   */
  render() {
    this.$el = $(`
      <div class="toast align-items-center" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="toast-header bg-${ this.level } text-white">
          <strong class="me-auto">${ this.title }</strong>
          <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
          ${ this.message }
        </div>
      </div>
    `);
    this.toast = new bootstrap.Toast(this.$el, { autohide: true, delay: 10000 });
    this.toast.show();
    return this.$el;
  }
}

/**
 * Represents a dropdown list or select that contains the available list of countries.
 */
class CountrySelect {
  constructor(el) {
    this.$el = $(el);
    this.$el.on('change', (e) => this.#onChange(e));
    this.load();
  }

  /**
   * Wrapper method for the jQuery element events.
   * @param {String} e The name of the event.
   * @param {Function} fn The callback function to register.
   */
  on(e, fn) {
    this.$el.on(e, fn);
  }

  /**
   * Occurs when the select item has changed.
   * @param {Event} e The event
   */
  #onChange(e) {
    const code = this.$el.val();
    if (code) {
      service.getCountry(code).then((country) => {
        this.$el.trigger({ type: 'country-change', country: country });
      });
    }
  }

  /**
   * Loads the data into the select list.
   * @returns {Promise<Array.Object>} Returns a promise that containing countries.
   */
  load() {
    this.$el.children().slice(1).empty(); // Delete everything except place holder
    return service.getCountries().then((countries) => {
      this.render(countries || []);
      return countries;
    });
  }

  /**
   * Renders the HTML element.
   * @returns {JQuery<HTMLElement>} The HTML element.
   */
  render(countries) {
    countries.forEach((country) => {
      this.$el.append(`<option value="${ country.country_code }">${ country.country_name }</option>`)
    });
    return this.$el;
  }
}

/**
 * Represents a table containing a preformatted structure containing cities.
 */
class CitiesTable {
  constructor(el) {
    this.$el = $(el);
    this.$tbody = $('tbody', this.$el);
    this.$caption = $('caption', this.$el);
    this.$el.on('click', '.action-edit', (e) => this.#onEdit(e));
    this.$el.on('dblclick', 'tbody tr', (e) => this.#onEdit(e));
    this.$el.on('click', '.action-delete', (e) => this.#onDelete(e));
  }

  /**
   * Wrapper method for the jQuery element events.
   * @param {String} e The name of the event.
   * @param {Function} fn The callback function to register.
   */
  on(e, fn) {
    this.$el.on(e, fn);
  }

  /**
   * Retrieves the city identifier from the DOM.
   * @param {Event} e  The event to parse.
   * @returns {Number} The parsed unique city_id.
   */
  #getCityFromEvent(e) {
    const $row = $(e.target).closest('tr');
    const city_id = parseInt($row.data('city-id'), 10);
    return city_id;
  }

  /**
   * Occurs when the edit button is clicked on the city.
   * @param {Event} e The event.
   */
  #onEdit(e) {
    const city_id = this.#getCityFromEvent(e);
    service.getCity(city_id).then((city) => {
      if (city) {
        this.$el.trigger({ type: 'city-edit', city: city, $el : $(e.target).closest('tr') });
      }
    });
  }

  /**
   * Occurs when the delete button is clicked on the city.
   * @param {Event} e The event.
   */
  #onDelete(e) {
    const city_id = this.#getCityFromEvent(e);
    service.getCity(city_id).then((city) => {
      if (city) {
        this.$el.trigger({ type: 'city-delete', city: city, $el : $(e.target).closest('tr') });
      }
    });
  }

  /**
   * Loads the data into the table.
   * @param {String} code The unique code for the country.
   * @returns {Promise<Array.Object>} Returns a promise that containing countries.
   */
  load(code) {
    this.$el.addClass('d-none'); // Hide while loading...
    return service.getCitiesForCountry(code).then((cities) => {
      this.render(cities || []);
      this.$el.removeClass('d-none'); // Display 
    });
  }

  /**
   * Renders the HTML element.
   * @param {Array.Object} cities The cities to render as rows in the table.
   * @returns {JQuery<HTMLElement>} The HTML element.
   */
  render(cities) {
    this.$caption.html(`${ cities.length } cities`);
    this.$tbody.empty();

    cities.forEach((city,index) => {
      this.$tbody.append(`
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
      `);
    });
    return this.$el;
  }
}

class CityDialog {
  #modal;

  constructor(el, city) {
    this.$el = $(el);
    this.city = city;
  }

  show() {
    if (this.#modal) {
      this.#modal.show();
    }
    return this.$el;
  }

  #onClose(e) {
    this.$el.off().remove();
    this.#modal.dispose();
  }

  #onSave(e) {
    if (this.city) {
      console.log('Update existing city...');
    }
    else {
      console.log('Add new city...');
    }
  }

  render(city) {
    this.city = city;
    this.$el = $(`
      <div class="modal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">${ city ? `Edit City: (${ city.city_id }) ${ city.city_name }` : 'Create city' }</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div class="mb-3">
                <label for="city-country-code" class="form-label">Country</label>
                <input type="text" class="form-control" id="city-country-code" placeholder="Country Code (ISO 3166-1 alpha-3)" value="${ city?.country?.country_code || '' }">
              </div>
              <div class="mb-3">
                <label for="city-name" class="form-label">Name</label>
                <input type="text" class="form-control" id="city-name" placeholder="Official City Name" value="${ city?.city_name || '' }">
              </div>
              <div class="mb-3">
                <label for="city-latitude" class="form-label">Latitude</label>
                <input type="number" class="form-control" id="city-latitude" placeholder="Latitude (North/South)" value="${ city?.latitude || '' }">
              </div>
              <div class="mb-3">
                <label for="city-longitude" class="form-label">Longitude</label>
                <input type="number" class="form-control" id="city-longitude" placeholder="Longitude (West/East)" value="${ city?.longitude || '' }">
              </div>
              <div class="mb-3">
                <label for="city-population" class="form-label">Population</label>
                <input type="number" class="form-control" id="city-population" placeholder="Population" value="${ city?.city_population || '' }">
              </div>
            </div>
            <div class="modal-footer">
              <div class="w-50 me-auto justify-content-start">
                <span class="control-status text-danger"></span>
              </div>
              <div class="w-40 justify-content-end">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel <i class="bi bi-arrow-counterclockwise"></i></button>
                <button type="button" class="action-save btn btn-primary">Save <i class="bi bi-save2"></i></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `);
    this.$el.on('hidden.bs.modal', (e) => this.#onClose(e));
    this.$el.on('click', '.action-save', (e) => this.#onSave(e));
    this.#modal = new bootstrap.Modal(this.$el, {
      keyboard: false
    });

    return this.show();
  }
}

$(document).ready(() => {
  const $main = $('main');
  const $content = $('#content', $main);
  const $buttonAddCity = $('.action-add-city');
  const $selectCountries = $('#countries', $main);
  const $tableCities = $('#cities', $main);
  const $notification = $('#notification');
  
  const cities = new CitiesTable($tableCities)
  const countries = new CountrySelect($selectCountries);
  
  $(document).on('alert', function(e) {
    console.log(`Message: [${ e.level }] ${ e.message }`);
    const options = {
      level: e.level,
      title: e.title, message: e.message || e.content
    };
    $notification.prepend(new Alert(options).render());
  });

  //$(document).trigger({ 
  //  type: 'alert', message: 'Just a heads up...'
  //});
  //$(document).trigger({ 
  //  type: 'alert', level: 'danger', title: 'Warning!', message: 'Another... more elaborate alert'
  //});

  countries.on('country-change', function(e) {
    console.log(`Country selection changed. Country: ${ e.country.country_code } - ${ e.country.country_name }`);
    cities.load(e.country.country_code);
  });
  cities.on('city-edit', function(e) {
    const dialog = new CityDialog(null, e.city);
    const $el = dialog.render(e.city);
    $main.append($el);
  });
  cities.on('city-delete', function(e) {
    console.log(`Delete city: (${ e.city.city_id }) ${ e.city.city_name }`);
    service.deleteCity(e.city.city_id).then((response) => {
      $(document).trigger({ 
        type: 'alert', level: 'success', title: 'Deleted', 
        message: response.message
      });
      e.$el.remove();
    });
  });
  $buttonAddCity.on('click', (e) => {
    const dialog = new CityDialog();
    const $el = dialog.render();
    $main.append($el);
  });
});