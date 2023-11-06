## 언어

* [English](https://github.com/omlou/xfetch#readme)
* [简体中文](https://github.com/omlou/xfetch/blob/master/docs/md/readme-zh.md)
* [日本語](https://github.com/omlou/xfetch/blob/master/docs/md/readme-ja.md)
* [한국어](https://github.com/omlou/xfetch/blob/master/docs/md/readme-ko.md)
* [Français](https://github.com/omlou/xfetch/blob/master/docs/md/readme-fr.md)

## 소개

* fetch를 간단하고 빠르게 사용하세요.
* 브라우저 환경이 fetch를 지원하지 않더라도 걱정하지 마세요. 오래된 브라우저를 사용하는 경우 xfetch는 XMLHttpRequest를 사용하여 fetch를 시뮬레이트합니다.
* 네이티브 동작을 존중하며 성능에 중점을 두었습니다.

## 사용법

### 스크립트 태그로 가져오기

```html
<script src="https://unpkg.com/@xlou/xfetch@1.0.2/dist/umd/xfetch.min.js"></script>
<!-- 다운로드하여 사용하는 것을 권장합니다 -->
<script>
  /* 이 JS 파일을 가져온 후 xfetch 객체가 window에 할당됩니다 */
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

### Node.js 프로젝트에서 사용하기

설치

```bash
npm i @xlou/xfetch -S
```

사용법

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

#### 가져오기

스크립트 태그: `window.xfetch`

모듈: `import xfetch from "@xlou/xfetch"`

#### 사용법

```typescript
xfetch("https://xxx.com", {
  method: "post",
  query: { // URL 매개변수로 변환
    id: 1
  },
  data: { // 요청 바디 매개변수로 변환; 동시에 바디 매개변수를 지정한 경우 이 매개변수는 무효화됩니다.
    name: "Tom",
    age: 18
  },
  contentType: "json", // 요청 헤더의 Content-Type 지정
  responseType: "json" // 응답 데이터 전처리를 활성화하고 응답 데이터 유형을 지정
})
```

#### 유형

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

#### 매개변수 설명

query

* 이 매개변수는 JavaScript 객체를 지원하며, 요청을 보낼 때 URL 매개변수 문자열로 변환되어 요청 URL에 추가됩니다.
* 요청 URL의 원래 매개변수에 영향을 미치지 않습니다.

data

* 요청을 보낼 때 헤더의 Content-Type 값에 따라 바디 매개변수로 변환됩니다.
* 동시에 바디 매개변수를 지정한 경우, 이 매개변수는 무효화됩니다.
* 이 매개변수는 일반적인 JavaScript 객체를 지원합니다:
  * Content-Type이 application/json인 경우, 데이터는 JSON 문자열로 변환됩니다.
  * Content-Type이 application/x-www-form-urlencoded인 경우, 데이터는 URL로 인코딩된 문자열로 변환됩니다.
  * Content-Type이 multipart/form-data인 경우, 데이터는 FormData로 변환됩니다.
  * 데이터가 JSON으로 변환할 수 있고 Content-Type이 지정되지 않은 경우 Content-Type은 application/json으로 설정됩니다.

contentType

* 요청 헤더의 Content-Type을 지정합니다.
* 헤더에서 이미 Content-Type이 지정된 경우, 이 매개변수는 무효화됩니다.
* contentType 값은 헤더의 Content-Type에 해당합니다:
  * json:&ensp; "application/json;charset=UTF-8"
  * urlencoded:&ensp; "application/x-www-form-urlencoded;charset=UTF-8"
  * formData:&ensp; "multipart/form-data"
  * text:&ensp; "text/plain;charset=UTF-8"
  * xml:&ensp; "application/xml;charset=UTF-8"
  * stream:&ensp; "application/octet-stream"

responseType

* 이 매개변수가 지정되지 않은 경우, 응답 데이터는 fetch와 동일합니다.
* 이 매개변수가 지정된 경우, 응답 데이터 전처리가 활성화되고 전처리된 동기 데이터가 반환됩니다.

  ```javascript
  /* 데이터를 정상적으로 가져오기 */
  xfetch("https://xxx.com")
  .then(async res => {
    let json = await res

.json()
  })

  /* responseType을 json으로 지정 */
  xfetch("https://xxx.com", {
    responseType: "json"
  })
  .then(res => {
    let json = res.jsonSync
    /* responseType가 blob으로 설정된 경우 blobSync를 사용하며 이와 같이 진행됩니다 */
  })
  ```

기타 매개변수는 fetch와 동일합니다.

### xhrFetch

#### 가져오기

스크립트 태그: `xfetch.xhrFetch`

모듈: `import { xhrFetch } from "@xlou/xfetch"`

#### 사용법

```typescript
xfetch("https://xxx.com", {
  method: "post",
  query: { // URL 매개변수로 변환
    id: 1
  },
  data: { // 요청 바디 매개변수로 변환; 바디 매개변수를 동시에 지정한 경우 이 매개변수는 무효화됩니다.
    name: "Tom",
    age: 18
  },
  contentType: "json", // 요청 헤더의 Content-Type을 지정
  responseType: "json" // 응답 데이터 전처리를 활성화하고 응답 데이터 유형을 지정
})
```

#### 유형

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

#### 매개변수 설명

query

* 이 매개변수는 JavaScript 객체를 지원하며, 요청을 보낼 때 URL 매개변수 문자열로 변환되어 요청 URL에 추가됩니다.
* 요청 URL의 원래 매개변수에 영향을 미치지 않습니다.

data

* 요청을 보낼 때 헤더의 Content-Type 값에 따라 바디 매개변수로 변환됩니다.
* 바디 매개변수를 동시에 지정한 경우, 이 매개변수는 무효화됩니다.
* 이 매개변수는 일반적인 JavaScript 객체를 지원합니다:
  * Content-Type이 application/json인 경우, 데이터는 JSON 문자열로 변환됩니다.
  * Content-Type이 application/x-www-form-urlencoded인 경우, 데이터는 URL로 인코딩된 문자열로 변환됩니다.
  * Content-Type이 multipart/form-data인 경우, 데이터는 FormData로 변환됩니다.
  * 데이터가 JSON으로 변환할 수 있고 Content-Type이 지정되지 않은 경우 Content-Type은 application/json으로 설정됩니다.

contentType

* 요청 헤더의 Content-Type을 지정합니다.
* 헤더에서 이미 Content-Type이 지정된 경우, 이 매개변수는 무효화됩니다.
* contentType 값은 헤더의 Content-Type에 해당합니다:
  * json:&ensp; "application/json;charset=UTF-8"
  * urlencoded:&ensp; "application/x-www-form-urlencoded;charset=UTF-8"
  * formData:&ensp; "multipart/form-data"
  * text:&ensp; "text/plain;charset=UTF-8"
  * xml:&ensp; "application/xml;charset=UTF-8"
  * stream:&ensp; "application/octet-stream"

responseType

* 이 매개변수가 지정되지 않은 경우, 응답 데이터는 fetch와 동일합니다.
* 이 매개변수가 지정된 경우, 응답 데이터 전처리가 활성화되고 전처리된 동기 데이터가 반환됩니다.

  ```javascript
  /* 데이터를 정상적으로 가져오기 */
  xfetch("https://xxx.com")
  .then(async res => {
    let json = await res.json()
  })

  /* responseType을 json으로 지정 */
  xfetch("https://xxx.com", {
    responseType: "json"
  })
  .then(res => {
    let json = res.jsonSync
    /* responseType가 blob으로 설정된 경우 blobSync를 사용하며 이와 같이 진행됩니다 */
  })
  ```

기타 매개변수는 fetch와 동일합니다.