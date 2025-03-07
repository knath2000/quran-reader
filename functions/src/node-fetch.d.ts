/**
 * Type declaration for node-fetch module
 * This is needed to fix TypeScript errors during the Vercel build process
 */
declare module 'node-fetch' {
  export default function fetch(
    url: string | Request | URL,
    init?: RequestInit
  ): Promise<Response>;
  
  export class Request extends globalThis.Request {
    constructor(input: string | Request | URL, init?: RequestInit);
  }
  
  export class Response extends globalThis.Response {
    constructor(body?: BodyInit | null, init?: ResponseInit);
  }
  
  export type BodyInit = globalThis.BodyInit;
  export type HeadersInit = globalThis.HeadersInit;
  export type RequestInit = globalThis.RequestInit;
  export type RequestInfo = globalThis.RequestInfo;
  export type ResponseInit = globalThis.ResponseInit;
} 