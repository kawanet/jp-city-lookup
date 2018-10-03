"use strict";

import "mocha";
import {City} from "../lib/jp-city-lookup";

const assert = require("assert");
const FILE = __filename.split("/").pop() as string;

describe(FILE, () => {
    it("lookup({mesh: 533946})", () => {
        const list = City.lookup({mesh: "533946"});
        assert(contains(list, "13101"));
        assert(contains(list, "13107"));
    });

    it("lookup({mesh: 53393680})", () => {
        const list = City.lookup({mesh: "53393680"});
        assert(contains(list, "13102"));
        assert(contains(list, "13103"));
    });
});

function contains(array: any[], value: string): boolean {
    return array && array.some(v => (v === value));
}