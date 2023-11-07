## Langues

* [English](https://github.com/omlou/xfetch#readme)
* [简体中文](https://github.com/omlou/xfetch/blob/master/docs/md/readme-zh.md)
* [日本語](https://github.com/omlou/xfetch/blob/master/docs/md/readme-ja.md)
* [한국어](https://github.com/omlou/xfetch/blob/master/docs/md/readme-ko.md)
* [Français](https://github.com/omlou/xfetch/blob/master/docs/md/readme-fr.md)

## Introduction

* Utilisez fetch de manière plus simple et plus rapide.
* Ne vous inquiétez pas si votre environnement de navigation ne prend pas en charge fetch. Si vous utilisez un navigateur plus ancien, xfetch utilisera XMLHttpRequest pour simuler fetch.
* Respecte les normes natives et met l'accent sur les performances.

## Utilisation

### Importation via la balise script

```html
<script src="https://unpkg.com/@xlou/xfetch@1.0.3/dist/umd/xfetch.min.js"></script>
<!-- Il est recommandé de télécharger le fichier pour l'utiliser. -->
<script>
  /* Après avoir importé ce fichier JavaScript, l'objet xfetch sera attribué à la fenêtre. */
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

### Utilisation dans un projet Node.js

Installation

``` bash
npm i @xlou/xfetch -S
```

Utilisation

``` javascript
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

#### Importation

Balise script :&emsp;`window.xfetch`

Module :&emsp;`import xfetch from "@xlou/xfetch"`

#### Utilisation

``` typescript
xfetch("https://xxx.com", {
  method: "post",
  query: { // Converti en paramètres d'URL
    id: 1
  },
  data: { // Converti en paramètres du corps, si le corps est spécifié en même temps, ce paramètre sera ignoré
    name: "Tom",
    age: 18
  },
  contentType: "json", // Spécifie le Content-Type dans les en-têtes de la requête
  responseType: "json" // Active la prétraitement des données de réponse et spécifie le type de données de réponse
})
```

#### Types

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

#### Description des paramètres

query

* Ce paramètre prend en charge les objets JavaScript et est converti en une chaîne de paramètres d'URL lors de l'envoi de la requête.
* Il n'affectera pas les paramètres d'URL existants de l'adresse de la requête.

data

* Lors de l'envoi de la requête, il est converti en paramètres du corps en fonction de la valeur Content-Type dans les en-têtes de la requête.
* Si le corps est spécifié en même temps, ce paramètre sera ignoré.
* Ce paramètre prend en charge les objets JavaScript courants.
  * Lorsque le Content-Type est application/json, les données sont converties en chaînes JSON.
  * Lorsque le Content-Type est application/x-www-form-urlencoded, les données sont converties en chaînes URL.
  * Lorsque le Content-Type est multipart/form-data, les données sont converties en FormData.
  * Si les données peuvent être converties en JSON et que le Content-Type n'est pas spécifié, le Content-Type est automatiquement défini sur application/json.

contentType

* Spécifie le Content-Type dans les en-têtes de la requête.
* Si le Content-Type est déjà spécifié dans les en-têtes, ce paramètre sera ignoré.
* Valeurs possibles pour contentType et les Content-Type correspondants dans les en-têtes :
  * json:&ensp; "application/json;charset=UTF-8"
  * urlencoded:&ensp; "application/x-www-form-urlencoded;charset=UTF-8"
  * formData:&ensp; "multipart/form-data"
  * text:&ensp; "text/plain;charset=UTF-8"
  * xml:&ensp; "application/xml;charset=UTF-8"
  * stream:&ensp; "application/octet-stream"

responseType

* Si ce paramètre n'est pas spécifié, les données de réponse seront les mêmes que pour fetch.
* Si ce paramètre est spécifié, cela signifie que le prétraitement des données de réponse est activé, et des données prétraitées seront renvoyées de manière synchrone.

  ``` javascript
  /* Récupération normale des données */
  xfetch("https://xxx.com")
  .then(async res => {
    let json = await res.json()
  })

  /* Spécification de responseType en tant que json */
  xfetch("https://xxx.com", {
    responseType: "json"
  })
  .then(res => {
    let json = res.jsonSync
    /* Si responseType est défini sur blob, utilisez blobSync, et ainsi de suite. */
  })
  ```

Les autres paramètres sont les mêmes que pour fetch.

### xhrFetch

#### Importation

Balise script :&emsp;`xfetch.xhrFetch`

Module :&emsp;`import { xhrFetch } from "@xlou/xfetch"`

#### Utilisation

Utilisation identique à fetch, mais implémentée à l'aide de XMLHttpRequest. Il est recommandé d'utiliser xfetch à la place de cela

.

Les paramètres de requête tels que cache, mode, signal, keepalive, redirect, integrity, referrer et referrerPolicy définis dans la demande sont ignorés.

Dans les paramètres de réponse, le corps est de type Blob au lieu de ReadableStream.

#### Types

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