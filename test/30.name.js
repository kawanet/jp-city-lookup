"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
const jp_city_lookup_1 = require("../lib/jp-city-lookup");
const assert = require("assert");
const FILE = __filename.split("/").pop();
describe(FILE, () => {
    it("name(string)", () => {
        assert.strictEqual(jp_city_lookup_1.City.name("01101"), "札幌市中央区");
        assert.strictEqual(jp_city_lookup_1.City.name("13104"), "新宿区");
        assert.strictEqual(jp_city_lookup_1.City.name("27102"), "大阪市都島区");
        assert.strictEqual(jp_city_lookup_1.City.name("47201"), "那覇市");
    });
    it("name(number)", () => {
        assert.strictEqual(jp_city_lookup_1.City.name(+1103), "札幌市東区");
        assert.strictEqual(jp_city_lookup_1.City.name(13103), "港区");
        assert.strictEqual(jp_city_lookup_1.City.name(27103), "大阪市福島区");
        assert.strictEqual(jp_city_lookup_1.City.name(47205), "宜野湾市");
    });
});
