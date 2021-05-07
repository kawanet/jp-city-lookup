// prepare

import * as fs from "fs";
import * as iconv from "iconv-lite";
import {dirname, files} from "jp-data-mesh-csv";

const WARN = (message: string) => console.warn(message);

type HitIndex1 = { [key: string]: number };
type HitIndex2 = { [key: string]: HitIndex1 };
type HitIndex3 = { [key: string]: HitIndex2 };

type SingleCityMesh = { [mesh: string]: number };
type MultipleCityMesh = { [mesh: string]: number[] };
type MeshCityItem = [number, SingleCityMesh?, MultipleCityMesh?];
type MeshCityMaster = { [mesh: string]: MeshCityItem };

type CityNameMaster = { [city: string]: string };

function CLI(meshJson: string, cityJson: string) {
    const lv23Index = {} as HitIndex3;
    const lv2Index = {} as HitIndex2;
    const meshIndex = {} as MeshCityMaster;
    const nameIndex = {} as CityNameMaster;

    // STEP #1

    for (const name of files) {
        const file = `${dirname}/${name}`;
        WARN("reading: " + file);

        const binary = fs.readFileSync(file, null);

        const data = iconv.decode(binary, "CP932");

        const rows = data.split(/\r?\n/).map(line => line.split(",").map(col => col.replace(/^"(.*)"$/, "$1")));

        for (const row of rows) {
            const [city, name, code] = row;

            if (!+city) continue;
            if (name.search(/境界未定/) > -1) continue;

            const code2 = code.substr(0, 6);
            const code3 = code.substr(6);

            const lv2Cities = lv2Index[code2] || (lv2Index[code2] = {} as HitIndex1);
            lv2Cities[city] = (lv2Cities[city] || 0) + 1;

            const lv3Index = lv23Index[code2] || (lv23Index[code2] = {} as HitIndex2);
            const lv3Cities = lv3Index[code3] || (lv3Index[code3] = {} as HitIndex1);
            lv3Cities[+city] = 1;

            if (!nameIndex[city]) {
                nameIndex[city] = name.replace(/^.+(支庁|(総合)?振興局)/, "");
            }
        }
    }

    // STEP #2

    for (const code2 in lv2Index) {
        const lv2Cities = lv2Index[code2] as HitIndex1;
        const sorter = (a: string, b: string) => (((+lv2Cities[b]) - (+lv2Cities[a])) || ((+b) - (+a)));
        const array = Object.keys(lv2Cities).sort(sorter);

        // the most major city in the level 2 mesh
        const city = +array[0];
        const item = meshIndex[code2] = [city] as MeshCityItem;

        // the level 2 mesh has just one city
        if (array.length < 2) continue;

        // the level 2 mesh has multiple cities
        const single = {} as SingleCityMesh;
        const multi = {} as MultipleCityMesh;
        item.push(single, multi);

        const lv3Index = lv23Index[code2] as HitIndex2;
        for (const code3 in lv3Index) {
            const list3 = Object.keys(lv3Index[code3]).map(v => +v);

            if (list3.length > 1) {
                // the level 3 mesh has multiple cities
                multi[code3] = list3;
            } else if (list3[0] !== city) {
                // the level 3 mesh has just one city
                single[code3] = list3[0];
            }
        }
    }

    // STEP #3

    let json;

    // mesh.json
    json = JSON.stringify({mesh: meshIndex});
    json = json.replace(/("\d{6}":)/g, "\n$1");
    write(meshJson, json);

    // city.json
    json = JSON.stringify({city: nameIndex});
    json = json.replace(/("\d+":)/g, "\n$1");
    write(cityJson, json);
}

function write(file: string, json: string) {
    if (file) {
        WARN("writing: " + file);
        fs.createWriteStream(file).write(json);
    } else {
        process.stdout.write(json);
    }
}

CLI.apply(null, process.argv.slice(2));
