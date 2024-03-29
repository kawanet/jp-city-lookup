# Japan City Code Lookup

[![Node.js CI](https://github.com/kawanet/jp-city-lookup/workflows/Node.js%20CI/badge.svg?branch=master)](https://github.com/kawanet/jp-city-lookup/actions/)
[![npm version](https://badge.fury.io/js/jp-city-lookup.svg)](https://badge.fury.io/js/jp-city-lookup)

- JIS X 0402: Identification code for cities, towns and villages
- Reverse Geocoding: Japan Standard Grid Square (1km accuracy)
- Standalone: No module dependencies

### Synopsis

```js
const {City} = require("jp-city-lookup");

// lookup by pair of latitude and longitude
console.log(City.lookup({lat: 35.68944, lng: 139.69167})); // => ["13104", "13113"]

// lookup by comma separated latitude and longitude
console.log(City.lookup({ll: "35.1709,136.8815"})); // => ["23104", "23105"]

// lookup by JIS prefecture code
console.log(City.lookup({pref: "13"})); // => ["13101", "13102", ... "13421"]

// lookup by neighboring city code
console.log(City.lookup({neighboring: "13101"})); // => ["13102", "13104", ... "13106"]

// name for city code
console.log(City.name("13101")); // => "千代田区"
```

### GitHub

- https://github.com/kawanet/jp-city-lookup

### Reference

- `出典：「市区町村別メッシュ・コード一覧」（総務省統計局）` licensed under CC BY 4.0
- https://www.stat.go.jp/data/mesh/m_itiran.html
- https://www.stat.go.jp/english/data/mesh/05-1s.html
- https://github.com/jp-mirror/jp-data-mesh-csv

### See Also

- https://kikakurui.com/x0/X0402-2010-01.html
- https://www.npmjs.com/package/jp-pref-lookup
- https://www.npmjs.com/package/jp-city-lookup
- https://www.npmjs.com/package/jp-zipcode-lookup

### The MIT License (MIT)

Copyright (c) 2018-2023 Yusuke Kawasaki

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
