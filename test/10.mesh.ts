"use strict";

import "mocha";
import {strict as assert} from "assert";
import {City} from "../";

const FILE = __filename.split("/").pop() as string;

describe(FILE, () => {
    it("lookup({mesh: 533946})", () => {
        const list = City.lookup({mesh: "533946"});
        assert.ok(contains(list, "13101"));
        assert.ok(contains(list, "13107"));
    });

    it("lookup({mesh: 53393680})", () => {
        const list = City.lookup({mesh: "53393680"});
        assert.ok(contains(list, "13102"));
        assert.ok(contains(list, "13103"));
    });
});

function contains(array: any[], value: string): boolean {
    return array && array.some(v => (v === value));
}