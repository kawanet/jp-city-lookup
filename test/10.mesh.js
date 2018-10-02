"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
const jp_city_lookup_1 = require("../lib/jp-city-lookup");
const assert = require("assert");
const FILE = __filename.split("/").pop();
describe(FILE, () => {
    it("lookup({mesh: 533946})", () => {
        const list = jp_city_lookup_1.City.lookup({ mesh: "533946" });
        assert(contains(list, "13101"));
        assert(contains(list, "13107"));
    });
    it("lookup({mesh: 53393680})", () => {
        const list = jp_city_lookup_1.City.lookup({ mesh: "53393680" });
        assert(contains(list, "13102"));
        assert(contains(list, "13103"));
    });
});
function contains(array, value) {
    return array && array.some(v => (v === value));
}
