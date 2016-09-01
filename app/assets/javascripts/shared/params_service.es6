class ParamsService {
  static rejectEmptyParams(paramsString) {
    return _.reject(paramsString.split('&'), (pair) => {
      return _.endsWith(pair, '=');
    }).join('&');
  }
}

export default ParamsService
