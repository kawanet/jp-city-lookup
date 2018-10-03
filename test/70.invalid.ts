"use strict";

import "mocha";
import {City, LookupOptions} from "../lib/jp-city-lookup";

const assert = require("assert");
const FILE = __filename.split("/").pop() as string;

describe(FILE, () => {

    const test = (title: string, options?: LookupOptions) => {
        it(title, () => {
            const list = City.lookup(options!);
            assert(Array.isArray(list));
            assert.strictEqual(list.length, 0);
        });
    };

    test('lookup()');

    test('lookup({})', {});

    test('lookup({mesh: "XXXXXXXX"})', {mesh: "XXXXXXXX"});

    test('lookup({ll: "lat,lng"})', {ll: "lat,lng"});

    test('lookup({neighboring: "XXXXX"})', {neighboring: "XXXXX"});

    test('lookup({pref: "XX"})', {pref: "XX"});
});
