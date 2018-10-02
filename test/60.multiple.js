"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
const jp_city_lookup_1 = require("../lib/jp-city-lookup");
const assert = require("assert");
const FILE = __filename.split("/").pop();
describe(FILE, () => {
    it("lookup({neighboring: string, pref: string})", () => {
        let array;
        // single condition
        array = jp_city_lookup_1.City.lookup({ neighboring: "13117" }).map(jp_city_lookup_1.City.name);
        assert(contains(array, "川口市"));
        assert(contains(array, "板橋区"));
        // multiple conditions
        array = jp_city_lookup_1.City.lookup({ neighboring: "13117", pref: "11" }).map(jp_city_lookup_1.City.name);
        assert(contains(array, "川口市"));
        assert(!contains(array, "板橋区"));
    });
    it("lookup({neighboring: number, pref: number})", () => {
        let array;
        // single condition
        array = jp_city_lookup_1.City.lookup({ neighboring: +13111 }).map(jp_city_lookup_1.City.name);
        assert(contains(array, "川崎市川崎区"));
        assert(contains(array, "世田谷区"));
        // multiple conditions
        array = jp_city_lookup_1.City.lookup({ neighboring: +13111, pref: +14 }).map(jp_city_lookup_1.City.name);
        assert(contains(array, "川崎市川崎区"));
        assert(!contains(array, "世田谷区"));
    });
    it("lookup({neighboring: string, ll: string})", () => {
        let array;
        // single condition
        array = jp_city_lookup_1.City.lookup({ ll: "35.68944,139.69167" }).map(jp_city_lookup_1.City.name);
        assert(contains(array, "新宿区"));
        assert(contains(array, "渋谷区"));
        assert(!contains(array, "中央区"));
        // single condition
        array = jp_city_lookup_1.City.lookup({ neighboring: "13101" }).map(jp_city_lookup_1.City.name);
        assert(contains(array, "新宿区"));
        assert(!contains(array, "渋谷区"));
        assert(contains(array, "中央区"));
        // multiple conditions
        array = jp_city_lookup_1.City.lookup({ neighboring: "13101", ll: "35.68944,139.69167" }).map(jp_city_lookup_1.City.name);
        assert(contains(array, "新宿区"));
        assert(!contains(array, "渋谷区"));
        assert(!contains(array, "中央区"));
    });
});
function contains(array, value) {
    return array && array.some(v => (v === value));
}
