const axios = require('axios');
const headers = {
  'content-type': 'application/json',
};

function handleSessions(promise) {
  return promise.catch((error) => {
    if (error.response.status === 401) document.location.href = '/data/times';
    else {
      console.log('API Error: ', error);
      throw error;
    }
  });
}

class API {
  static getTimes() {
    const opts = {
      method: 'get',
      headers,
      url: '/data/times',
    };

    return handleSessions(axios(opts));
  }

  static getDrivers() {
    const opts = {
      method: 'get',
      headers,
      url: '/data/drivers',
    };

    return handleSessions(axios(opts));
  }
}

module.exports = API;
