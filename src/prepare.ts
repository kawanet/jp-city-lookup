// prepare.ts

import {all} from "jp-grid-square-master";
import {createWriteStream} from "fs";

const WARN = message => console.warn(message);

async function CLI(meshJson, cityJson) {
	const mesh1 = {};
	const mesh2 = {};
	const meshIndex = {};
	const nameIndex = {};

	await all({
		progress: WARN,

		each: ([city, name, code]) => {
			const code2 = code.substr(0, 6);
			const code3 = code.substr(6);

			const idx2 = mesh2[code2] || (mesh2[code2] = {});
			idx2[city] = (idx2[city] || 0) + 1;

			const idx1 = mesh1[code2] || (mesh1[code2] = {});
			const list3 = idx1[code3] || (idx1[code3] = {});
			list3[+city] = 1;

			if (!nameIndex[city]) {
				nameIndex[city] = name.replace(/^.+(支庁|(総合)?振興局)/, "");
			}
		}
	});

	const list2 = Object.keys(mesh2);
	WARN("level 2: " + list2.length + " mesh");
	list2.forEach(code2 => {
		const idx2 = mesh2[code2];
		const array = Object.keys(idx2).sort((a, b) => {
			return ((idx2[b] - idx2[a]) || ((+b) - (+a)));
		});
		const city = mesh2[code2] = +array[0];

		const item: Array<number | object> = meshIndex[code2] = [city];
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

	json = JSON.stringify({mesh: meshIndex});
	json = json.replace(/("\d{6}":)/g, "\n$1");
	write(meshJson, json);

	json = JSON.stringify({city: nameIndex});
	json = json.replace(/("\d+":)/g, "\n$1");
	write(cityJson, json);
}

function write(file, json) {
	if (file) {
		WARN("writing: " + file);
		createWriteStream(file).write(json);
	} else {
		process.stdout.write(json);
	}
}

CLI.apply(null, process.argv.slice(2));
