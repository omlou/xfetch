## 言語

* [English](https://github.com/omlou/xfetch#readme)
* [简体中文](https://github.com/omlou/xfetch/blob/master/docs/md/readme-zh.md)
* [日本語](https://github.com/omlou/xfetch/blob/master/docs/md/readme-ja.md)
* [한국어](https://github.com/omlou/xfetch/blob/master/docs/md/readme-ko.md)
* [Français](https://github.com/omlou/xfetch/blob/master/docs/md/readme-fr.md)

## 紹介

* fetchの使用を簡略化し、高速化します。
* ブラウザ環境がfetchをサポートしていなくても心配しないでください。古いブラウザを使用している場合、xfetchはXMLHttpRequestを使用してfetchをエミュレートします。
* ネイティブの実装を尊重し、パフォーマンスを優先します。

## 使い方

### スクリプトタグを使用してインポート

```html
<script src="https://unpkg.com/@xlou/xfetch@1.0.3/dist/umd/xfetch.min.js"></script>
<!-- ローカルでスクリプトをダウンロードして使用することをお勧めします -->
<script>
  /* このスクリプトを含めた後、xfetchオブジェクトがウィンドウに割り当てられます */
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

### Node.jsプロジェクトで使用する

インストール

```bash
npm i @xlou/xfetch -S
```

使用法

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

#### 取得

スクリプトタグ: `window.xfetch`

モジュール: `import xfetch from "@xlou/xfetch"`

#### 使用法

```typescript
xfetch("https://xxx.com", {
  method: "post",
  query: { // URLパラメータに変換
    id: 1
  },
  data: { // ボディパラメータに変換；同時にボディが指定された場合、このパラメータは無視されます
    name: "Tom",
    age: 18
  },
  contentType: "json", // リクエストヘッダのContent-Typeを指定
  responseType: "json" // レスポンスデータの前処理を有効にし、レスポンスデータのタイプを指定
})
```

#### タイプ

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

#### パラメータの説明

query

* このパラメータはJavaScriptオブジェクトをサポートし、リクエストURLに追加されるURLパラメータ文字列に変換されます。
* リクエストURLの既存のパラメータに干渉しません。

data

* リクエストを送信する際、ヘッダー内のContent-Typeの値に基づいてボディパラメータに変換されます。
* ボディパラメータが同時に指定された場合、このパラメータは無視されます。
* このパラメータは一般的なJavaScriptオブジェクトをサポートします。
  * Content-Typeが"application/json"の場合、dataはJSON文字列に変換されます。
  * Content-Typeが"application/x-www-form-urlencoded"の場合、dataはURLエンコードされた文字列に変換されます。
  * Content-Typeが"multipart/form-data"の場合、dataはFormDataに変換されます。
  * dataがJSONに変換でき、Content-Typeが指定されていない場合、Content-Typeは"application/json"に設定されます。

contentType

* リクエストヘッダのContent-Typeを指定します。
* 既にヘッダーでContent-Typeが指定されている場合、このパラメータは無視されます。
* contentTypeの値はヘッダーのContent-Typeに対応します：
  * json: "application/json;charset=UTF-8"
  * urlencoded: "application/x-www-form-urlencoded;charset=UTF-8"
  * formData: "multipart/form-data"
  * text: "text/plain;charset=UTF-8"
  * xml: "application/xml;charset=UTF-8"
  * stream: "application/octet-stream"

responseType

* このパラメータが指定されていない場合、取得されたレスポンスデータはfetchと同じです。
* このパラメ

ータを指定すると、レスポンスデータの前処理が有効になり、前処理済みの同期データが返されます。

  ```javascript
  /* 通常のデータの取得 */
  xfetch("https://xxx.com")
  .then(async res => {
    let json = await res.json()
  })

  /* responseTypeをjsonに指定した場合 */
  xfetch("https://xxx.com", {
    responseType: "json"
  })
  .then(res => {
    let json = res.jsonSync
    /* responseTypeがblobに設定されている場合、blobSyncを使用します。 */
  })
  ```

その他のパラメータはfetchと同じです。

### xhrFetch

#### 取得

スクリプトタグ: `xfetch.xhrFetch`

モジュール: `import { xhrFetch } from "@xlou/xfetch"`

#### 使用法

使用法はfetchと同じですが、XMLHttpRequestを使用して実装されています。この代わりにこの機能を使用することをお勧めします。

キャッシュ、モード、シグナル、キープアライブ、リダイレクト、整合性、リファラ、リファラポリシーなどのリクエストパラメータは無効です。

応答パラメータ内のボディはReadableStreamではなくBlob型です。

#### タイプ

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