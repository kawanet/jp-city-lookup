"use strict";
// prepare
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const iconv = require("iconv-lite");
const jp_data_mesh_csv_1 = require("jp-data-mesh-csv");
const WARN = (message) => console.warn(message);
function CLI(meshJson, cityJson) {
    const lv23Index = {};
    const lv2Index = {};
    const meshIndex = {};
    const nameIndex = {};
    // STEP #1
    for (const name of jp_data_mesh_csv_1.files) {
        const file = "./node_modules/jp-data-mesh-csv/" + name;
        WARN("reading: " + file);
        const binary = fs.readFileSync(file, null);
        const data = iconv.decode(binary, "CP932");
        const rows = data.split(/\r?\n/).map(line => line.split(",").map(col => col.replace(/^"(.*)"$/, "$1")));
        for (const row of rows) {
            const [city, name, code] = row;
            if (!+city)
                continue;
            if (name.search(/境界未定/) > -1)
                continue;
            const code2 = code.substr(0, 6);
            const code3 = code.substr(6);
            const lv2Cities = lv2Index[code2] || (lv2Index[code2] = {});
            lv2Cities[city] = (lv2Cities[city] || 0) + 1;
            const lv3Index = lv23Index[code2] || (lv23Index[code2] = {});
            const lv3Cities = lv3Index[code3] || (lv3Index[code3] = {});
            lv3Cities[+city] = 1;
            if (!nameIndex[city]) {
                nameIndex[city] = name.replace(/^.+(支庁|(総合)?振興局)/, "");
            }
        }
    }
    // STEP #2
    for (const code2 in lv2Index) {
        const lv2Cities = lv2Index[code2];
        const sorter = (a, b) => (((+lv2Cities[b]) - (+lv2Cities[a])) || ((+b) - (+a)));
        const array = Object.keys(lv2Cities).sort(sorter);
        // the most major city in the level 2 mesh
        const city = +array[0];
        const item = meshIndex[code2] = [city];
        // the level 2 mesh has just one city
        if (array.length < 2)
            continue;
        // the level 2 mesh has multiple cities
        const single = {};
        const multi = {};
        item.push(single, multi);
        const lv3Index = lv23Index[code2];
        for (const code3 in lv3Index) {
            const list3 = Object.keys(lv3Index[code3]).map(v => +v);
            if (list3.length > 1) {
                // the level 3 mesh has multiple cities
                multi[code3] = list3;
            }
            else if (list3[0] !== city) {
                // the level 3 mesh has just one city
                single[code3] = list3[0];
            }
        }
    }
    // STEP #3
    let json;
    // mesh.json
    json = JSON.stringify({ mesh: meshIndex });
    json = json.replace(/("\d{6}":)/g, "\n$1");
    write(meshJson, json);
    // city.json
    json = JSON.stringify({ city: nameIndex });
    json = json.replace(/("\d+":)/g, "\n$1");
    write(cityJson, json);
}
function write(file, json) {
    if (file) {
        WARN("writing: " + file);
        fs.createWriteStream(file).write(json);
    }
    else {
        process.stdout.write(json);
    }
}
CLI.apply(null, process.argv.slice(2));
