/**
 * jp-city-lookup
 *
 * @see https://github.com/kawanet/jp-city-lookup
 */

type MeshCode = string;
type PrefCode = string;
type CityCode = string;

export interface LookupOptions {
    /// JIS prefecture code
    pref?: PrefCode | number,

    /// latitude,longitude
    ll?: string,

    /// latitude
    lat?: number,

    /// longitude
    lng?: number,

    /// mesh code
    mesh?: MeshCode,

    /// JIS city code
    neighboring?: CityCode | number,
}

export declare module City {
    function name(code: CityCode | number): string | undefined;

    function lookup(options: LookupOptions): CityCode[];
}
