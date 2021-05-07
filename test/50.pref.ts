"use strict";

import "mocha";
import {strict as assert} from "assert";
import {City} from "../";

const FILE = __filename.split("/").pop() as string;

describe(FILE, () => {
    it("lookup{{pref: string})", () => {
        assert.ok(contains(City.lookup({pref: "01"}), "01101"));
        assert.ok(contains(City.lookup({pref: "13"}), "13104"));
        assert.ok(contains(City.lookup({pref: "27"}), "27102"));
        assert.ok(contains(City.lookup({pref: "47"}), "47201"));
    });

    it("lookup{{pref: number})", () => {
        assert.ok(contains(City.lookup({pref: +1}), "01101"));
        assert.ok(contains(City.lookup({pref: 13}), "13104"));
        assert.ok(contains(City.lookup({pref: 27}), "27102"));
        assert.ok(contains(City.lookup({pref: 47}), "47201"));
    });
});

function contains(array: any[], value: string): boolean {
    return array && array.some(v => (v === value));
}