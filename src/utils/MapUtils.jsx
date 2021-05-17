export const MapUtils = {
    getCovidPoints: function(points) {
        // "points" is the data obtained from XHR request from 'https://corona.lmao.ninja/v2/jhucsse/counties'
        // "points" is represented as a list of objects, in which each object contains the county-level data as:
        // {"country":<str>, "province":<str>, "county":<str>, "stats":{"confirmed":<int>, "deaths":<int>, "recovered":<int>}, 
        // "coordinates":{"latitude":<str>, "longitude":<str>}}

        if (!points) {
            return {};
        }

        const states_data = {
            type: 'states',
        };

        const nations_data = {
            type: 'nations',
        };

        // Data organization and synthesis process (perform province-level and nation-level aggrevation):
        for (const point of points) {
            if (Number.isNaN(point.stats.confirm) || Number.isNaN(point.stats.deaths)) {
                console.log('Got Dirty Data', point);
                continue;
            }

            // Aggregate data by state (province-level aggregation)
            states_data[point.country] = states_data[point.country] || {}; // initialize a country key
            states_data[point.country][point.province] = states_data[point.country][point.province] || {
                confirmed: 0,
                deaths: 0,
                recovered: 0,
            }; // initialize a state/province key

            // Start the province-level aggregation
            states_data[point.country][point.province].confirmed += point.stats.confirmed;
            states_data[point.country][point.province].deaths += point.stats.deaths;
            states_data[point.country][point.province].recovered += point.stats.recovered;

            states_data[point.country][point.province].coordinates 
                = states_data[point.country][point.province].coordinates || point.coordinates;
            
            
            // Homework: country-level aggregation
            // Aggregate data by nation (country-level aggregation)
            nations_data[point.country] = nations_data[point.country] || {
                confirmed: 0,
                deaths: 0,
                recovered: 0,
            }; // initialize a country key

            // Starts the country-level aggregation
            nations_data[point.country].confirmed += point.stats.confirmed;
            nations_data[point.country].deaths += point.stats.deaths;
            nations_data[point.country].recovered += point.stats.recovered;

            nations_data[point.country].coordinates = states_data[point.country].coordinates || point.coordinates;
        }



        const result = {};
        let zoom_level = 1; // zoom level
        // zoom level in [1, 4]: natino level
        // zoom level in [5, 9]: state level
        // zoom level in [10, 20]: county level

        for (; zoom_level<=4; zoom_level++) {
            result[zoom_level] = nations_data;
        };
        for (; zoom_level<=9; zoom_level++) {
            result[zoom_level] = states_data;
        };
        for (; zoom_level<=20; zoom_level++) {
            result[zoom_level] = points;
        };

        return result;
    },

    isInBoundary: function(bounds, coordinates) {
        // "bounds" is the boundary of current screen.
        // "coordinates" is the coordinates to be checked whether it is in the current screen.
        return coordinates && bounds && bounds.nw && bounds.se && 
        ((coordinates.longitude >= bounds.nw.lng && coordinates.longitude <= bounds.se.lng) || (coordinates.longitude <= bounds.nw.lng && coordinates.longitude >= bounds.se.lng))
        && ((coordinates.latitude >= bounds.se.lat && coordinates.latitude <= bounds.nw.lat) || (coordinates.latitude <= bounds.se.lat && coordinates.latitude >= bounds.nw.lat));
        
    },
}