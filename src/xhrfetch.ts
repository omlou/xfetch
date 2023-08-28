import { XHRFetchResponse, XHRHeaders } from './classes'

function getHeaders(arg: string | null): any {
  const headers: any = new (XHRHeaders as any)()
  if (arg !== null) {
    const arr = arg.trim().split(/[\r\n]+/)
    for (const item of arr) {
      const parts = item.split(': ')
      headers.append(parts[0], parts[1])
    }
  }
  return headers
}

function getOk(status: number): boolean {
  return status >= 200 && status <= 299
}

function getType(xhr: XMLHttpRequest): string {
  const res = /^https?:\/\/[\w-.]+(:\d+)?/i.exec(xhr.responseURL)
  const origin = res ? res[0] : null
  const type = (origin === window.location.origin) ? "basic" : "cors"
  return type
}

export function xhrFetch(input: RequestInfo | URL, init?: RequestInit | undefined): Promise<XHRFetchResponse> {
  return new Promise(function(resolve, reject) {
    const xhr = new XMLHttpRequest()
    xhr.addEventListener('load', ev => {
      console.log("load", ev, xhr)
      const headers = xhr.getAllResponseHeaders()
      const res = new (XHRFetchResponse as any)(xhr.response, false, getHeaders(headers), getOk(xhr.status), false, xhr.status, xhr.statusText, getType(xhr), xhr.responseURL)
      resolve(res)
    })
    xhr.addEventListener('error', ev => {
      console.log("error", ev, xhr)
      reject("TypeError: Failed to fetch")
    })
    xhr.addEventListener('timeout', ev => {
      console.log("timeout", ev, xhr)
      reject("TypeError: Failed to fetch")
    })
    let method = "GET"
    if (init) {
      method = (init.method?.toUpperCase() || "GET")
    }
    let simrequ = false
    if (new Set(['GET', 'DELETE', 'HEAD', 'OPTIONS', 'TRACE']).has(method)) simrequ = true
    if (input instanceof Request) input = input.url
    xhr.open(method, input, true)
    xhr.responseType = "blob"
    if (init) {
      if (init.credentials && init.credentials === "include") {
        xhr.withCredentials = true
      }
      const { headers } = init
      if (headers) {
        if (Array.isArray(headers)) {
          for (const item of headers) {
            xhr.setRequestHeader(item[0], item[1])
          }
        } else if (headers instanceof Headers) {
          headers.forEach((item, i) => {
            xhr.setRequestHeader(i, item)
          })
        } else {
          for (const i in headers) {
            xhr.setRequestHeader(i, headers[i])
          }
        }
      }
    }
    let body = null
    if (init) {
      body = (init.body || null)
    }
    if (body instanceof ReadableStream) throw "Body does not support ReadableStream in XMLHttpRequest."
    xhr.send(body)
  })
}