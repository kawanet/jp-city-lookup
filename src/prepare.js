"use strict";
// prepare.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var jp_grid_square_master_1 = require("jp-grid-square-master");
var fs_1 = require("fs");
var WARN = function (message) { return console.warn(message); };
function CLI(meshJson, cityJson) {
    return __awaiter(this, void 0, void 0, function () {
        var mesh1, mesh2, meshIndex, nameIndex, list2, json;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mesh1 = {};
                    mesh2 = {};
                    meshIndex = {};
                    nameIndex = {};
                    return [4 /*yield*/, jp_grid_square_master_1.all({
                            progress: WARN,
                            each: function (_a) {
                                var city = _a[0], name = _a[1], code = _a[2];
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
                            }
                        })];
                case 1:
                    _a.sent();
                    list2 = Object.keys(mesh2);
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
                    json = JSON.stringify({ mesh: meshIndex });
                    json = json.replace(/("\d{6}":)/g, "\n$1");
                    write(meshJson, json);
                    json = JSON.stringify({ city: nameIndex });
                    json = json.replace(/("\d+":)/g, "\n$1");
                    write(cityJson, json);
                    return [2 /*return*/];
            }
        });
    });
}
function write(file, json) {
    if (file) {
        WARN("writing: " + file);
        fs_1.createWriteStream(file).write(json);
    }
    else {
        process.stdout.write(json);
    }
}
CLI.apply(null, process.argv.slice(2));
