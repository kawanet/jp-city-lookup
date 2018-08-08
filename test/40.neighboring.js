"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jp_city_lookup_1 = require("../lib/jp-city-lookup");
var assert = require("assert");
var FILE = __filename.split("/").pop();
describe(FILE, function () {
    it("lookup({neighboring: string})", function () {
        assert(contains(jp_city_lookup_1.City.lookup({ neighboring: "01101" }).map(jp_city_lookup_1.City.name), "札幌市北区"));
        assert(contains(jp_city_lookup_1.City.lookup({ neighboring: "13101" }).map(jp_city_lookup_1.City.name), "中央区"));
        assert(contains(jp_city_lookup_1.City.lookup({ neighboring: "27127" }).map(jp_city_lookup_1.City.name), "大阪市中央区"));
        assert(contains(jp_city_lookup_1.City.lookup({ neighboring: "47201" }).map(jp_city_lookup_1.City.name), "浦添市"));
    });
    it("lookup({neighboring: number})", function () {
        assert(contains(jp_city_lookup_1.City.lookup({ neighboring: +1102 }).map(jp_city_lookup_1.City.name), "札幌市中央区"));
        assert(contains(jp_city_lookup_1.City.lookup({ neighboring: +13102 }).map(jp_city_lookup_1.City.name), "千代田区"));
        assert(contains(jp_city_lookup_1.City.lookup({ neighboring: +27128 }).map(jp_city_lookup_1.City.name), "大阪市北区"));
        assert(contains(jp_city_lookup_1.City.lookup({ neighboring: +47208 }).map(jp_city_lookup_1.City.name), "那覇市"));
    });
});
function contains(array, value) {
    return array && array.filter(function (_) { return (_ === value); }).length;
}
