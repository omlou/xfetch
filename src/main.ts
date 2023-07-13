import {xhrFetch} from './xhrfetch'

export type PropType = string | number | symbol

type ValueType = string | number | symbol | boolean | null | undefined

interface SimpleParams {
  [prop: PropType]: ValueType
}

interface SimpleObject {
  [prop: string]: ValueType
}

export type XFContentType = "json" | "urlencoded" | "formData" | "text" | "xml" | "stream"

export type XFResponseType = "json" | "text" | "blob" | "arrayBuffer" | "formData"

const contentTypeObj: { [prop: string]: string } = {
  json: "application/json;charset=UTF-8",
  urlencoded: "application/x-www-form-urlencoded;charset=UTF-8",
  formData: "multipart/form-data",
  text: "text/plain;charset=UTF-8", 
  xml: "application/xml;charset=UTF-8",
  stream: "application/octet-stream"
}

export interface XfetchInit extends RequestInit{
  query?: SimpleParams,
  data?: BodyInit | null | SimpleParams
  contentType?: XFContentType
  responseType?: XFResponseType
}

export interface XfetchResponse extends Response{
  jsonSync?: string
  textSync?: string
  blobSync?: Blob
  arrayBufferSync?: ArrayBuffer
  formDataSync?: FormData
}

function getFetch(): Function {
  if (! window.fetch) window.fetch = xhrFetch
  return window.fetch
}

export function queryString(obj: SimpleObject, bol: boolean = false) {
  let arr = []
  for (let i in obj) {
    if (obj[i] === null || obj[i] === undefined) {
      obj[i] = ""
    } else {
      obj[i] = String(obj[i])
    }
    arr.push(encodeURIComponent(i) + '=' + encodeURIComponent(obj[i] as string))
  }
  let str = arr.join('&')
  return (str && bol)? ("?" + str) : str
}

function getHref(url: string, querystr: string): string {
  let index = url.indexOf("#")
  let href = ""
  let hash = ""
  if (index === -1) {
    href = url
  } else {
    href = url.substring(0,index)
    hash = url.substring(index)
  }
  href += href.includes("?") ? ("&" + querystr) : ("?" + querystr)
  return href + hash
}

function getContentType(headers: HeadersInit | undefined): string | null {
  if (! headers) return null
  if (Array.isArray(headers)) {
    for (let item of headers) {
      if(item[0].toLowerCase() === "content-type") return item[1]
    }
    return null
  }
  if (headers instanceof Headers) {
    return headers.get("content-type")
  }
  for (let i in headers) {
    let l = i.toLowerCase()
    if (l === "content-type") return headers[i]
  }
  return null
}

function setContentType(headers: HeadersInit, value: string){
  if (Array.isArray(headers)) {
    headers.push(["Content-Type", value])
  } else if (headers instanceof Headers) {
    headers.set("Content-Type", value)
  } else {
    headers["Content-Type"] = value
  }
}

export function xfetch(input: RequestInfo | URL, init?: XfetchInit | undefined): Promise<XfetchResponse> {
  const finalFetch = getFetch()
  /* if no init */
  if (! init) return finalFetch(input)
  /* handling the 'init' parameter */
  let { query, data, contentType, responseType } = (init as any)
  /* handling the 'query' */
  if (! (input instanceof Request) && query) {
    let querystr = queryString(query)
    if (querystr) {
      if (typeof(input) === "string") {
        input = getHref(input, querystr)
      } else {
        input = new URL(getHref(input.href, querystr))
      }
    }
  }
  /* handling the 'contentType' */
  let { headers } = (init as any)
  if (contentType) {
    if (! headers) {
      (init as any).headers = {
        "Content-Type": contentTypeObj[contentType]
      }
    } else if (! getContentType(headers)) {
      setContentType(headers, contentTypeObj[contentType])
    }
  }
  /* handling the 'data' */
  let {body} = (init as any)
  headers = (init as any).headers
  if (data) {
    if (! body) {
      let ctype: any = getContentType(headers)
      let res = data
      if (! (typeof(data) === "string")){
        if (ctype){
          if (ctype.includes("application/json")) {
            try {
              res = JSON.stringify(data)
            } catch (exc) {
              console.warn("Failed to convert \"data\" to JSON string.")
            }
          } else if (ctype.includes("application/x-www-form-urlencoded")) {
            try {
              res = queryString(data)
            } catch (exc) {
              console.warn("Failed to convert \"data\" to urlencoded string.")
            }
          } else if (ctype.includes("multipart/form-data") && ! (data instanceof FormData)) {
            try {
              let formData = new FormData()
              for (let i in data) {
                if (Object.prototype.hasOwnProperty.call(data, i)) {
                  formData.append(i, data[i])
                }
              }
              res = formData
            } catch (exc) {
              console.warn("Failed to convert \"data\" to FormData.")
            }
          }
        } else {
          /* if 'data' can be converted to JSON string and 'Content-Type' is not specified, it defaults to JSON */
          try {
            res = JSON.stringify(data)
            if (! headers) {
              (init as any).headers = {
                "Content-Type": "application/json;charset=UTF-8"
              }
            } else {
              setContentType(headers, "application/json;charset=UTF-8")
            }
          } catch (exc) {}
        }
      }
      (init as any).body = res
    }
  }
  /* handling the 'responseType' */
  if (! responseType) return finalFetch(input, init)
  return new Promise(function(resolve,reject){
    finalFetch(input, init)
    .then((response: any) => {
      const response1 = response.clone()
      response1[responseType]()
      .then((res: string) => {
        response[responseType + "Sync"] = res
        resolve(response)
      })
      .catch(() => {
        resolve(response)
      })
    })
    .catch((exc: any) => {
      reject(exc)
    })
  })
}