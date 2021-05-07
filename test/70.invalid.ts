"use strict";

import "mocha";
import {strict as assert} from "assert";
import {City, LookupOptions} from "../";

const FILE = __filename.split("/").pop() as string;

describe(FILE, () => {

    const test = (title: string, options?: LookupOptions) => {
        it(title, () => {
            const list = City.lookup(options!);
            assert.ok(Array.isArray(list));
            assert.equal(list.length, 0);
        });
    };

    test('lookup()');

    test('lookup({})', {});

    test('lookup({mesh: "XXXXXXXX"})', {mesh: "XXXXXXXX"});

    test('lookup({ll: "lat,lng"})', {ll: "lat,lng"});

    test('lookup({neighboring: "XXXXX"})', {neighboring: "XXXXX"});

    test('lookup({pref: "XX"})', {pref: "XX"});
});
