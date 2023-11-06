## 言語

* [English](https://github.com/omlou/xfetch#readme)
* [简体中文](https://github.com/omlou/xfetch/blob/master/docs/md/readme-zh.md)
* [日本語](https://github.com/omlou/xfetch/blob/master/docs/md/readme-ja.md)
* [한국어](https://github.com/omlou/xfetch/blob/master/docs/md/readme-ko.md)
* [Français](https://github.com/omlou/xfetch/blob/master/docs/md/readme-fr.md)

## 紹介

* fetchの使用を簡素化し、迅速化します。
* ブラウザ環境がfetchに対応していなくても心配いりません。古いブラウザを使用している場合、xfetchはXMLHttpRequestを使用してfetchをシミュレートします。
* ネイティブの動作を尊重し、パフォーマンスに焦点を当てています。

## 使用法

### スクリプトタグを使用してインポート

```html
<script src="https://unpkg.com/@xlou/xfetch@1.0.2/dist/umd/xfetch.min.js"></script>
<!-- ローカルにダウンロードして使用することをお勧めします -->
<script>
  /* このJSファイルをインポートした後、xfetchオブジェクトがウィンドウに割り当てられます */
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

スクリプトタグ： `window.xfetch`

モジュール： `import xfetch from "@xlou/xfetch"`

#### 使用法

```typescript
xfetch("https://xxx.com", {
  method: "post",
  query: { // URLパラメータに変換
    id: 1
  },
  data: { // リクエストボディパラメータに変換; ボディパラメータが同時に指定された場合、このパラメータは無効になります
    name: "Tom",
    age: 18
  },
  contentType: "json", // リクエストヘッダーのContent-Typeを指定
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

* このパラメータはJavaScriptオブジェクトをサポートし、リクエストを送信する際にURLパラメータ文字列に変換され、リクエストURLに追加されます。
* リクエストURLの元のパラメータに干渉しません。

data

* リクエストを送信する際、ヘッダー内のContent-Typeの値に基づいてボディパラメータに変換されます。
* ボディパラメータが同時に指定された場合、このパラメータは無効になります。
* このパラメータは一般的なJavaScriptオブジェクトをサポートします:
  * Content-Typeがapplication/jsonの場合、データはJSON文字列に変換されます。
  * Content-Typeがapplication/x-www-form-urlencodedの場合、データはURLエンコードされた文字列に変換されます。
  * Content-Typeがmultipart/form-dataの場合、データはFormDataに変換されます。
  * データがJSONに変換でき、Content-Typeが指定されていない場合、Content-Typeはapplication/jsonに設定されます。

contentType

* リクエストヘッダーのContent-Typeを指定します。
* ヘッダー内で既にContent-Typeが指定されている場合、このパラメータは無効になります。
* contentTypeの値はヘッダー内のContent-Typeに対応します:
  * json:&ensp; "application/json;charset=UTF-8"
  * urlencoded:&ensp; "application/x-www-form-urlencoded;charset=UTF-8"
  * formData:&ensp; "multipart/form-data"
  * text:&ensp; "text/plain;charset=UTF-8"
  * xml:&ensp; "application/xml;charset=UTF-8"
  * stream:&ensp; "application/octet-stream"

responseType

*

 このパラメータが指定されていない場合、レスポンスデータはfetchと同じです。
* このパラメータが指定されている場合、レスポンスデータの前処理が有効になり、前処理された同期データが返されます。

  ```javascript
  /* データを正常に取得する */
  xfetch("https://xxx.com")
  .then(async res => {
    let json = await res.json()
  })

  /* responseTypeをjsonに指定 */
  xfetch("https://xxx.com", {
    responseType: "json"
  })
  .then(res => {
    let json = res.jsonSync
    /* responseTypeがblobに設定されている場合、blobSyncを使用し、同様にします */
  })
  ```

その他のパラメータはfetchと同じです。

### xhrFetch

#### 取得

スクリプトタグ: `xfetch.xhrFetch`

モジュール: `import { xhrFetch } from "@xlou/xfetch"`

#### 使用法

```typescript
xfetch("https://xxx.com", {
  method: "post",
  query: { // URLパラメータに変換
    id: 1
  },
  data: { // リクエストボディパラメータに変換; ボディパラメータが同時に指定された場合、このパラメータは無効になります
    name: "Tom",
    age: 18
  },
  contentType: "json", // リクエストヘッダーのContent-Typeを指定
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

* このパラメータはJavaScriptオブジェクトをサポートし、リクエストを送信する際にURLパラメータ文字列に変換され、リクエストURLに追加されます。
* リクエストURLの元のパラメータに干渉しません。

data

* リクエストを送信する際、ヘッダー内のContent-Typeの値に基づいてボディパラメータに変換されます。
* ボディパラメータが同時に指定された場合、このパラメータは無効になります。
* このパラメータは一般的なJavaScriptオブジェクトをサポートします:
  * Content-Typeがapplication/jsonの場合、データはJSON文字列に変換されます。
  * Content-Typeがapplication/x-www-form-urlencodedの場合、データはURLエンコードされた文字列に変換されます。
  * Content-Typeがmultipart/form-dataの場合、データはFormDataに変換されます。
  * データがJSONに変換でき、Content-Typeが指定されていない場合、Content-Typeはapplication/jsonに設定されます。

contentType

* リクエストヘッダーのContent-Typeを指定します。
* ヘッダー内で既にContent-Typeが指定されている場合、このパラメータは無効になります。
* contentTypeの値はヘッダー内のContent-Typeに対応します:
  * json:&ensp; "application/json;charset=UTF-8"
  * urlencoded:&ensp; "application/x-www-form-urlencoded;charset=UTF-8"
  * formData:&ensp; "multipart/form-data"
  * text:&ensp; "text/plain;charset=UTF-8"
  * xml:&ensp; "application/xml;charset=UTF-8"
  * stream:&ensp; "application/octet-stream"

responseType

* このパラメータが指定されていない場合、レスポンスデータはfetchと同じです。
* このパラメータが指定されている場合、レスポンスデータの前処理が有効になり、前処理された同期データが返されます。

  ```javascript
  /* データを正常に取得する */
  xfetch("https://xxx.com")
  .then(async res => {
    let json = await res.json()
  })

  /* responseTypeをjsonに指定 */
  xfetch("https://xxx.com", {
    responseType: "json"
  })
  .then(res => {
    let json = res.jsonSync
    /* responseTypeがblobに設定されている場合、blobSyncを使用し、同様にします */
  })
  ```

その他のパラメータはfetchと同じです。