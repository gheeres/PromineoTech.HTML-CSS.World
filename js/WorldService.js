const defaultUrl = `http://localhost:3000`;

export default class WorldService {
  constructor(url) {
    this.url = url || defaultUrl;
  }  

  /**
   * Retrieves all of the available countries.
   * @returns {Promise} Promise contains the data from the request.
   */
  getCountries() {
    const url = `${ this.url }/countries`;
    console.log(`Requesting data from endpoint: ${ url }`);
    //return fetch(url).then(res => res.json());

    return new Promise((resolve,reject) => {
      return $.ajax({
        url: url,
        dataType: 'json', // application/json
        success: (res) => {
          return resolve (res); 
        },
        error: (err) => {
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
  getCities(country) {
    const url = `${ this.url }/countries/${ country }/cities`;
    console.log(`Requesting data from endpoint: ${ url }`);

    return new Promise((resolve,reject) => {
      return $.ajax({
        url: url,
        dataType: 'json', // application/json
        success: (res) => {
          return resolve (res); 
        },
        error: (err) => {
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
  deleteCity(city_id) {
    const url = `${ this.url }/cities/${ city_id }`;
    console.log(`Sending DELETE request to endpoint: ${ url }`);
    return new Promise((resolve,reject) => {
      return $.ajax({
        url: url,
        method: 'DELETE',
        dataType: 'json', // application/json
        success: (res) => {
          return resolve (res); 
        },
        error: (err) => {
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
  createCity(city) {
    const url = `${ this.url }/cities`;
    console.log(`Sending POST request to endpoint: ${ url }`);

    return new Promise((resolve,reject) => {
      if (! city) {
        return reject();
      }  

      return $.ajax({
        url: url,
        method: 'POST',
        dataType: 'json', // application/json
        data: city,
        success: (res) => {
          return resolve (res); 
        },
        error: (err) => {
          reject(err);
        }
      });
    });   
  }
}