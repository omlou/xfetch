## Language

* [English](https://github.com/omlou/xfetch#readme)
* [简体中文](https://github.com/omlou/xfetch/blob/master/docs/md/readme-zh.md)
* [日本語](https://github.com/omlou/xfetch/blob/master/docs/md/readme-ja.md)
* [한국어](https://github.com/omlou/xfetch/blob/master/docs/md/readme-ko.md)
* [Français](https://github.com/omlou/xfetch/blob/master/docs/md/readme-fr.md)

## Introduction

* Simplify and expedite your use of fetch.
* Don't worry if your browser environment lacks fetch support; if you are using an older browser, xfetch will emulate fetch using XMLHttpRequest.
* Respects the native implementation and prioritizes performance.

## Usage

### Using Script Tags for Import

```html
<script src="https://unpkg.com/@xlou/xfetch@1.0.3/dist/umd/xfetch.min.js"></script>
<!-- It is recommended to download and use the script locally -->
<script>
  /* After including this script, the xfetch object is assigned to the window */
  xfetch("https://xxx.com", {
    method: "post",
    query: {
      id: 1
    },
    data: {
      name: "Tom",
      age: 18
    }
  })
  .then((res) => { })
  .catch((err) => { })
</script>
```

### Using in Node.js Projects

Installation

```bash
npm i @xlou/xfetch -S
```

Usage

```javascript
import xfetch from '@xlou/xfetch'

xfetch("https://xxx.com", {
  method: "post",
  query: {
    id: 1
  },
  data: {
    name: "Tom",
    age: 18
  }
})
.then((res) => { })
.catch((err) => { })
```

## API

### xfetch

#### Retrieval

Script Tag: `window.xfetch`

Module: `import xfetch from "@xlou/xfetch"`

#### Usage

```typescript
xfetch("https://xxx.com", {
  method: "post",
  query: { // Converted to URL parameters
    id: 1
  },
  data: { // Converted to body parameters; if body is specified simultaneously, this parameter will be ignored
    name: "Tom",
    age: 18
  },
  contentType: "json", // Specifies the Content-Type in the request headers
  responseType: "json" // Enables preprocessing of response data and specifies the response data type
})
```

#### Types

```typescript
function xfetch(input: RequestInfo | URL, init?: XfetchInit | undefined): Promise<XfetchResponse>

type RequestInfo = Request | string

interface XfetchInit extends RequestInit {
  query?: { [prop: string]: any }
  data?: BodyInit | null | { [prop: string]: any }
  contentType?: "json" | "urlencoded" | "formData" | "text" | "xml" | "stream"
  responseType?: "json" | "text" | "blob" | "arrayBuffer" | "formData"
}

type BodyInit = ReadableStream | XMLHttpRequestBodyInit

const ContentType: { [prop: string]: string } = {
  json: "application/json;charset=UTF-8",
  urlencoded: "application/x-www-form-urlencoded;charset=UTF-8",
  formData: "multipart/form-data",
  text: "text/plain;charset=UTF-8",
  xml: "application/xml;charset=UTF-8",
  stream: "application/octet-stream"
}
```

#### Parameter Description

query

* This parameter supports JavaScript objects and will be converted into a URL parameter string appended to the request URL.
* It will not interfere with any existing parameters in the request URL.

data

* When sending the request, it will be converted into body parameters based on the Content-Type value in the headers.
* If the body parameter is specified simultaneously, this parameter will be ignored.
* This parameter supports general JavaScript objects.
  * When Content-Type is "application/json," data will be converted to a JSON string.
  * When Content-Type is "application/x-www-form-urlencoded," data will be converted to a URL-encoded string.
  * When Content-Type is "multipart/form-data," data will be converted to FormData.
  * If data can be converted to JSON and Content-Type is not specified, the Content-Type will be set to "application/json."

contentType

* Specifies the Content-Type in the request headers.
* If Content-Type is already specified in the headers, this parameter will be ignored.
* contentType values correspond to Content-Type in the headers:
  * json: "application/json;charset=UTF-8"
  * urlencoded: "application/x-www-form-urlencoded;charset=UTF-8"
  * formData: "multipart/form-data"
  * text: "text/plain;charset=UTF-8"
  * xml: "application/xml;charset=UTF-8"
  * stream: "application/octet-stream"

responseType

* If this parameter is not specified, the response data obtained will be the same as with fetch.
* When this parameter is specified, it means that response data preprocessing is enabled, and a preprocessed synchronous data will be returned.

  ```javascript
  /* Normal data retrieval */
  xfetch("https://xxx.com")
  .then(async res => {
    let json = await res.json()
  })

  /* Specifying responseType as json */
  xfetch("https://xxx.com", {
    responseType: "json"
  })
  .then(res => {
    let json = res.jsonSync
    /* If responseType is set to blob, use blobSync, and so on */
  })
  ```

Other parameters are the same as fetch.

### xhrFetch

#### Retrieval

Script Tag: `xfetch.xhrFetch`

Module: `import { xhrFetch } from "@xlou/xfetch"`

#### Usage

Usage is the same as fetch, but it is implemented using XMLHttpRequest. It is recommended to use xfetch instead of this.

Request parameters like cache, mode, signal, keepalive, redirect, integrity, referrer, and referrerPolicy are not effective.

The body in the response parameters is of Blob type, not ReadableStream.

#### Types

```typescript
function xhrFetch(input: RequestInfo | URL, init?: RequestInit | undefined): Promise<XHRFetchResponse>;

interface XHRFetchResponse {
  readonly body: Blob | null
  readonly bodyUsed: boolean
  readonly headers: any
  readonly ok: boolean
  readonly redirected: boolean
  readonly status: number
  readonly statusText: string
  readonly type: string
  readonly url: string
  clone(): XHRFetchResponse
  arrayBuffer(): Promise<ArrayBuffer>
  blob(): Promise<Blob>
  formData(): Promise<FormData>
  json(): Promise<any>
  text(): Promise<string>
}
```