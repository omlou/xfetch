import {XHRFetchResponse, XHRHeaders} from './classes'

function getHeaders(arg: string | null): any {
  const headers: any = new (XHRHeaders as any)()
  if (arg !== null) {
    let arr = arg.trim().split(/[\r\n]+/)
    for (let item of arr) {
      let parts = item.split(': ')
      headers.append(parts[0], parts[1])
    }
  }
  return headers
}

function getOk(status: number): boolean {
  return  status >= 200 && status <= 299
}

function getType(xhr: XMLHttpRequest): string {
  let origin = /^https?:\/\/[\w-.]+(:\d+)?/i.exec(xhr.responseURL) ?. [0]
  let type = (origin === window.location.origin) ? "basic" : "cors"
  return type
}

export function xhrFetch(input: RequestInfo | URL, init?: RequestInit | undefined): Promise<XHRFetchResponse> {
  return new Promise(function(resolve, reject) {
    let xhr = new XMLHttpRequest()
    xhr.addEventListener('load', ev => {
      console.log("load", ev, xhr)
      const headers = xhr.getAllResponseHeaders()
      const res = new (<any>(XHRFetchResponse))(xhr.response, false, getHeaders(headers), getOk(xhr.status), false, xhr.status, xhr.statusText, getType(xhr), xhr.responseURL)
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
    if ((new Set(['GET', 'DELETE', 'HEAD', 'OPTIONS', 'TRACE'])).has(method)) simrequ = true
    if (input instanceof Request) input = input.url
    xhr.open(method, input, true)
    xhr.responseType = "blob"
    if (init) {
      if (init.credentials) {
        switch (init.credentials) {
          case "include": {
            xhr.withCredentials = true
            break
          }
        }
      }
      if (init.headers) {
        let {headers} = init
        if (Array.isArray(headers)) {
          for (let item of headers) {
            xhr.setRequestHeader(item[0], item[1])
          }
        } else if(headers instanceof Headers) {
          headers.forEach((item, i) => {
            xhr.setRequestHeader(i, item)
          })
        } else {
          for (let i in headers) {
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