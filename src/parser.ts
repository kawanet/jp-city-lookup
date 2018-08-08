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
	const meshIndex = {};
	const nameIndex = {};
	let initialized;

	export function init() {
		if (initialized) return promisen.resolve();

		return readCSV(NAMES).then(array => {
			array.forEach(row => {
				// ignore header row
				if (!(+row[0])) return;

				const city = row[0];
				const array = meshIndex[city] || (meshIndex[city] = []);
				array.push(row[2]);

				// city code -> name
				if (!nameIndex[city]) {
					nameIndex[city] = row[1].replace(/^.+(支庁|(総合)?振興局)/, "");
				}
			});

			initialized = true;
		});
	}

	/**
	 * @return {string[]} array of JIS city codes
	 */

	export function all(): string[] {
		return Object.keys(nameIndex).sort();
	}

	/**
	 * @param {string} city - JIS city code
	 * @return {string[]} array of mesh codes for the city
	 */

	export function mesh(city: string): string[] {
		return meshIndex[city];
	}

	/**
	 * @param {string} city - JIS city code
	 * @return {string} name of the city
	 */

	export function name(city: string): string {
		return nameIndex[city];
	}

	/**
	 * read all CSV files
	 */

	function readCSV(names) {
		let all = [];

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