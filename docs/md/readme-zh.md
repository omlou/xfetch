## 语言

* [English](https://github.com/omlou/xfetch#readme)
* [简体中文](https://github.com/omlou/xfetch/blob/master/docs/md/readme-zh.md)
* [日本語](https://github.com/omlou/xfetch/blob/master/docs/md/readme-ja.md)
* [한국어](https://github.com/omlou/xfetch/blob/master/docs/md/readme-ko.md)
* [Français](https://github.com/omlou/xfetch/blob/master/docs/md/readme-fr.md)

## 介绍

* 更简单快捷地使用 fetch
* 不用担心你地浏览器环境没有 fetch ，如果你使用的是老式的浏览器，xfetch 将会用 XMLHttpRequest 模拟 fetch
* 尊重原生，注重性能

## 使用

### 使用 Script 标签导入

```html
<script src="https://unpkg.com/@xlou/xfetch@1.0.2/dist/umd/xfetch.min.js"></script>
<!-- 建议下载下来使用 -->
<script>
  /* 引入了该 js 文件后，会在 window 上赋值 xfetch 对象 */
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

### 在 Node.js 项目中使用

安装

``` bash
npm i @xlou/xfetch -S
```

使用

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

#### 获取

Script Tag :&emsp;`window.xfetch`

Module :&emsp;`import xfetch from "@xlou/xfetch"`

#### 使用

``` typescript
xfetch("https://xxx.com", {
  method: "post",
  query: { // 转换为 url 参数
    id: 1
  },
  data: { // 转换为 body 参数，如果同时指定了 body ，此参数会失效
    name: "Tom",
    age: 18
  },
  contentType: "json", // 指定请求 headers 里的 Content-Type
  responseType: "json" // 开启 response 数据的预处理，指定 response 数据的类型
})
```

#### 类型

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

#### 参数说明

query

* 该参数支持 javascript 对象，发送请求时会转化为 url 参数字符串拼接到请求地址中
* 不会干扰请求地址上原有的参数

data

* 发送请求时会根据 headers 下的 Content-Type 值转化为 body 参数
* 如果同时指定了 body 参数，该参数会失效
* 该参数支持一般 javascript 对象
  * 当 Content-Type 为 application/json ，data 会转换为 json 字符串
  * 当 Content-Type 为 application/x-www-form-urlencoded ，data 会转换为 url 字符串
  * 当 Content-Type 为 multipart/form-data ，data 会转换为 FormData
  * 如果 data 可以转化为 json ，而 Content-Type 又没有指定，此时 Content-Type 会被指定为 application/json

contentType

* 指定请求 headers 下的 Content-Type
* 如果 Content-Type 已在 headers 里指定，则此参数会失效
* contentType 取值对应的 headers 下 Content-Type
  * json:&ensp; "application/json;charset=UTF-8"
  * urlencoded:&ensp; "application/x-www-form-urlencoded;charset=UTF-8"
  * formData:&ensp; "multipart/form-data"
  * text:&ensp; "text/plain;charset=UTF-8"
  * xml:&ensp; "application/xml;charset=UTF-8"
  * stream:&ensp; "application/octet-stream"

responseType

* 如果未指定该参数，得到的 response 数据与 fetch 无异
* 指定了该参数后，就意味着开启了 response 数据的预处理，会返回一个预处理好的同步数据

  ``` javascript
  /* 正常获取数据 */
  xfetch("https://xxx.com")
  .then(async res => {
    let json = await res.json()
  })

  /* 指定了 responseType 为 json */
  xfetch("https://xxx.com", {
    responseType: "json"
  })
  .then(res => {
    let json = res.jsonSync
    /* 如果 responseType 设置为 blob ，那么就用 blobSync 获取，以此类推 */
  })
  ```

其他参数同 fetch

### xhrFetch

#### 获取

Script Tag :&emsp;`xfetch.xhrFetch`

Module :&emsp;`import { xhrFetch } from "@xlou/xfetch"`

#### 使用

``` typescript
xfetch("https://xxx.com", {
  method: "post",
  query: { // 转换为 url 参数
    id: 1
  },
  data: { // 转换为 body 参数，如果同时指定了 body ，此参数会失效
    name: "Tom",
    age: 18
  },
  contentType: "json", // 指定请求 headers 里的 Content-Type
  responseType: "json" // 开启 response 数据的预处理，指定 response 数据的类型
})
```

#### 类型

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

#### 参数说明

query

* 该参数支持 javascript 对象，发送请求时会转化为 url 参数字符串拼接到请求地址中
* 不会干扰请求地址上原有的参数

data

* 发送请求时会根据 headers 下的 Content-Type 值转化为 body 参数
* 如果同时指定了 body 参数，该参数会失效
* 该参数支持一般 javascript 对象
  * 当 Content-Type 为 application/json ，data 会转换为 json 字符串
  * 当 Content-Type 为 application/x-www-form-urlencoded ，data 会转换为 url 字符串
  * 当 Content-Type 为 multipart/form-data ，data 会转换为 FormData
  * 如果 data 可以转化为 json ，而 Content-Type 又没有指定，此时 Content-Type 会被指定为 application/json

contentType

* 指定请求 headers 下的 Content-Type
* 如果 Content-Type 已在 headers 里指定，则此参数会失效
* contentType 取值对应的 headers 下 Content-Type
  * json:&ensp; "application/json;charset=UTF-8"
  * urlencoded:&ensp; "application/x-www-form-urlencoded;charset=UTF-8"
  * formData:&ensp; "multipart/form-data"
  * text:&ensp; "text/plain;charset=UTF-8"
  * xml:&ensp; "application/xml;charset=UTF-8"
  * stream:&ensp; "application/octet-stream"

responseType

* 如果未指定该参数，得到的 response 数据与 fetch 无异
* 指定了该参数后，就意味着开启了 response 数据的预处理，会返回一个预处理好的同步数据

  ``` javascript
  /* 正常获取数据 */
  xfetch("https://xxx.com")
  .then(async res => {
    let json = await res.json()
  })

  /* 指定了 responseType 为 json */
  xfetch("https://xxx.com", {
    responseType: "json"
  })
  .then(res => {
    let json = res.jsonSync
    /* 如果 responseType 设置为 blob ，那么就用 blobSync 获取，以此类推 */
  })
  ```

其他参数同 fetch
