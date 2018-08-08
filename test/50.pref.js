"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jp_city_lookup_1 = require("../lib/jp-city-lookup");
var assert = require("assert");
var FILE = __filename.split("/").pop();
describe(FILE, function () {
    it("lookup{{pref: string})", function () {
        assert(contains(jp_city_lookup_1.City.lookup({ pref: "01" }), "01101"));
        assert(contains(jp_city_lookup_1.City.lookup({ pref: "13" }), "13104"));
        assert(contains(jp_city_lookup_1.City.lookup({ pref: "27" }), "27102"));
        assert(contains(jp_city_lookup_1.City.lookup({ pref: "47" }), "47201"));
    });
    it("lookup{{pref: number})", function () {
        assert(contains(jp_city_lookup_1.City.lookup({ pref: +1 }), "01101"));
        assert(contains(jp_city_lookup_1.City.lookup({ pref: 13 }), "13104"));
        assert(contains(jp_city_lookup_1.City.lookup({ pref: 27 }), "27102"));
        assert(contains(jp_city_lookup_1.City.lookup({ pref: 47 }), "47201"));
    });
});
function contains(array, value) {
    return array && array.filter(function (_) { return (_ === value); }).length;
}
