export declare module City {
    function name(code: string | number): string;
    function lookup(options: {
        pref?: string | number;
        ll?: string;
        lat?: number;
        lng?: number;
        mesh?: string;
        neighboring?: string | number;
    }): string[];
}
