export interface XHRHeaders {
  [Symbol.iterator]?(): IterableIterator<[string, string]>
  append(name: string, value: string): void
  delete(name: string): void
  get(name: string): string | null
  has(name: string): boolean
  set(name: string, value: string): void
  forEach(callback: (value: string, key: string, parent: Headers) => void, thisArg?: any): void
  entries(): IterableIterator<[string, string]>
  keys(): IterableIterator<string>
  values(): IterableIterator<string>
}

interface Hs {
  [prop: string]: string
}
const hs: Hs = {}

export function XHRHeaders() {}

Object.assign(XHRHeaders.prototype, {
  get(key: string): string | null {
    let res: any = hs[key]
    if (res === undefined) res = null
    return res
  },
  set(key: string, value: string): void {
    hs[key] = value
  },
  append(key: string, value: string): void {
    let val = hs[key]
    if (val === undefined) {
      hs[key] = value
    } else {
      hs[key] = val + ", " + value
    }
  },
  delete(key: string): void {
    delete hs[key]
  },
  has(key: string): boolean {
    return Object.prototype.hasOwnProperty.call(hs, key)
  },
  keys(): IterableIterator<string> {
    return Object.keys(hs)[Symbol.iterator]()
  },
  values(): IterableIterator<string> {
    return (Object.values(hs) as string[])[Symbol.iterator]()
  },
  entries(): IterableIterator<[string, string]> {
    const keys = Object.keys(hs)
    const entries = keys.map((key) => [key, hs[key]])
    return (entries as Array<[string, string]>)[Symbol.iterator]()
  },
  forEach(callback: (value: string, key: string, parent: any) => void, thisArg?: any) {
    for (let key in hs) {
      if (Object.prototype.hasOwnProperty.call(hs, key)) {
        thisArg ? callback.call(thisArg, hs[key], key, hs) : callback(hs[key], key, hs)
      }
    }
  }
})

if (Symbol && Symbol.iterator) {
  XHRHeaders.prototype[Symbol.iterator] = function (): IterableIterator<[string, string]> {
    const keys = Object.keys(hs)
    const entries = keys.map((key) => [key, hs[key]])
    return (entries as Array<[string, string]>)[Symbol.iterator]()
  }
}

export interface XHRFetchResponse {
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

export function XHRFetchResponse(
  body: Blob,
  bodyUsed: boolean,
  headers: any,
  ok: boolean,
  redirected: boolean,
  status: number,
  statusText: string,
  type: string,
  url: string
) {
  this.body = body
  this.bodyUsed = bodyUsed
  this.headers = headers
  this.ok = ok
  this.redirected = redirected
  this.status = status
  this.statusText = statusText
  this.type = type
  this.url = url
}

Object.assign(XHRFetchResponse.prototype, {
  async blob(): Promise<Blob> {
    return this.body
  },
  async arrayBuffer(): Promise<ArrayBuffer> {
    return this.body.arrayBuffer()
  },
  clone(): XHRFetchResponse {
    return this
  },
  async formData(): Promise<FormData> {
    const formData = new FormData()
    const { type, data } = await readBlob(this.body)
    switch (type) {
      case "text": {
        let json = null
        try {
          json = JSON.parse(data)
          for (let key in json) {
            if (Object.prototype.hasOwnProperty.call(json, key)) {
              formData.append(key, json[key])
            }
          }
          return formData
        } catch (exc) {
          throw "Target cannot be converted to FormData."
        }
      }
      default: {
        formData.append("file", data)
        return formData
      }
    }
  },
  async json(): Promise<any> {
    let json = null
    const { type, data } = await readBlob(this.body)
    if (type === "text") {
      try {
        json = JSON.parse(data)
        return json
      } catch (exc) {
        throw "Target is not json."
      }
    } else {
      throw "Target is not json."
    }
  },
  async text(): Promise<any> {
    const { data } = await readBlob(this.body, "text/plain")
    return data
  }
})

function readBlob(blob: Blob, type?: string): Promise<any> {
  const fileType = type || blob.type
  return new Promise((resolve, reject) => {
    switch (fileType) {
      case "text/plain":
      case "application/json":
      case "": {
        const reader = new FileReader()
        reader.onload = () => {
          const text = reader.result as string
          resolve({
            type: "text",
            data: text
          })
        }
        reader.onerror = (error) => {
          reject(error)
        }
        reader.readAsText(blob)
        break
      }
      default: {
        resolve({
          type: "file",
          data: blob
        })
      }
    }
  })
}
