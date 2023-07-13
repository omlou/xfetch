export interface XHRHeaders{
  [Symbol.iterator]? (): IterableIterator<[string, string]>
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
  get: function(key: string): string | null {
    let res: any = hs[key]
    if (res === undefined) res = null
    return res
  },
  set: function(key: string, value: string): void {
    hs[key] = value
  },
  append: function(key: string, value: string): void {
    let val = hs[key]
    if (val === undefined) {
      hs[key] = value
    } else {
      hs[key] = val + ", " + value
    }
  },
  delete: function(key: string): void {
    delete hs[key]
  },
  has: function(key: string): boolean {
    return hs.hasOwnProperty(key)
  },
  keys: function(): IterableIterator<string> {
    return Object.keys(hs).values()
  },
  values: function(): IterableIterator<string> {
    return (Object.values(hs) as Array<string>).values()
  },
  entries: function(): IterableIterator<[string, string]> {
    return (Object.entries(hs) as Array<[string, string]>).values()
  },
  forEach: function(callback: (value: string, key: string, parent: any) => void, thisArg?: any) {
    for (let i in hs) {
      thisArg ? callback.call(thisArg, hs[i], i, hs) : callback(hs[i], i, hs)
    }
  },
})
if (Symbol && Symbol.iterator) {
  XHRHeaders.prototype[Symbol.iterator] = function(): IterableIterator<[string, string]> {
    return (Object.entries(hs) as Array<[string, string]>).values()
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

export function XHRFetchResponse(body: Blob, bodyUsed: boolean, headers: any, ok: boolean, redirected: boolean, status: number, statusText: string, type: string, url: string) {
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
  blob: async function (): Promise<Blob> {
    return this.body
  },
  arrayBuffer: async function (): Promise<ArrayBuffer> {
    return this.body.arrayBuffer()
  },
  clone: function (): XHRFetchResponse {
    return this
  },
  formData: async function (): Promise<FormData> {
    const formData = new FormData()
    const {type, data} = await readBlob(this.body)
    switch (type) {
      case "text": {
        let json = null
        try {
          json = JSON.parse(data)
          for (let i in json) {
            formData.append(i, json[i])
          }
          return formData
        } catch(exc) {
          throw "Target cannot be converted to FormData."
        }
      }
      default: {
        formData.append('file', data)
        return formData
      }
    }
  },
  json: async function (): Promise<any> {
    let json = null
    const {type, data} = await readBlob(this.body)
    if (type === "text") {
      try {
        json = JSON.parse(data)
        return json
      } catch(exc) {
        throw "Target is not json."
      }
    } else {
      throw "Target is not json."
    }
  },
  text: async function (): Promise<any> {
    const {data} = await readBlob(this.body, "text/plain")
    return data
  }
})
function readBlob(blob: Blob, type?: string): Promise<any> {
  const fileType = (type || blob.type)
  return new Promise((resolve, reject) => {
    switch (fileType) {
      case "text/plain":
      case "application/json":
      case "": {
        const reader = new FileReader()
        reader.onload = () => {
          const text = <string>(reader.result)
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