export type RouteParams<T extends string> = {
    [K in T]: string;
};