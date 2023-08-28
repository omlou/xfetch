import { xhrFetch } from "./xhrfetch"
import { XHRHeaders, XHRFetchResponse } from "./classes"
import { xfetch, queryString } from "./main"

Object.assign(xfetch, {
  xhrFetch,
  XHRHeaders,
  XHRFetchResponse,
  queryString
})

export default xfetch