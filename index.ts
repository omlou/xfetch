import { xhrFetch } from "./src/xhrfetch"
import { XHRHeaders, XHRFetchResponse } from "./src/classes"
import { xfetch, PropType, XFContentType, XFResponseType, XfetchInit, XfetchResponse, queryString } from "./src/main"

declare global {
  interface Window {
    xfetch: any
    fetch: any
  }
}

export {
  /* xhrfetch */
  xhrFetch,
  /* classes */
  XHRHeaders,
  XHRFetchResponse,
  /* main */
  xfetch as default,
  PropType,
  XFContentType,
  XFResponseType,
  XfetchInit,
  XfetchResponse,
  queryString
}