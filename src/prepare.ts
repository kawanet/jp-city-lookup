// prepare.ts

import * as fs from "fs";
import {Parser} from "./parser";
import {Logger} from "./logger";

const BASE_DIR = __dirname.replace(/[^\/]*\/*$/, "");
const MESH = BASE_DIR + "dist/mesh.json";
const CITY = BASE_DIR + "dist/city.json";

function CLI() {
	Parser.parse().then(data => {
		let json;

		json = JSON.stringify({mesh: data.mesh});
		json = json.replace(/("\d{6}":)/g, "\n$1");
		Logger.log("writing:", MESH);
		fs.writeFileSync(MESH, json);

		json = JSON.stringify({city: data.city});
		json = json.replace(/("\d+":)/g, "\n$1");
		Logger.log("writing:", CITY);
		fs.writeFileSync(CITY, json);
	});
}

CLI();
