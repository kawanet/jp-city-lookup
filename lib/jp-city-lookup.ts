// jp-city-lookup

type MeshCode = string;
type PrefCode = string;
type CityCode = string;

type CityIndex = { [city: string]: number };
type CityMatrix = { [city: string]: CityIndex };

type SingleCityMesh = { [mesh: string]: number };
type MultipleCityMesh = { [mesh: string]: number[] };
type MeshCityItem = [number, SingleCityMesh?, MultipleCityMesh?];
type MeshCityMaster = { [mesh: string]: MeshCityItem };

type CityNameMaster = { [city: string]: string };

const c1 = fixedString(1);
const c2 = fixedString(2);
const c5 = fixedString(5);

export interface LookupOptions {
    /// JIS prefecture code
    pref?: PrefCode | number,

    /// latitude,longitude
    ll?: string,

    /// latitude
    lat?: number,

    /// longitude
    lng?: number,

    /// mesh code
    mesh?: MeshCode,

    /// JIS city code
    neighboring?: CityCode | number,
}

export module City {
    const MESH: MeshCityMaster = require("../dist/mesh.json").mesh;
    const CITY: CityNameMaster = require("../dist/city.json").city;
    const cache: {
        city?: CityCode[],
        mesh?: MeshCode[],
        neighboring?: CityMatrix,
        [pref: number]: CityCode[],
    } = {};

    export function name(code: CityCode | number): string | undefined {
        return CITY[c5(code)];
    }

    export function lookup(options: LookupOptions): CityCode[] {
        let result = [] as CityCode[];
        let found = false;

        if (!options) return result;

        // by pair of latitude and longitude
        const lat = +options.lat!;
        const lng = +options.lng!;
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
        const pref = +options.pref!;
        if (pref) {
            if (found) {
                // with other conditions
                result = filterByPref(result, pref);
            } else {
                // only pref condition
                return findForPref(pref) || [];
            }
        }

        return result;

        function and(array?: CityCode[]) {
            if (array) {
                if (found) {
                    const index = arrayToIndex(array);
                    result = result.filter(v => index[v]); // join
                } else {
                    result = array; // replace
                }
                found = true;
            } else {
                result = []; // empty
            }
        }
    }

    function findNeighboring(code: CityCode | number): CityCode[] | undefined {
        const matrix = cache.neighboring || (cache.neighboring = makeCityMatrix());

        const pairs = matrix[+code];
        if (!pairs) return;

        return indexToArray(pairs);
    }

    function makeCityMatrix(): CityMatrix {
        const all = cache.mesh || (cache.mesh = Object.keys(MESH));
        const matrix = {} as CityMatrix;

        all.forEach(mesh2 => {
            const item = MESH[mesh2] as MeshCityItem;
            const multiple = item[2] as MultipleCityMesh;
            if (!multiple) return;

            Object.keys(multiple).forEach(mesh3 => {
                const array = multiple[mesh3];
                array.forEach(code1 => {
                    const pairs = matrix[code1] || (matrix[code1] = {} as CityIndex);
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

    function findForPref(pref: number): CityCode[] | undefined {
        const all = cache.city || (cache.city = Object.keys(CITY));

        const list = cache[pref] || (cache[pref] = filterByPref(all, pref).sort());
        if (!list.length) return;

        return list.slice();
    }

    function filterByPref(array: CityCode[], pref: number): CityCode[] {
        return array.filter(city => Math.floor(+city / 1000) === +pref);
    }

    function findForMesh(mesh?: MeshCode): CityCode[] | undefined {
        if (!mesh) return;
        mesh += "";
        const len = mesh && mesh.length;
        if (len === 6) return findForMesh2(mesh);
        if (len === 8) return findForMesh3(mesh);
        return;
    }

    function findForMesh2(mesh2: MeshCode): CityCode[] | undefined {
        const item = MESH[mesh2] as MeshCityItem;
        if (!item) return;

        const city = item[0];

        // one city
        if (item.length === 1) return [c5(city)];

        // more cities
        const index = {} as CityIndex;
        add(city);

        const single = item[1] as SingleCityMesh;
        if (single) {
            Object.keys(single).forEach(mesh3 => add(single[mesh3]));
        }

        const multiple = item[2] as MultipleCityMesh;
        if (multiple) {
            Object.keys(multiple).forEach(mesh3 => multiple[mesh3].forEach(add));
        }

        return indexToArray(index);

        function add(city: number) {
            index[city] = (index[city] || 0) + 1;
        }
    }

    function findForMesh3(mesh: MeshCode): CityCode[] | undefined {
        const mesh2 = mesh.substr(0, 6);
        const mesh3 = mesh.substr(6, 2);
        const item = MESH[mesh2] as MeshCityItem;
        if (!item) return;

        const city = item[0];
        const single = item[1] as SingleCityMesh;
        const multiple = item[2] as MultipleCityMesh;

        const list = multiple[mesh3] || (single && single[mesh3] && [single[mesh3]]) || [city];
        return list.map(c5);
    }

    function getMeshForLocation(latitude: number, longitude: number): MeshCode | undefined {
        latitude *= 1.5;
        longitude -= 100;

        if (!(0 <= latitude && latitude < 100)) return;
        if (!(0 <= longitude && longitude < 100)) return;

        return c2(latitude) + c2(longitude)
            + c1(latitude * 8 % 8) + c1(longitude * 8 % 8)
            + c1(latitude * 80 % 10) + c1(longitude * 80 % 10);
    }

    function arrayToIndex(array: CityCode[]): CityIndex {
        const index = {} as CityIndex;

        array.forEach(v => index[v] = 1);

        return index;
    }

    function indexToArray(index: CityIndex): string[] {
        return Object.keys(index).map(c5).sort(sort);

        function sort(a: CityCode, b: CityCode) {
            return ((+index[b]) - (+index[a])) || ((+b) - (+a));
        }
    }
}

/**
 * @private
 */

function fixedString(length: number) {
    return (number: number | string) => (number && (number as string).length === length) ?
        (number as string) : ("00000" + (+number | 0)).substr(-length);
}
