"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jp_city_lookup_1 = require("../lib/jp-city-lookup");
var assert = require("assert");
var FILE = __filename.split("/").pop();
describe(FILE, function () {
    it("Sapporo", function () {
        var list = jp_city_lookup_1.City.lookup({ ll: "43.06417,141.34694" });
        assert(contains(list, "01101"));
    });
    it("Tokyo", function () {
        var list = jp_city_lookup_1.City.lookup({ lat: 35.68944, lng: 139.69167 });
        assert(contains(list, "13104"));
    });
    it("Osaka", function () {
        var list = jp_city_lookup_1.City.lookup({ ll: "34.68639,135.52" });
        assert(contains(list, "27102"));
    });
    it("Naha", function () {
        var list = jp_city_lookup_1.City.lookup({ lat: 26.2125, lng: 127.68111 });
        assert(contains(list, "47201"));
    });
    it("Mt.Fuji", function () {
        var list = jp_city_lookup_1.City.lookup({ ll: "35.3606,138.7278" });
        assert(contains(list, "19202")); // 山梨県富士吉田市
        assert(contains(list, "22207")); // 静岡県富士宮市
    });
});
function contains(array, value) {
    return array.filter(function (_) { return (_ === value); }).length;
}
