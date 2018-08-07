// parser.ts

import axios from "axios"
import * as fs from "fs"
import * as iconv from "iconv-lite"
import * as promisen from "promisen"
import {Logger} from "./logger";

const BASE_DIR = __dirname.replace(/[^\/]*\/*$/, "");
const LOCAL_CSV = BASE_DIR + "csv/";
const REMOVE_CSV = "http://www.stat.go.jp/data/mesh/csv/";
const CSV_SUFFIX = ".csv";

const NAMES = [
	"01-1", "01-2", "01-3", "02", "03", "04", "05", "06", "07", "08", "09",
	"10", "11", "12", "13", "14", "15", "16", "17", "18", "19",
	"20", "21", "22", "23", "24", "25", "26", "27", "28", "29",
	"30", "31", "32", "33", "34", "35", "36", "37", "38", "39",
	"40", "41", "42", "43", "44", "45", "46", "47"
];

const readFile = promisen.denodeify(fs.readFile.bind(fs));
const writeFile = promisen.denodeify(fs.writeFile.bind(fs));
const access = promisen.denodeify(fs.access.bind(fs));

export module Parser
{
	export function parse(names?: string[]) {
		const mesh1 = {};
		const mesh2 = {};
		const cities = {};

		return readCSV(names).then(array => {
			array.forEach(row => {
				// header row
				if (!(+row[0])) return;

				const city = row[0];
				const code = row[2];
				const code2 = code.substr(0, 6);
				const code3 = code.substr(6);

				const idx2 = mesh2[code2] || (mesh2[code2] = {});
				idx2[city] = (idx2[city] || 0) + 1;

				const idx1 = mesh1[code2] || (mesh1[code2] = {});
				const list3 = idx1[code3] || (idx1[code3] = {});
				list3[+city] = 1;

				// city code -> name
				if (!cities[city]) {
					cities[city] = row[1].replace(/^.+(支庁|(総合)?振興局)/, "");
				}
			});
		}).then(() => {
			const mesh = {};

			Object.keys(mesh2).forEach(code2 => {
				const idx2 = mesh2[code2];
				const array = Object.keys(idx2).sort((a, b) => {
					return ((idx2[b] - idx2[a]) || ((+b) - (+a)));
				});
				const city = mesh2[code2] = +array[0];

				const single = {};
				const multi = {};
				const item: Array<number | object> = mesh[code2] = [city];
				if (array.length < 2) return;

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

			return {mesh: mesh, city: cities};
		});
	}

	/**
	 * read all CSV files
	 */

	function readCSV(names) {
		let all = [];

		// read all files when the argument not given
		if (!names) names = NAMES;

		return promisen.eachSeries(names, it)().then(() => all);

		function it(name) {
			return loadFile(name)
				.then(decodeCP932)
				.then(parseCSV)
				.then(array => {
					all = all.concat(array);
				});
		}
	}

	/**
	 * load CSV file from local cache, or from remote
	 */

	function loadFile(name) {
		const file = LOCAL_CSV + name + CSV_SUFFIX;

		// check whether local cache file available
		return access(file).catch(() => {
			// fetch from remote when cache unavailable
			const url = REMOVE_CSV + name + CSV_SUFFIX;
			Logger.log("loading: " + url);
			return fetchFile(url).then(data => {
				Logger.log("writing: " + file + " (" + data.length + " bytes)");
				return writeFile(file, data);
			});
		}).then(() => {
			// read from local when cache available
			Logger.log("reading: " + file);
			return readFile(file);
		});
	}

	/**
	 * fetch CSV file from remote
	 */

	function fetchFile(url) {
		const req = {
			method: "GET",
			url: url,
			responseType: "arraybuffer"
		};

		return axios(req).then(res => res.data);
	}

	/**
	 * decode CP932
	 */

	function decodeCP932(data) {
		return iconv.decode(data, "CP932");
	}

	/**
	 * parse CSV file
	 */

	function parseCSV(data) {
		return data.split(/\r?\n/)
			.filter(line => !!line)
			.map(line => line.split(",")
				.map(col => col.replace(/^"(.*)"/, "$1")));
	}
}