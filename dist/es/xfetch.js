const hs = {};
function XHRHeaders() { }
Object.assign(XHRHeaders.prototype, {
    get(key) {
        let res = hs[key];
        if (res === undefined)
            res = null;
        return res;
    },
    set(key, value) {
        hs[key] = value;
    },
    append(key, value) {
        let val = hs[key];
        if (val === undefined) {
            hs[key] = value;
        }
        else {
            hs[key] = val + ", " + value;
        }
    },
    delete(key) {
        delete hs[key];
    },
    has(key) {
        return Object.prototype.hasOwnProperty.call(hs, key);
    },
    keys() {
        return Object.keys(hs)[Symbol.iterator]();
    },
    values() {
        return Object.values(hs)[Symbol.iterator]();
    },
    entries() {
        const keys = Object.keys(hs);
        const entries = keys.map((key) => [key, hs[key]]);
        return entries[Symbol.iterator]();
    },
    forEach(callback, thisArg) {
        for (let key in hs) {
            if (Object.prototype.hasOwnProperty.call(hs, key)) {
                thisArg ? callback.call(thisArg, hs[key], key, hs) : callback(hs[key], key, hs);
            }
        }
    }
});
if (Symbol && Symbol.iterator) {
    XHRHeaders.prototype[Symbol.iterator] = function () {
        const keys = Object.keys(hs);
        const entries = keys.map((key) => [key, hs[key]]);
        return entries[Symbol.iterator]();
    };
}
function XHRFetchResponse(body, bodyUsed, headers, ok, redirected, status, statusText, type, url) {
    this.body = body;
    this.bodyUsed = bodyUsed;
    this.headers = headers;
    this.ok = ok;
    this.redirected = redirected;
    this.status = status;
    this.statusText = statusText;
    this.type = type;
    this.url = url;
}
Object.assign(XHRFetchResponse.prototype, {
    async blob() {
        return this.body;
    },
    async arrayBuffer() {
        return this.body.arrayBuffer();
    },
    clone() {
        return this;
    },
    async formData() {
        const formData = new FormData();
        const { type, data } = await readBlob(this.body);
        switch (type) {
            case "text": {
                let json = null;
                try {
                    json = JSON.parse(data);
                    for (let key in json) {
                        if (Object.prototype.hasOwnProperty.call(json, key)) {
                            formData.append(key, json[key]);
                        }
                    }
                    return formData;
                }
                catch (exc) {
                    throw "Target cannot be converted to FormData.";
                }
            }
            default: {
                formData.append("file", data);
                return formData;
            }
        }
    },
    async json() {
        let json = null;
        const { type, data } = await readBlob(this.body);
        if (type === "text") {
            try {
                json = JSON.parse(data);
                return json;
            }
            catch (exc) {
                throw "Target is not json.";
            }
        }
        else {
            throw "Target is not json.";
        }
    },
    async text() {
        const { data } = await readBlob(this.body, "text/plain");
        return data;
    }
});
function readBlob(blob, type) {
    const fileType = type || blob.type;
    return new Promise((resolve, reject) => {
        switch (fileType) {
            case "text/plain":
            case "application/json":
            case "": {
                const reader = new FileReader();
                reader.onload = () => {
                    const text = reader.result;
                    resolve({
                        type: "text",
                        data: text
                    });
                };
                reader.onerror = (error) => {
                    reject(error);
                };
                reader.readAsText(blob);
                break;
            }
            default: {
                resolve({
                    type: "file",
                    data: blob
                });
            }
        }
    });
}

function getHeaders(arg) {
    const headers = new XHRHeaders();
    if (arg !== null) {
        const arr = arg.trim().split(/[\r\n]+/);
        for (const item of arr) {
            const parts = item.split(': ');
            headers.append(parts[0], parts[1]);
        }
    }
    return headers;
}
function getOk(status) {
    return status >= 200 && status <= 299;
}
function getType(xhr) {
    const res = /^https?:\/\/[\w-.]+(:\d+)?/i.exec(xhr.responseURL);
    const origin = res ? res[0] : null;
    const type = (origin === window.location.origin) ? "basic" : "cors";
    return type;
}
function xhrFetch(input, init) {
    return new Promise(function (resolve, reject) {
        const xhr = new XMLHttpRequest();
        xhr.addEventListener('load', ev => {
            console.log("load", ev, xhr);
            const headers = xhr.getAllResponseHeaders();
            const res = new XHRFetchResponse(xhr.response, false, getHeaders(headers), getOk(xhr.status), false, xhr.status, xhr.statusText, getType(xhr), xhr.responseURL);
            resolve(res);
        });
        xhr.addEventListener('error', ev => {
            console.log("error", ev, xhr);
            reject("TypeError: Failed to fetch");
        });
        xhr.addEventListener('timeout', ev => {
            console.log("timeout", ev, xhr);
            reject("TypeError: Failed to fetch");
        });
        let method = "GET";
        if (init) {
            method = (init.method?.toUpperCase() || "GET");
        }
        if (new Set(['GET', 'DELETE', 'HEAD', 'OPTIONS', 'TRACE']).has(method))
            ;
        if (input instanceof Request)
            input = input.url;
        xhr.open(method, input, true);
        xhr.responseType = "blob";
        if (init) {
            if (init.credentials && init.credentials === "include") {
                xhr.withCredentials = true;
            }
            const { headers } = init;
            if (headers) {
                if (Array.isArray(headers)) {
                    for (const item of headers) {
                        xhr.setRequestHeader(item[0], item[1]);
                    }
                }
                else if (headers instanceof Headers) {
                    headers.forEach((item, i) => {
                        xhr.setRequestHeader(i, item);
                    });
                }
                else {
                    for (const i in headers) {
                        xhr.setRequestHeader(i, headers[i]);
                    }
                }
            }
        }
        let body = null;
        if (init) {
            body = (init.body || null);
        }
        if (body instanceof ReadableStream)
            throw "Body does not support ReadableStream in XMLHttpRequest.";
        xhr.send(body);
    });
}

const ContentType = {
    json: "application/json;charset=UTF-8",
    urlencoded: "application/x-www-form-urlencoded;charset=UTF-8",
    formData: "multipart/form-data",
    text: "text/plain;charset=UTF-8",
    xml: "application/xml;charset=UTF-8",
    stream: "application/octet-stream"
};
function getFetch() {
    if (!window.fetch) {
        window.fetch = xhrFetch;
    }
    return window.fetch;
}
function queryString(obj, bol = false) {
    const arr = [];
    for (const i in obj) {
        if (obj.hasOwnProperty(i)) {
            if (obj[i] === null || obj[i] === undefined) {
                obj[i] = "";
            }
            else {
                obj[i] = String(obj[i]);
            }
            arr.push(encodeURIComponent(i) + '=' + encodeURIComponent(obj[i]));
        }
    }
    const str = arr.join('&');
    return (str && bol) ? ("?" + str) : str;
}
function getHref(url, querystr) {
    let index = url.indexOf("#");
    let href = "";
    let hash = "";
    if (index === -1) {
        href = url;
    }
    else {
        href = url.substring(0, index);
        hash = url.substring(index);
    }
    href += href.includes("?") ? ("&" + querystr) : ("?" + querystr);
    return href + hash;
}
function getContentType(headers) {
    if (!headers)
        return null;
    if (Array.isArray(headers)) {
        for (let item of headers) {
            if (item[0].toLowerCase() === "content-type")
                return item[1];
        }
        return null;
    }
    if (headers instanceof Headers) {
        return headers.get("content-type");
    }
    for (const i in headers) {
        if (Object.prototype.hasOwnProperty.call(headers, i)) {
            const l = i.toLowerCase();
            if (l === "content-type")
                return headers[i];
        }
    }
    return null;
}
function setContentType(headers, value) {
    if (Array.isArray(headers)) {
        headers.push(["Content-Type", value]);
    }
    else if (headers instanceof Headers) {
        headers.set("Content-Type", value);
    }
    else {
        headers["Content-Type"] = value;
    }
}
function xfetch(input, init) {
    const finalFetch = getFetch();
    /* if no init */
    if (!init)
        return finalFetch(input);
    /* handling the 'init' parameter */
    const { query, data, contentType, responseType } = init;
    /* handling the 'query' */
    if (!(input instanceof Request) && query) {
        const querystr = queryString(query);
        if (querystr) {
            if (typeof input === "string") {
                input = getHref(input, querystr);
            }
            else {
                input = new URL(getHref(input.href, querystr));
            }
        }
    }
    /* handling the 'contentType' */
    let { headers } = init;
    if (contentType) {
        if (!headers) {
            init.headers = {
                "Content-Type": ContentType[contentType]
            };
        }
        else if (!getContentType(headers)) {
            setContentType(headers, ContentType[contentType]);
        }
    }
    /* handling the 'data' */
    const { body } = init;
    headers = init.headers;
    if (data) {
        if (!body) {
            const ctype = getContentType(headers);
            let res = data;
            if (!(typeof data === "string")) {
                if (ctype) {
                    if (ctype.includes("application/json")) {
                        try {
                            res = JSON.stringify(data);
                        }
                        catch (exc) {
                            console.warn("Failed to convert \"data\" to JSON string.");
                        }
                    }
                    else if (ctype.includes("application/x-www-form-urlencoded")) {
                        try {
                            res = queryString(data);
                        }
                        catch (exc) {
                            console.warn("Failed to convert \"data\" to urlencoded string.");
                        }
                    }
                    else if (ctype.includes("multipart/form-data") && !(data instanceof FormData)) {
                        try {
                            const formData = new FormData();
                            for (const i in data) {
                                if (Object.prototype.hasOwnProperty.call(data, i)) {
                                    formData.append(i, data[i]);
                                }
                            }
                            res = formData;
                        }
                        catch (exc) {
                            console.warn("Failed to convert \"data\" to FormData.");
                        }
                    }
                }
                else {
                    /* if 'data' can be converted to JSON string and 'Content-Type' is not specified, it defaults to JSON */
                    try {
                        res = JSON.stringify(data);
                        if (!headers) {
                            init.headers = {
                                "Content-Type": "application/json;charset=UTF-8"
                            };
                        }
                        else {
                            setContentType(headers, "application/json;charset=UTF-8");
                        }
                    }
                    catch (exc) { }
                }
            }
            init.body = res;
        }
    }
    /* handling the 'responseType' */
    if (!responseType)
        return finalFetch(input, init);
    return new Promise(function (resolve, reject) {
        finalFetch(input, init)
            .then((response) => {
            const response1 = response.clone();
            response1[responseType]()
                .then((res) => {
                response[responseType + "Sync"] = res;
                resolve(response);
            })
                .catch(() => {
                resolve(response);
            });
        })
            .catch((exc) => {
            reject(exc);
        });
    });
}

export { XHRFetchResponse, XHRHeaders, xfetch as default, queryString, xhrFetch };
