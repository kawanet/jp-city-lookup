"use strict";
// jp-city-lookup
Object.defineProperty(exports, "__esModule", { value: true });
const c1 = fixedString(1);
const c2 = fixedString(2);
const c5 = fixedString(5);
var City;
(function (City) {
    const MESH = require("../dist/mesh.json").mesh;
    const CITY = require("../dist/city.json").city;
    const cache = {};
    function name(code) {
        return CITY[c5(code)];
    }
    City.name = name;
    function lookup(options) {
        let result = [];
        let found = false;
        if (!options)
            return result;
        // by pair of latitude and longitude
        const lat = +options.lat;
        const lng = +options.lng;
        if (lat || lng) {
            and(findForMesh(getMeshForLocation(lat, lng)));
        }
        // by comma separated latitude and longitude
        const ll = options.ll;
        if (ll) {
            const latlng = ("" + ll).split(",");
            and(findForMesh(getMeshForLocation(+latlng[0], +latlng[1])));
        }
        // mesh code
        const mesh = options.mesh;
        if (mesh) {
            and(findForMesh(mesh));
        }
        // by neighboring city code
        const neighboring = options.neighboring;
        if (neighboring) {
            and(findNeighboring(neighboring));
        }
        // by JIS prefecture code
        const pref = +options.pref;
        if (pref) {
            if (found) {
                // with other conditions
                result = filterByPref(result, pref);
            }
            else {
                // only pref condition
                return findForPref(pref) || [];
            }
        }
        return result;
        function and(array) {
            if (array) {
                if (found) {
                    const index = arrayToIndex(array);
                    result = result.filter(v => index[v]); // join
                }
                else {
                    result = array; // replace
                }
                found = true;
            }
            else {
                result = []; // empty
            }
        }
    }
    City.lookup = lookup;
    function findNeighboring(code) {
        const matrix = cache.neighboring || (cache.neighboring = makeCityMatrix());
        const pairs = matrix[+code];
        if (!pairs)
            return;
        return indexToArray(pairs);
    }
    function makeCityMatrix() {
        const all = cache.mesh || (cache.mesh = Object.keys(MESH));
        const matrix = {};
        all.forEach(mesh2 => {
            const item = MESH[mesh2];
            const multiple = item[2];
            if (!multiple)
                return;
            Object.keys(multiple).forEach(mesh3 => {
                const array = multiple[mesh3];
                array.forEach(code1 => {
                    const pairs = matrix[code1] || (matrix[code1] = {});
                    array.forEach(code2 => {
                        if (code1 !== code2) {
                            pairs[code2] = (pairs[code2] || 0) + 1;
                        }
                    });
                });
            });
        });
        return matrix;
    }
    function findForPref(pref) {
        const all = cache.city || (cache.city = Object.keys(CITY));
        const list = cache[pref] || (cache[pref] = filterByPref(all, pref).sort());
        if (!list.length)
            return;
        return list.slice();
    }
    function filterByPref(array, pref) {
        return array.filter(city => Math.floor(+city / 1000) === +pref);
    }
    function findForMesh(mesh) {
        if (!mesh)
            return;
        mesh += "";
        const len = mesh && mesh.length;
        if (len === 6)
            return findForMesh2(mesh);
        if (len === 8)
            return findForMesh3(mesh);
        return;
    }
    function findForMesh2(mesh2) {
        const item = MESH[mesh2];
        if (!item)
            return;
        const city = item[0];
        // one city
        if (item.length === 1)
            return [c5(city)];
        // more cities
        const index = {};
        add(city);
        const single = item[1];
        if (single) {
            Object.keys(single).forEach(mesh3 => add(single[mesh3]));
        }
        const multiple = item[2];
        if (multiple) {
            Object.keys(multiple).forEach(mesh3 => multiple[mesh3].forEach(add));
        }
        return indexToArray(index);
        function add(city) {
            index[city] = (index[city] || 0) + 1;
        }
    }
    function findForMesh3(mesh) {
        const mesh2 = mesh.substr(0, 6);
        const mesh3 = mesh.substr(6, 2);
        const item = MESH[mesh2];
        if (!item)
            return;
        const city = item[0];
        const single = item[1];
        const multiple = item[2];
        const list = multiple[mesh3] || (single && single[mesh3] && [single[mesh3]]) || [city];
        return list.map(c5);
    }
    function getMeshForLocation(latitude, longitude) {
        latitude *= 1.5;
        longitude -= 100;
        if (!(0 <= latitude && latitude < 100))
            return;
        if (!(0 <= longitude && longitude < 100))
            return;
        return c2(latitude) + c2(longitude)
            + c1(latitude * 8 % 8) + c1(longitude * 8 % 8)
            + c1(latitude * 80 % 10) + c1(longitude * 80 % 10);
    }
    function arrayToIndex(array) {
        const index = {};
        array.forEach(v => index[v] = 1);
        return index;
    }
    function indexToArray(index) {
        return Object.keys(index).map(c5).sort(sort);
        function sort(a, b) {
            return ((+index[b]) - (+index[a])) || ((+b) - (+a));
        }
    }
})(City = exports.City || (exports.City = {}));
/**
 * @private
 */
function fixedString(length) {
    return (number) => (number && number.length === length) ?
        number : ("00000" + (+number | 0)).substr(-length);
}
