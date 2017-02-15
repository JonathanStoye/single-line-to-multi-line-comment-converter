/* eslint-disable
    require-jsdoc,
*/
// adfafafa // asfasfasf //
//
// External dependencies
//
const Q = require('q');
const rp = require('request-promise');
const url = require('url');

//
// Internal dependencies
//
const logger = require('../logger');
const designApiCfg = require('config').designApi;

// single line comment

// #################################
//
// Element API Service
//
// #################################
class DesignApi {

  //
  // Request elements for the given skus
  //
  // @param {mixed} array of skus or one single sku
  // @return {promise}
  //
  getDesigns(uuid) {
    const designApiUrl = this._buildApiUrl(uuid);
    const deferred = Q.defer();

    rp(designApiUrl)
      .then((response) => {
        const designs = JSON.parse(response);

        return deferred.resolve(designs);
      })
      .catch((error) => {
        if (error.statusCode === 404) {
          logger.log('No design found for given uuid');
        } else {
          logger.error('Error fetching the designs', error);
        }

        return deferred.reject(error);
      });

    return deferred.promise;
  }


  // ##################################
  //
  // Private methods
  //
  // #################################

  //
  // Build Element API url
  //
  // @return {string}
  //
  _buildApiUrl(uuids) {
    return `${ url.format(designApiCfg) }/${ uuids }?list_elements=true`;
  }
}


//
// Export
//
module.exports = DesignApi;
