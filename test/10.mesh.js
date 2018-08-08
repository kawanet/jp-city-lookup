"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jp_city_lookup_1 = require("../lib/jp-city-lookup");
var assert = require("assert");
var FILE = __filename.split("/").pop();
describe(FILE, function () {
    it("lookup({mesh: 533946})", function () {
        var list = jp_city_lookup_1.City.lookup({ mesh: "533946" });
        assert(contains(list, "13101"));
        assert(contains(list, "13107"));
    });
    it("lookup({mesh: 53393680})", function () {
        var list = jp_city_lookup_1.City.lookup({ mesh: "53393680" });
        assert(contains(list, "13102"));
        assert(contains(list, "13103"));
    });
});
function contains(array, value) {
    return array.filter(function (_) { return (_ === value); }).length;
}
