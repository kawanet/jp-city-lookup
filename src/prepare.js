"use strict";
// prepare.ts
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var iconv = require("iconv-lite");
var jp_data_mesh_csv_1 = require("jp-data-mesh-csv");
var WARN = function (message) { return console.warn(message); };
function CLI(meshJson, cityJson) {
    var mesh1 = {};
    var mesh2 = {};
    var meshIndex = {};
    var nameIndex = {};
    jp_data_mesh_csv_1.files.forEach(function (name) {
        var file = "./node_modules/jp-data-mesh-csv/" + name;
        WARN("reading: " + file);
        var binary = fs.readFileSync(file, null);
        var data = iconv.decode(binary, "CP932");
        var rows = data.split(/\r?\n/).map(function (line) { return line.split(",").map(function (col) { return col.replace(/^"(.*)"$/, "$1"); }); });
        rows.forEach(function (_a) {
            var city = _a[0], name = _a[1], code = _a[2];
            if (!+city)
                return;
            if (name.search(/境界未定/) > -1)
                return;
            var code2 = code.substr(0, 6);
            var code3 = code.substr(6);
            var idx2 = mesh2[code2] || (mesh2[code2] = {});
            idx2[city] = (idx2[city] || 0) + 1;
            var idx1 = mesh1[code2] || (mesh1[code2] = {});
            var list3 = idx1[code3] || (idx1[code3] = {});
            list3[+city] = 1;
            if (!nameIndex[city]) {
                nameIndex[city] = name.replace(/^.+(支庁|(総合)?振興局)/, "");
            }
        });
    });
    var list2 = Object.keys(mesh2);
    WARN("level 2: " + list2.length + " mesh");
    list2.forEach(function (code2) {
        var idx2 = mesh2[code2];
        var array = Object.keys(idx2).sort(function (a, b) {
            return ((idx2[b] - idx2[a]) || ((+b) - (+a)));
        });
        var city = mesh2[code2] = +array[0];
        var item = meshIndex[code2] = [city];
        if (array.length < 2)
            return;
        var single = {};
        var multi = {};
        item.push(single, multi);
        var idx1 = mesh1[code2];
        Object.keys(idx1).forEach(function (code3) {
            var list3 = Object.keys(idx1[code3]).map(function (v) { return +v; });
            if (list3.length > 1) {
                multi[code3] = list3;
            }
            else if (list3[0] !== city) {
                single[code3] = list3[0];
            }
        });
    });
    var json;
    json = JSON.stringify({ mesh: meshIndex });
    json = json.replace(/("\d{6}":)/g, "\n$1");
    write(meshJson, json);
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
