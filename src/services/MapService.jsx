import axios from 'axios'

export const MapService = {
    getUSCovidData: function() {
        return axios.get('https://corona.lmao.ninja/v2/jhucsse/counties');
        // This is XHR, which returns a promise, with either success with a full Covid data list as "response" or failure with an "error"
    },

    getWorldCovidDate: function() {
        return axios.get('https://corona.lmao.ninja/v2/jhucsse');
        // This is XHR, which returns a promise, with either success with a full Covid data list as "response" or failure with an "error"
    }
}

// For US data only: https://corona.lmao.ninja/v2/jhucsse/counties
// For World data: https://corona.lmao.ninja/v2/jhucsse