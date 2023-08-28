interface XHRHeaders {
    [Symbol.iterator]?(): IterableIterator<[string, string]>;
    append(name: string, value: string): void;
    delete(name: string): void;
    get(name: string): string | null;
    has(name: string): boolean;
    set(name: string, value: string): void;
    forEach(callback: (value: string, key: string, parent: Headers) => void, thisArg?: any): void;
    entries(): IterableIterator<[string, string]>;
    keys(): IterableIterator<string>;
    values(): IterableIterator<string>;
}
declare function XHRHeaders(): void;
interface XHRFetchResponse {
    readonly body: Blob | null;
    readonly bodyUsed: boolean;
    readonly headers: any;
    readonly ok: boolean;
    readonly redirected: boolean;
    readonly status: number;
    readonly statusText: string;
    readonly type: string;
    readonly url: string;
    clone(): XHRFetchResponse;
    arrayBuffer(): Promise<ArrayBuffer>;
    blob(): Promise<Blob>;
    formData(): Promise<FormData>;
    json(): Promise<any>;
    text(): Promise<string>;
}
declare function XHRFetchResponse(body: Blob, bodyUsed: boolean, headers: any, ok: boolean, redirected: boolean, status: number, statusText: string, type: string, url: string): void;

declare function xhrFetch(input: RequestInfo | URL, init?: RequestInit | undefined): Promise<XHRFetchResponse>;

type PropType = string | number | symbol;
type ValueType = string | number | symbol | boolean | null | undefined;
interface SimpleParams {
    [prop: PropType]: ValueType;
}
interface SimpleObject {
    [prop: string]: ValueType;
}
type XFContentType = "json" | "urlencoded" | "formData" | "text" | "xml" | "stream";
type XFResponseType = "json" | "text" | "blob" | "arrayBuffer" | "formData";
interface XfetchInit extends RequestInit {
    query?: SimpleParams;
    data?: BodyInit | null | SimpleParams;
    contentType?: XFContentType;
    responseType?: XFResponseType;
}
interface XfetchResponse extends Response {
    jsonSync?: string;
    textSync?: string;
    blobSync?: Blob;
    arrayBufferSync?: ArrayBuffer;
    formDataSync?: FormData;
}
declare function queryString(obj: SimpleObject, bol?: boolean): string;
declare function xfetch(input: RequestInfo | URL, init?: XfetchInit | undefined): Promise<XfetchResponse>;

declare global {
    interface Window {
        xfetch: any;
        fetch: any;
    }
}

export { PropType, XFContentType, XFResponseType, XHRFetchResponse, XHRHeaders, XfetchInit, XfetchResponse, xfetch as default, queryString, xhrFetch };
