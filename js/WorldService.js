const DefaultUrl = "http://localhost:3000"

/**
 * Service for interacting with the backend API
 */
export default class WorldService {
  /**
   * Creates an instance of the WorldService class.
   * @param {String} url The url of the backend API.
   */
  constructor(url) {
    this.url = url || DefaultUrl;
  }

  /**
   * Retrieves the specified country by it's unique id.
   * @returns {Promise} Promise contains the data from the request.
   */
  getCountry(code) {
    return new Promise((resolve,reject) => {
      if (! code) {
        return resolve(null);
      }
      
      const url = `${ this.url }/countries/${ code }`;
      console.info(`Requesting data from endpoint: ${ url }`);
      return $.ajax({
        url: url,
        dataType: 'json',
        success: function(country) {
          return resolve(country);
        },
        error: function(err) {
          reject(err);
        }
      });
    });
  }

  /**
   * Retrieves all of the available countries.
   * @returns {Promise} Promise contains the data from the request.
   */
  getCountries() {
    return new Promise((resolve,reject) => {
      const url = `${ this.url }/countries`;
      console.info(`Requesting data from endpoint: ${ url }`);
      return $.ajax({
        url: url,
        dataType: 'json',
        success: function(countries) {
          return resolve(countries);
        },
        error: function(err) {
          reject(err);
        }
      });
    });
  }

  /**
   * Retrieves all of the available cities in the specified country.
   * @param {String} code The unique id / code for the country.
   * @returns {Promise} Promise contains the data from the request.
   */
  getCitiesForCountry(code) {
    return new Promise((resolve,reject) => {
      if (! code) {
        return resolve([]);
      }

      const url = `${ this.url }/countries/${ code }/cities`;
      console.info(`Requesting data from endpoint: ${ url }`);
      return $.ajax({
        url: url,
        dataType: 'json',
        success: function(cities) {
          return resolve(cities);
        },
        error: function(err) {
          reject(err);
        }
      });
    });
  }

  /**
   * Retrieves the specified city by its unique id.
   * @param {Number} id The unique id of the city.
   * @returns {Promise} Promise contains the data from the request.
   */
  getCity(id) {
    return new Promise((resolve,reject) => {
      if ((! id) || (id <= 0)) {
        return resolve(null);
      }

      const url = `${ this.url }/cities/${ id }`;
      console.info(`Requesting data from endpoint: ${ url }`);
      return $.ajax({
        url: url,
        dataType: 'json',
        success: function(city) {
          return resolve(city);
        },
        error: function(err) {
          reject(err);
        }
      });
    });
  }

  /**
   * Removes the specified city by its unique id.
   * @param {Number} id The unique id of the city.
   * @returns {Promise} Promise contains the data from the request.
   */
  deleteCity(id) {
    return new Promise((resolve,reject) => {
      if ((! id) || (id <= 0)) {
        return reject(null);
      }

      const url = `${ this.url }/cities/${ id }`;
      console.info(`Sending DELETE request to endpoint: ${ url }`);
      return $.ajax({
        url: url,
        method: 'DELETE',
        dataType: 'json',
        success: function(response) {
          return resolve(response);
        },
        error: function(err) {
          reject(err);
        }
      });
    });
  }  

  /**
   * Adds the specified city.
   * @param {Object} city The city to add.
   * @returns {Promise} Promise contains the response from the request.
   */
  addCity(city) {
    return new Promise((resolve,reject) => {
      if (! city) {
        return reject();
      }

      const url = `${ this.url }/cities`;
      console.info(`Sending POST request to endpoint: ${ url }`);
      return $.ajax({
        url: url,
        method: 'POST',
        dataType: 'json',
        data: city,
        success: function(response) {
          return resolve(response);
        },
        error: function(err) {
          reject(err);
        }
      });
    });
  }  
};