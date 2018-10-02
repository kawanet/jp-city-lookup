// prepare.ts

import * as fs from "fs";
import * as iconv from "iconv-lite";
import {files} from "jp-data-mesh-csv";

const WARN = (message: string) => console.warn(message);

type HitIndex1 = { [key: string]: number };
type HitIndex2 = { [key: string]: HitIndex1 };
type HitIndex3 = { [key: string]: HitIndex2 };

type CityCode = string;

type SingleCityMesh = { [mesh: string]: number };
type MultipleCityMesh = { [mesh: string]: number[] };
type MeshCityItem = [number, SingleCityMesh?, MultipleCityMesh?];
type MeshCityMaster = { [mesh: string]: MeshCityItem };

type CityNameMaster = { [city: string]: string };

function CLI(meshJson: string, cityJson: string) {
    const indexA3 = {} as HitIndex3;
    const indexB2 = {} as HitIndex2;
    const meshIndex = {} as MeshCityMaster;
    const nameIndex = {} as CityNameMaster;

    files.forEach(name => {
        const file = "./node_modules/jp-data-mesh-csv/" + name;
        WARN("reading: " + file);

        const binary = fs.readFileSync(file, null);

        const data = iconv.decode(binary, "CP932");

        const rows = data.split(/\r?\n/).map(line => line.split(",").map(col => col.replace(/^"(.*)"$/, "$1")));

        rows.forEach(([city, name, code]) => {
            if (!+city) return;
            if (name.search(/境界未定/) > -1) return;

            const code2 = code.substr(0, 6);
            const code3 = code.substr(6);

            const indexB1 = indexB2[code2] || (indexB2[code2] = {} as HitIndex1);
            indexB1[city] = (indexB1[city] || 0) + 1;

            const indexA2 = indexA3[code2] || (indexA3[code2] = {} as HitIndex2);
            const indexA1 = indexA2[code3] || (indexA2[code3] = {} as HitIndex1);
            indexA1[+city] = 1;

            if (!nameIndex[city]) {
                nameIndex[city] = name.replace(/^.+(支庁|(総合)?振興局)/, "");
            }
        });
    });

    const list2 = Object.keys(indexB2);
    list2.forEach(code2 => {
        const indexB1 = indexB2[code2] as HitIndex1;
        const array = Object.keys(indexB1).sort((a: CityCode, b: CityCode) => {
            return (((+indexB1[b]) - (+indexB1[a])) || ((+b) - (+a)));
        });
        const city = +array[0];

        const item = meshIndex[code2] = [city] as MeshCityItem;
        if (array.length < 2) return;

        const single = {} as SingleCityMesh;
        const multi = {} as MultipleCityMesh;
        item.push(single, multi);

        const indexA2 = indexA3[code2] as HitIndex2;
        Object.keys(indexA2).forEach(code3 => {
            const list3 = Object.keys(indexA2[code3]).map(v => +v);
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

function write(file: string, json: string) {
    if (file) {
        WARN("writing: " + file);
        fs.createWriteStream(file).write(json);
    } else {
        process.stdout.write(json);
    }
}

CLI.apply(null, process.argv.slice(2));
