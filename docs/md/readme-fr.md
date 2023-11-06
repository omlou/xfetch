## Langue

* [English](https://github.com/omlou/xfetch#readme)
* [简体中文](https://github.com/omlou/xfetch/blob/master/docs/md/readme-zh.md)
* [日本語](https://github.com/omlou/xfetch/blob/master/docs/md/readme-ja.md)
* [한국어](https://github.com/omlou/xfetch/blob/master/docs/md/readme-ko.md)
* [Français](https://github.com/omlou/xfetch/blob/master/docs/md/readme-fr.md)

## Introduction

* Use `fetch` more simply and conveniently.
* Don't worry if your browser environment doesn't support `fetch`. If you are using an older browser, `xfetch` will simulate `fetch` using `XMLHttpRequest`.
* Respect native behavior and focus on performance.

## Usage

### Import via Script Tag

```html
<script src="https://unpkg.com/@xlou/xfetch@1.0.2/dist/umd/xfetch.min.js"></script>
<!-- It is recommended to download and use locally. -->
<script>
  /* After including this JS file, the xfetch object will be assigned to the window. */
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

### Use in Node.js Projects

Install

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

#### Get

Script Tag :&emsp;`window.xfetch`

Module :&emsp;`import xfetch from "@xlou/xfetch"`

#### Usage

```typescript
xfetch("https://xxx.com", {
  method: "post",
  query: { // Converted to URL parameters
    id: 1
  },
  data: { // Converted to body parameters; if body is specified, this parameter will be ignored
    name: "Tom",
    age: 18
  },
  contentType: "json", // Specify the Content-Type in the request headers
  responseType: "json" // Enable response data preprocessing and specify the type of response data
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

* This parameter supports JavaScript objects and will be converted into URL parameter strings and appended to the request URL.
* It will not interfere with the original parameters in the request URL.

data

* When sending the request, it will be converted into body parameters based on the Content-Type value in the headers.
* If the body parameter is specified at the same time, this parameter will be ignored.
* This parameter supports regular JavaScript objects.
  * When Content-Type is "application/json", data will be converted into a JSON string.
  * When Content-Type is "application/x-www-form-urlencoded", data will be converted into a URL string.
  * When Content-Type is "multipart/form-data", data will be converted into FormData.
  * If data can be converted to JSON and Content-Type is not specified, Content-Type will be set to "application/json".

contentType

* Specify the Content-Type in the request headers.
* If Content-Type is already specified in the headers, this parameter will be ignored.
* contentType values correspond to Content-Type in the headers:
  * json: "application/json;charset=UTF-8"
  * urlencoded: "application/x-www-form-urlencoded;charset=UTF-8"
  * formData: "multipart/form-data"
  * text: "text/plain;charset=UTF-8"
  * xml: "application/xml;charset=UTF-8"
  * stream: "application/octet-stream"

responseType

* If this parameter is not specified, the response data will be the same as using fetch.
* If this parameter is specified, it means that response data preprocessing is enabled, and a preprocessed synchronous data will be returned.

  ```javascript
  /* Getting data normally */
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
    /* If responseType is set to blob, use blobSync, and so on. */
  })
  ```

Other parameters are the same as fetch.

### xhrFetch

#### Get

Script Tag :&emsp;`xfetch.xhrFetch`

Module :&emsp;`import { xhrFetch } from "@xlou/xfetch"`

#### Usage

```typescript
xfetch("https://xxx.com", {
  method: "post",
  query: { // Converted to URL parameters
    id: 1
  },
  data: { // Converted to body parameters; if body is specified, this parameter will be ignored
    name: "Tom",
    age: 18
  },
  contentType: "json", // Specify the Content-Type in the request headers
  responseType: "json" // Enable response data preprocessing and specify the type of response data
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

const ContentType: { [prop: string]: string } =

 {
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

* This parameter supports JavaScript objects and will be converted into URL parameter strings and appended to the request URL.
* It will not interfere with the original parameters in the request URL.

data

* When sending the request, it will be converted into body parameters based on the Content-Type value in the headers.
* If the body parameter is specified at the same time, this parameter will be ignored.
* This parameter supports regular JavaScript objects.
  * When Content-Type is "application/json", data will be converted into a JSON string.
  * When Content-Type is "application/x-www-form-urlencoded", data will be converted into a URL string.
  * When Content-Type is "multipart/form-data", data will be converted into FormData.
  * If data can be converted to JSON and Content-Type is not specified, Content-Type will be set to "application/json".

contentType

* Specify the Content-Type in the request headers.
* If Content-Type is already specified in the headers, this parameter will be ignored.
* contentType values correspond to Content-Type in the headers:
  * json: "application/json;charset=UTF-8"
  * urlencoded: "application/x-www-form-urlencoded;charset=UTF-8"
  * formData: "multipart/form-data"
  * text: "text/plain;charset=UTF-8"
  * xml: "application/xml;charset=UTF-8"
  * stream: "application/octet-stream"

responseType

* If this parameter is not specified, the response data will be the same as using fetch.
* If this parameter is specified, it means that response data preprocessing is enabled, and a preprocessed synchronous data will be returned.

  ```javascript
  /* Getting data normally */
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
    /* If responseType is set to blob, use blobSync, and so on. */
  })
  ```

Other parameters are the same as fetch.