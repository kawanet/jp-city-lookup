"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
const jp_city_lookup_1 = require("../lib/jp-city-lookup");
const assert = require("assert");
const FILE = __filename.split("/").pop();
describe(FILE, () => {
    it("lookup{{pref: string})", () => {
        assert(contains(jp_city_lookup_1.City.lookup({ pref: "01" }), "01101"));
        assert(contains(jp_city_lookup_1.City.lookup({ pref: "13" }), "13104"));
        assert(contains(jp_city_lookup_1.City.lookup({ pref: "27" }), "27102"));
        assert(contains(jp_city_lookup_1.City.lookup({ pref: "47" }), "47201"));
    });
    it("lookup{{pref: number})", () => {
        assert(contains(jp_city_lookup_1.City.lookup({ pref: +1 }), "01101"));
        assert(contains(jp_city_lookup_1.City.lookup({ pref: 13 }), "13104"));
        assert(contains(jp_city_lookup_1.City.lookup({ pref: 27 }), "27102"));
        assert(contains(jp_city_lookup_1.City.lookup({ pref: 47 }), "47201"));
    });
});
function contains(array, value) {
    return array && array.some(v => (v === value));
}
