"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var City;
(function (City) {
    var MESH = require("../dist/mesh.json").mesh;
    var CITY = require("../dist/city.json").city;
    var cache = {};
    function name(code) {
        return CITY[c5(code)];
    }
    City.name = name;
    function lookup(options) {
        if (!options)
            return;
        var result;
        // by pair of latitude and longitude
        var lat = +options.lat;
        var lng = +options.lng;
        if (lat || lng) {
            and(findForMesh(getMeshForLocation(lat, lng)));
        }
        // by comma separated latitude and longitude
        var ll = options.ll;
        if (ll) {
            var latlng = ("" + ll).split(",");
            and(findForMesh(getMeshForLocation(latlng[0], latlng[1])));
        }
        // mesh code
        var mesh = options.mesh;
        if (mesh) {
            and(findForMesh(mesh));
        }
        // by neighboring city code
        var neighboring = options.neighboring;
        if (neighboring) {
            and(findNeighboring(neighboring));
        }
        // by JIS prefecture code
        var pref = +options.pref;
        if (pref) {
            // only pref condition
            if (!result)
                return findForPref(pref);
            // with other conditions
            result = filterByPref(result, pref);
        }
        return result;
        function and(array) {
            if (array) {
                if (result) {
                    var index_1 = arrayToIndex(array);
                    result = result.filter(function (v) { return index_1[v]; });
                }
                else {
                    result = array;
                }
            }
            else {
                result = [];
            }
        }
    }
    City.lookup = lookup;
    function findNeighboring(code) {
        var matrix = cache.neighboring || (cache.neighboring = makeNighboringMatrix());
        var pairs = matrix[+code];
        if (pairs)
            return indexToArray(pairs);
    }
    function makeNighboringMatrix() {
        var all = cache.mesh || (cache.mesh = Object.keys(MESH));
        var matrix = {};
        all.forEach(function (mesh2) {
            var item = MESH[mesh2];
            var multiple = item[2];
            if (!multiple)
                return;
            Object.keys(multiple).forEach(function (mesh3) {
                var array = multiple[mesh3];
                array.forEach(function (code1) {
                    var pairs = matrix[code1] || (matrix[code1] = {});
                    array.forEach(function (code2) {
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
        var all = cache.city || (cache.city = Object.keys(CITY));
        var list = cache[pref] || (cache[pref] = filterByPref(all, pref).sort());
        if (list.length)
            return list.slice();
    }
    function filterByPref(array, pref) {
        return array.filter(filter);
        function filter(city) {
            return Math.floor(+city / 1000) === pref;
        }
    }
    function findForMesh(mesh) {
        mesh += "";
        var len = mesh && mesh.length;
        if (len === 6) {
            return findForMesh2(mesh);
        }
        else if (len === 8) {
            return findForMesh3(mesh);
        }
    }
    function findForMesh2(mesh2) {
        var item = MESH[mesh2];
        if (!item)
            return;
        var city = item[0];
        // one city
        if (item.length === 1)
            return [c5(city)];
        // more cities
        var index = {};
        add(city);
        var single = item[1];
        if (single) {
            Object.keys(single).forEach(function (mesh3) { return add(single[mesh3]); });
        }
        var multiple = item[2];
        if (multiple) {
            Object.keys(multiple).forEach(function (mesh3) { return multiple[mesh3].forEach(add); });
        }
        return indexToArray(index);
        function add(city) {
            index[city] = (index[city] || 0) + 1;
        }
    }
    function findForMesh3(mesh) {
        var mesh2 = mesh.substr(0, 6);
        var mesh3 = mesh.substr(6, 2);
        var item = MESH[mesh2];
        if (!item)
            return;
        var city = item[0];
        var single = item[1];
        var multiple = item[2];
        var list = multiple[mesh3] || (single && single[mesh3] && [single[mesh3]]) || [city];
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
    function c1(number) {
        number |= 0;
        number %= 10;
        return "" + number;
    }
    function c2(number) {
        number |= 0;
        number %= 100;
        return (number < 10 ? "0" : "") + number;
    }
    function c5(number) {
        number |= 0;
        return ("000000" + number).substr(-5);
    }
    function arrayToIndex(array) {
        var index = {};
        array.forEach(function (v) {
            index[v] = 1;
        });
        return index;
    }
    function indexToArray(index) {
        return Object.keys(index).map(c5).sort(sort);
        function sort(a, b) {
            return (index[b] - index[a]) || ((+b) - (+a));
        }
    }
})(City = exports.City || (exports.City = {}));
