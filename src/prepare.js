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
    parser_1.Parser.parse().then(function (data) {
        var json;
        json = JSON.stringify({ mesh: data.mesh });
        json = json.replace(/("\d{6}":)/g, "\n$1");
        logger_1.Logger.log("writing:", MESH);
        fs.writeFileSync(MESH, json);
        json = JSON.stringify({ city: data.city });
        json = json.replace(/("\d+":)/g, "\n$1");
        logger_1.Logger.log("writing:", CITY);
        fs.writeFileSync(CITY, json);
    });
}
CLI();
