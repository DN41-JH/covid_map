import axios from 'axios'

export const MapService = {
    getUSCovidData: function() {
        return axios.get('https://corona.lmao.ninja/v2/jhucsse')
        // For US data only: https://corona.lmao.ninja/v2/jhucsse/counties
        // For World data: https://corona.lmao.ninja/v2/jhucsse
    }
}