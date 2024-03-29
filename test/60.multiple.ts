"use strict";

import "mocha";
import {strict as assert} from "assert";
import {City} from "../";

const FILE = __filename.split("/").pop() as string;

describe(FILE, () => {
    it("lookup({neighboring: string, pref: string})", () => {
        let array;

        // single condition
        array = City.lookup({neighboring: "13117"}).map(City.name);
        assert.ok(contains(array, "川口市"));
        assert.ok(contains(array, "板橋区"));

        // multiple conditions
        array = City.lookup({neighboring: "13117", pref: "11"}).map(City.name);
        assert.ok(contains(array, "川口市"));
        assert.ok(!contains(array, "板橋区"));
    });

    it("lookup({neighboring: number, pref: number})", () => {
        let array;

        // single condition
        array = City.lookup({neighboring: +13111}).map(City.name);
        assert.ok(contains(array, "川崎市川崎区"));
        assert.ok(contains(array, "世田谷区"));

        // multiple conditions
        array = City.lookup({neighboring: +13111, pref: +14}).map(City.name);
        assert.ok(contains(array, "川崎市川崎区"));
        assert.ok(!contains(array, "世田谷区"));
    });

    it("lookup({neighboring: string, ll: string})", () => {
        let array;

        // single condition
        array = City.lookup({ll: "35.68944,139.69167"}).map(City.name);
        assert.ok(contains(array, "新宿区"));
        assert.ok(contains(array, "渋谷区"));
        assert.ok(!contains(array, "中央区"));

        // single condition
        array = City.lookup({neighboring: "13101"}).map(City.name);
        assert.ok(contains(array, "新宿区"));
        assert.ok(!contains(array, "渋谷区"));
        assert.ok(contains(array, "中央区"));

        // multiple conditions
        array = City.lookup({neighboring: "13101", ll: "35.68944,139.69167"}).map(City.name);
        assert.ok(contains(array, "新宿区"));
        assert.ok(!contains(array, "渋谷区"));
        assert.ok(!contains(array, "中央区"));
    });
});

function contains(array: any[], value: string): boolean {
    return array && array.some(v => (v === value));
}