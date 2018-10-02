"use strict";

import "mocha";
import {City} from "../lib/jp-city-lookup";

const assert = require("assert");
const FILE = __filename.split("/").pop() as string;

describe(FILE, () => {
    it("lookup{{pref: string})", () => {
        assert(contains(City.lookup({pref: "01"}), "01101"));
        assert(contains(City.lookup({pref: "13"}), "13104"));
        assert(contains(City.lookup({pref: "27"}), "27102"));
        assert(contains(City.lookup({pref: "47"}), "47201"));
    });

    it("lookup{{pref: number})", () => {
        assert(contains(City.lookup({pref: +1}), "01101"));
        assert(contains(City.lookup({pref: 13}), "13104"));
        assert(contains(City.lookup({pref: 27}), "27102"));
        assert(contains(City.lookup({pref: 47}), "47201"));
    });
});

function contains(array, value) {
    return array && array.filter(_ => (_ === value)).length;
}