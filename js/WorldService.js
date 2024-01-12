export default class WorldService {
  constructor(url) {
    this.baseUrl = url || 'http://localhost:3000';
  }  

  /**
   * Retrieves all of the available countries.
   * @returns {Promise} Promise contains the data from the request.
   */
  getAllCountries() {
   const url = `${ this.baseUrl }/countries`;
   console.log(`Sending GET request to ${ url }...`);
   return $.ajax(url);
  }  

    /**
   * Retrieves all of the available cities in the specified country.
   * @param {String} country_code The unique id / code for the country.
   * @returns {Promise} Promise contains the data from the request.
   */
  getCitiesForCountry(country_code) {
    const url = `${ this.baseUrl }/countries/${ country_code }/cities`; 
    console.log(`Sending GET request to ${ url }...`);
    return $.ajax(url);
  }
}