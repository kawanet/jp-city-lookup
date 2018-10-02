type MeshCode = string;
type PrefCode = string;
type CityCode = string;
export interface CityOptions {
    pref?: PrefCode | number;
    ll?: string;
    lat?: number;
    lng?: number;
    mesh?: MeshCode;
    neighboring?: CityCode | number;
}
export declare module City {
    function name(code: CityCode | number): string;
    function lookup(options: CityOptions): CityCode[];
}
export {};
