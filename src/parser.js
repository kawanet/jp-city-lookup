"use strict";
// parser.ts
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
var fs = require("fs");
var iconv = require("iconv-lite");
var promisen = require("promisen");
var logger_1 = require("./logger");
var BASE_DIR = __dirname.replace(/[^\/]*\/*$/, "");
var LOCAL_CSV = BASE_DIR + "csv/";
var REMOVE_CSV = "http://www.stat.go.jp/data/mesh/csv/";
var CSV_SUFFIX = ".csv";
var NAMES = [
    "01-1", "01-2", "01-3", "02", "03", "04", "05", "06", "07", "08", "09",
    "10", "11", "12", "13", "14", "15", "16", "17", "18", "19",
    "20", "21", "22", "23", "24", "25", "26", "27", "28", "29",
    "30", "31", "32", "33", "34", "35", "36", "37", "38", "39",
    "40", "41", "42", "43", "44", "45", "46", "47"
];
var readFile = promisen.denodeify(fs.readFile.bind(fs));
var writeFile = promisen.denodeify(fs.writeFile.bind(fs));
var access = promisen.denodeify(fs.access.bind(fs));
var Parser;
(function (Parser) {
    function parse(names) {
        var mesh1 = {};
        var mesh2 = {};
        var cities = {};
        return readCSV(names).then(function (array) {
            array.forEach(function (row) {
                // header row
                if (!(+row[0]))
                    return;
                var city = row[0];
                var code = row[2];
                var code2 = code.substr(0, 6);
                var code3 = code.substr(6);
                var idx2 = mesh2[code2] || (mesh2[code2] = {});
                idx2[city] = (idx2[city] || 0) + 1;
                var idx1 = mesh1[code2] || (mesh1[code2] = {});
                var list3 = idx1[code3] || (idx1[code3] = {});
                list3[+city] = 1;
                // city code -> name
                if (!cities[city]) {
                    cities[city] = row[1].replace(/^.+(支庁|(総合)?振興局)/, "");
                }
            });
        }).then(function () {
            var mesh = {};
            Object.keys(mesh2).forEach(function (code2) {
                var idx2 = mesh2[code2];
                var array = Object.keys(idx2).sort(function (a, b) {
                    return ((idx2[b] - idx2[a]) || ((+b) - (+a)));
                });
                var city = mesh2[code2] = +array[0];
                var single = {};
                var multi = {};
                var item = mesh[code2] = [city];
                if (array.length < 2)
                    return;
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
            return { mesh: mesh, city: cities };
        });
    }
    Parser.parse = parse;
    /**
     * read all CSV files
     */
    function readCSV(names) {
        var all = [];
        // read all files when the argument not given
        if (!names)
            names = NAMES;
        return promisen.eachSeries(names, it)().then(function () { return all; });
        function it(name) {
            return loadFile(name)
                .then(decodeCP932)
                .then(parseCSV)
                .then(function (array) {
                all = all.concat(array);
            });
        }
    }
    /**
     * load CSV file from local cache, or from remote
     */
    function loadFile(name) {
        var file = LOCAL_CSV + name + CSV_SUFFIX;
        // check whether local cache file available
        return access(file).catch(function () {
            // fetch from remote when cache unavailable
            var url = REMOVE_CSV + name + CSV_SUFFIX;
            logger_1.Logger.log("loading: " + url);
            return fetchFile(url).then(function (data) {
                logger_1.Logger.log("writing: " + file + " (" + data.length + " bytes)");
                return writeFile(file, data);
            });
        }).then(function () {
            // read from local when cache available
            logger_1.Logger.log("reading: " + file);
            return readFile(file);
        });
    }
    /**
     * fetch CSV file from remote
     */
    function fetchFile(url) {
        var req = {
            method: "GET",
            url: url,
            responseType: "arraybuffer"
        };
        return axios_1.default(req).then(function (res) { return res.data; });
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
            .filter(function (line) { return !!line; })
            .map(function (line) { return line.split(",")
            .map(function (col) { return col.replace(/^"(.*)"/, "$1"); }); });
    }
})(Parser = exports.Parser || (exports.Parser = {}));
