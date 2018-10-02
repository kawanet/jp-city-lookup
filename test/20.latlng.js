"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
const jp_city_lookup_1 = require("../lib/jp-city-lookup");
const assert = require("assert");
const FILE = __filename.split("/").pop();
describe(FILE, () => {
    it("Sapporo", () => {
        const list = jp_city_lookup_1.City.lookup({ ll: "43.06417,141.34694" });
        assert(contains(list, "01101"));
    });
    it("Tokyo", () => {
        const list = jp_city_lookup_1.City.lookup({ lat: 35.68944, lng: 139.69167 });
        assert(contains(list, "13104"));
    });
    it("Osaka", () => {
        const list = jp_city_lookup_1.City.lookup({ ll: "34.68639,135.52" });
        assert(contains(list, "27102"));
    });
    it("Naha", () => {
        const list = jp_city_lookup_1.City.lookup({ lat: 26.2125, lng: 127.68111 });
        assert(contains(list, "47201"));
    });
    it("Mt.Fuji", () => {
        const list = jp_city_lookup_1.City.lookup({ ll: "35.3606,138.7278" });
        assert(contains(list, "19202")); // 山梨県富士吉田市
        assert(contains(list, "22207")); // 静岡県富士宮市
    });
});
function contains(array, value) {
    return array && array.some(v => (v === value));
}
