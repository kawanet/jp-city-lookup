"use strict";

import {City} from "../lib/jp-city-lookup";

const assert = require("assert");
const FILE = __filename.split("/").pop();

describe(FILE, () => {
	it("Sapporo", () => {
		const list = City.lookup({ll: "43.06417,141.34694"});
		assert(contains(list, "01101"));
	});

	it("Tokyo", () => {
		const list = City.lookup({lat: 35.68944, lng: 139.69167});
		assert(contains(list, "13104"));
	});

	it("Osaka", () => {
		const list = City.lookup({ll: "34.68639,135.52"});
		assert(contains(list, "27102"));
	});

	it("Naha", () => {
		const list = City.lookup({lat: 26.2125, lng: 127.68111});
		assert(contains(list, "47201"));
	});
});

function contains(array, value) {
	return array.filter(_ => (_ === value)).length;
}