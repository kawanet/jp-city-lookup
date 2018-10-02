"use strict";

import "mocha";
import {City} from "../lib/jp-city-lookup";

const assert = require("assert");
const FILE = __filename.split("/").pop() as string;

describe(FILE, () => {
    it("name(string)", () => {
        assert.strictEqual(City.name("01101"), "札幌市中央区");
        assert.strictEqual(City.name("13104"), "新宿区");
        assert.strictEqual(City.name("27102"), "大阪市都島区");
        assert.strictEqual(City.name("47201"), "那覇市");
    });

    it("name(number)", () => {
        assert.strictEqual(City.name(+1103), "札幌市東区");
        assert.strictEqual(City.name(13103), "港区");
        assert.strictEqual(City.name(27103), "大阪市福島区");
        assert.strictEqual(City.name(47205), "宜野湾市");
    });
});
