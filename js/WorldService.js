const baseUrl = `http://localhost:3000`;

function toCountry(country) {
  if (country) {
    return {
      code: country.country_code,
      code2: country.country_code2,
      name: country.country_name,
      population: country.country_population,
    }
  }
  return null;
}

/**
 * Gets all available countries.
 * @returns A promise that on success returns all countries if found.
 */
export function getAllCountries() {
  return new Promise((resolve,reject) => {
    $.ajax({
      url: `${ baseUrl }/countries`,
      method: 'GET',
      success: (countries,textStatus,jqXHR) => {
        // let result = [];
        // for(let country of countries) {
        //   let c = toCountry(country);
        //   if (c) {
        //     result.push(c);
        //   }
        // }
        let result = countries.map((country) => toCountry(country));
        resolve(result);
      }
    });
  });
}

function toCity(city) {
  if (city) {
    return {
      id: city.city_id,
      name: city.city_name,
      location: {
        latitude: city.latitude,
        longitude: city.longitude
      },
      population: city.city_population,      
    };
  }
  return null;
}

/**
 * Gets all of the cities for the specified country.
 * @param {string} code The ISO3155-1 identifier. Both alpha-2 and alpha-3 are supported
 */
export function getAllCitiesForCountry(code) {
  return new Promise((resolve,reject) => {
    if (! code) {
      reject();
    }

    $.ajax({
      url: `${ baseUrl }/countries/${ code }/cities`,
      method: 'GET',
      success: (cities,textStatus,jqXHR) => {
        let result = cities.map((city) => toCity(city));
        resolve(result);
      }
    });
  });
}