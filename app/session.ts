import { type unstable_MiddlewareFunction as MiddlewareFunction } from "react-router";
import { createCookieSessionStorage } from "./modules/cookie/cookie-storage.ts";
import type { Session } from "./modules/cookie/sessions.ts";
import { AsyncLocalStorage } from "node:async_hooks";

let storage = createCookieSessionStorage({
  cookie: {
    secrets: ["who cares its just a demo"],
    name: "_session",
    maxAge: 60 * 60 * 24 * 365,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  },
});

let context = new AsyncLocalStorage<Session>();

// TODO: do we need to wrap in a promise to return the response? We'll see!
export let sessionMiddleware: MiddlewareFunction<Response> = async (
  { request },
  next,
) => {
  let cookieHeader = request.headers.get("Cookie");
  let session = await storage.getSession(cookieHeader);
  return new Promise(resolve => {
    context.run(session, async () => {
      let response = await next();
      response.headers.append(
        "Set-Cookie",
        await storage.commitSession(session),
      );
      resolve(response);
    });
  });
};

export function session() {
  return context.getStore() as Session;
}
