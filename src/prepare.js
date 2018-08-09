"use strict";
// prepare.ts
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var parser_1 = require("./parser");
var logger_1 = require("./logger");
var BASE_DIR = __dirname.replace(/[^\/]*\/*$/, "");
var MESH = BASE_DIR + "dist/mesh.json";
var CITY = BASE_DIR + "dist/city.json";
function CLI() {
    return parser_1.Parser.init().then(function () {
        var mesh1 = {};
        var mesh2 = {};
        var names = {};
        parser_1.Parser.all().forEach(function (city) {
            names[city] = parser_1.Parser.name(city);
            parser_1.Parser.mesh(city).forEach(function (code) {
                var code2 = code.substr(0, 6);
                var code3 = code.substr(6);
                var idx2 = mesh2[code2] || (mesh2[code2] = {});
                idx2[city] = (idx2[city] || 0) + 1;
                var idx1 = mesh1[code2] || (mesh1[code2] = {});
                var list3 = idx1[code3] || (idx1[code3] = {});
                list3[+city] = 1;
            });
        });
        var mesh = {};
        Object.keys(mesh2).forEach(function (code2) {
            var idx2 = mesh2[code2];
            var array = Object.keys(idx2).sort(function (a, b) {
                return ((idx2[b] - idx2[a]) || ((+b) - (+a)));
            });
            var city = mesh2[code2] = +array[0];
            var item = mesh[code2] = [city];
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
        json = JSON.stringify({ mesh: mesh });
        json = json.replace(/("\d{6}":)/g, "\n$1");
        logger_1.Logger.warn("writing:", MESH);
        fs.writeFileSync(MESH, json);
        json = JSON.stringify({ city: names });
        json = json.replace(/("\d+":)/g, "\n$1");
        logger_1.Logger.warn("writing:", CITY);
        fs.writeFileSync(CITY, json);
    });
}
CLI();
