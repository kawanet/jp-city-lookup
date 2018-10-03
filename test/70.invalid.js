"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
const jp_city_lookup_1 = require("../lib/jp-city-lookup");
const assert = require("assert");
const FILE = __filename.split("/").pop();
describe(FILE, () => {
    const test = (title, options) => {
        it(title, () => {
            const list = jp_city_lookup_1.City.lookup(options);
            assert(Array.isArray(list));
            assert.strictEqual(list.length, 0);
        });
    };
    test('lookup()');
    test('lookup({})', {});
    test('lookup({mesh: "XXXXXXXX"})', { mesh: "XXXXXXXX" });
    test('lookup({ll: "lat,lng"})', { ll: "lat,lng" });
    test('lookup({neighboring: "XXXXX"})', { neighboring: "XXXXX" });
    test('lookup({pref: "XX"})', { pref: "XX" });
});
