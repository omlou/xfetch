import { xhrFetch } from "./xhrfetch"
import { XHRHeaders, XHRFetchResponse } from "./classes"
import { xfetch, PropType, XFContentType, XFResponseType, XfetchInit, XfetchResponse, queryString } from "./main"

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