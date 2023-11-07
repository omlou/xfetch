## 언어

* [English](https://github.com/omlou/xfetch#readme)
* [简体中文](https://github.com/omlou/xfetch/blob/master/docs/md/readme-zh.md)
* [日本語](https://github.com/omlou/xfetch/blob/master/docs/md/readme-ja.md)
* [한국어](https://github.com/omlou/xfetch/blob/master/docs/md/readme-ko.md)
* [Français](https://github.com/omlou/xfetch/blob/master/docs/md/readme-fr.md)

## 소개

* 더 간편하고 빠르게 fetch를 사용하세요.
* 브라우저 환경에서 fetch가 없어도 걱정하지 마세요. 오래된 브라우저를 사용하는 경우 xfetch가 XMLHttpRequest를 사용하여 fetch를 시뮬레이션합니다.
* 네이티브를 존중하고 성능을 중요시합니다.

## 사용 방법

### 스크립트 태그로 가져오기

```html
<script src="https://unpkg.com/@xlou/xfetch@1.0.3/dist/umd/xfetch.min.js"></script>
<!-- 다운로드 후 사용하는 것이 좋습니다. -->
<script>
  /* 이 js 파일을 가져오면 xfetch 객체가 window에 할당됩니다. */
  xfetch("https://xxx.com", {
    method: "post"
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

### Node.js 프로젝트에서 사용

설치

``` bash
npm i @xlou/xfetch -S
```

사용

``` javascript
import xfetch from '@xlou/xfetch'

xfetch("https://xxx.com", {
  method: "post"
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

#### 가져오기

스크립트 태그 :&emsp;`window.xfetch`

모듈 :&emsp;`import xfetch from "@xlou/xfetch"`

#### 사용

``` typescript
xfetch("https://xxx.com", {
  method: "post",
  query: { // URL 매개변수로 변환됨
    id: 1
  },
  data: { // 본문 매개변수로 변환됨. 본문 매개변수를 동시에 지정한 경우 이 매개변수는 무시됩니다.
    name: "Tom",
    age: 18
  },
  contentType: "json", // 요청 헤더의 Content-Type을 지정합니다.
  responseType: "json" // 응답 데이터 전처리를 활성화하고 응답 데이터 유형을 지정합니다.
})
```

#### 유형

``` typescript
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

#### 매개변수 설명

query

* 이 매개변수는 JavaScript 객체를 지원하며 요청을 보낼 때 URL 매개변수 문자열로 변환됩니다.
* 요청 주소의 기존 매개변수에 영향을 주지 않습니다.

data

* 요청을 보낼 때 요청 헤더의 Content-Type 값에 따라 본문 매개변수로 변환됩니다.
* 동시에 본문 매개변수를 지정한 경우 이 매개변수는 무시됩니다.
* 이 매개변수는 일반 JavaScript 객체를 지원합니다.
  * Content-Type이 application/json인 경우 data는 JSON 문자열로 변환됩니다.
  * Content-Type이 application/x-www-form-urlencoded인 경우 data는 URL 문자열로 변환됩니다.
  * Content-Type이 multipart/form-data인 경우 data는 FormData로 변환됩니다.
  * data가 JSON으로 변환 가능한 경우 Content-Type이 지정되지 않았다면 Content-Type은 application/json으로 지정됩니다.

contentType

* 요청 헤더의 Content-Type을 지정합니다.
* 이미 헤더에서 Content-Type이 지정된 경우 이 매개변수는 무시됩니다.
* contentType 값에 따른 Content-Type 헤더:
  * json:&ensp; "application/json;charset=UTF-8"
  * urlencoded:&ensp; "application/x-www-form-urlencoded;charset=UTF-8"
  * formData:&ensp; "multipart/form-data"
  * text:&ensp; "text/plain;charset=UTF-8"
  * xml:&ensp; "application/xml;charset=UTF-8"
  * stream:&ensp; "application/octet-stream"

responseType

* 이 매개변수를 지정하지 않으면 응답 데이터는 fetch와 동일합니다.
* 이 매개변수를 지정하면 응답 데이터의 사전 처리가 활성화되며 사전 처리된 동기 데이터가 반환됩니다.

  ``` javascript
  /* 데이터 정상 가져오기 */
  xfetch("https://xxx.com")
  .then(async res => {
    let json = await res.json()
  })

  /* responseType을 json으로 지정 */
  xfetch("https://xxx.com", {
    responseType: "json"
  })
  .then(res

 => {
    let json = res.jsonSync
    /* responseType를 blob으로 설정한 경우 blobSync를 사용하고, 이와 같은 방식으로 계속 진행됩니다. */
  })
  ```

기타 매개변수는 fetch와 동일합니다.

### xhrFetch

#### 가져오기

스크립트 태그 :&emsp;`xfetch.xhrFetch`

모듈 :&emsp;`import { xhrFetch } from "@xlou/xfetch"`

#### 사용

fetch와 동일하게 사용하지만 XMLHttpRequest를 사용하여 구현됩니다. 이것 대신 xfetch를 사용하는 것을 권장합니다.

요청 매개변수에서 cache, mode, signal, keepalive, redirect, integrity, referrer, referrerPolicy 등의 속성 설정은 무시됩니다.

응답 매개변수에서 body는 ReadableStream 대신 Blob 유형입니다.

#### 유형

``` typescript
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