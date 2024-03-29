"use strict";

import "mocha";
import {strict as assert} from "assert";
import {City} from "../";

const FILE = __filename.split("/").pop() as string;

describe(FILE, () => {
    it("lookup({neighboring: string})", function () {
        this.timeout(10000);

        assert.ok(contains(City.lookup({neighboring: "01101"}).map(City.name), "札幌市北区"));
        assert.ok(contains(City.lookup({neighboring: "13101"}).map(City.name), "中央区"));
        assert.ok(contains(City.lookup({neighboring: "27127"}).map(City.name), "大阪市中央区"));
        assert.ok(contains(City.lookup({neighboring: "47201"}).map(City.name), "浦添市"));
    });

    it("lookup({neighboring: number})", () => {
        assert.ok(contains(City.lookup({neighboring: +1102}).map(City.name), "札幌市中央区"));
        assert.ok(contains(City.lookup({neighboring: +13102}).map(City.name), "千代田区"));
        assert.ok(contains(City.lookup({neighboring: +27128}).map(City.name), "大阪市北区"));
        assert.ok(contains(City.lookup({neighboring: +47208}).map(City.name), "那覇市"));
    });
});

function contains(array: any[], value: string): boolean {
    return array && array.some(v => (v === value));
}