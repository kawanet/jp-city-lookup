// prepare.ts

import * as fs from "fs";
import {Parser} from "./parser";
import {Logger} from "./logger";

const BASE_DIR = __dirname.replace(/[^\/]*\/*$/, "");
const MESH = BASE_DIR + "dist/mesh.json";
const CITY = BASE_DIR + "dist/city.json";

function CLI() {
	return Parser.init().then(() => {
		const mesh1 = {};
		const mesh2 = {};
		const names = {};

		Parser.all().forEach(city => {
			names[city] = Parser.name(city);

			Parser.mesh(city).forEach(code => {
				const code2 = code.substr(0, 6);
				const code3 = code.substr(6);

				const idx2 = mesh2[code2] || (mesh2[code2] = {});
				idx2[city] = (idx2[city] || 0) + 1;

				const idx1 = mesh1[code2] || (mesh1[code2] = {});
				const list3 = idx1[code3] || (idx1[code3] = {});
				list3[+city] = 1;
			});
		});

		const mesh = {};

		Object.keys(mesh2).forEach(code2 => {
			const idx2 = mesh2[code2];
			const array = Object.keys(idx2).sort((a, b) => {
				return ((idx2[b] - idx2[a]) || ((+b) - (+a)));
			});
			const city = mesh2[code2] = +array[0];

			const item: Array<number | object> = mesh[code2] = [city];
			if (array.length < 2) return;

			const single = {};
			const multi = {};
			item.push(single, multi);

			const idx1 = mesh1[code2];
			Object.keys(idx1).forEach(code3 => {
				const list3 = Object.keys(idx1[code3]).map(v => +v);
				if (list3.length > 1) {
					multi[code3] = list3;
				} else if (list3[0] !== city) {
					single[code3] = list3[0];
				}
			});
		});

		let json;

		json = JSON.stringify({mesh: mesh});
		json = json.replace(/("\d{6}":)/g, "\n$1");
		Logger.warn("writing:", MESH);
		fs.writeFileSync(MESH, json);

		json = JSON.stringify({city: names});
		json = json.replace(/("\d+":)/g, "\n$1");
		Logger.warn("writing:", CITY);
		fs.writeFileSync(CITY, json);
	});
}

CLI();
