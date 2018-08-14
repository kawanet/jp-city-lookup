"use strict";

export module City {
    const MESH = require("../dist/mesh.json").mesh;
    const CITY = require("../dist/city.json").city;
    const cache: any = {};

    export function name(code: string | number): string {
        return CITY[c5(code)];
    }

    export function lookup(options: {
        /// JIS prefecture code
        pref?: string | number,
        /// latitude,longitude
        ll?: string,
        /// latitude
        lat?: number,
        /// longitude
        lng?: number,
        /// mesh code
        mesh?: string,
        /// JIS city code
        neighboring?: string | number
    }): string[] {
        if (!options) return;

        let result: string[];

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
            and(findForMesh(getMeshForLocation(latlng[0], latlng[1])));
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
            // only pref condition
            if (!result) return findForPref(pref);

            // with other conditions
            result = filterByPref(result, pref);
        }

        return result;

        function and(array) {
            if (array) {
                if (result) {
                    const index = arrayToIndex(array);
                    result = result.filter(v => index[v]);
                } else {
                    result = array;
                }
            } else {
                result = [];
            }
        }
    }

    function findNeighboring(code) {
        const matrix = cache.neighboring || (cache.neighboring = makeNighboringMatrix());

        const pairs = matrix[+code];

        if (pairs) return indexToArray(pairs);
    }

    function makeNighboringMatrix() {
        const all = cache.mesh || (cache.mesh = Object.keys(MESH));
        const matrix = {};

        all.forEach(mesh2 => {
            const item = MESH[mesh2];
            const multiple = item[2];
            if (!multiple) return;

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
            })
        });

        return matrix;
    }

    function findForPref(pref) {
        const all = cache.city || (cache.city = Object.keys(CITY));

        const list = cache[pref] || (cache[pref] = filterByPref(all, pref).sort());

        if (list.length) return list.slice();
    }

    function filterByPref(array, pref) {
        return array.filter(filter);

        function filter(city) {
            return Math.floor(+city / 1000) === pref;
        }
    }

    function findForMesh(mesh) {
        mesh += "";
        const len = mesh && mesh.length;
        if (len === 6) {
            return findForMesh2(mesh);
        } else if (len === 8) {
            return findForMesh3(mesh);
        }
    }

    function findForMesh2(mesh2) {
        const item = MESH[mesh2];
        if (!item) return;

        const city = item[0];

        // one city
        if (item.length === 1) return [c5(city)];

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
        if (!item) return;

        const city = item[0];
        const single = item[1];
        const multiple = item[2];

        const list = multiple[mesh3] || (single && single[mesh3] && [single[mesh3]]) || [city];
        return list.map(c5);
    }

    function getMeshForLocation(latitude, longitude) {
        latitude *= 1.5;
        longitude -= 100;

        if (!(0 <= latitude && latitude < 100)) return;
        if (!(0 <= longitude && longitude < 100)) return;

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
        const index = {};

        array.forEach(v => {
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
}

