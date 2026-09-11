import { HttpInterceptorFn } from "@angular/common/http";
import { inject, REQUEST } from "@angular/core";
import { environment } from "../../../environments/environment";

export const ssrAuthCookieInterceptor: HttpInterceptorFn = (req, next) => {
  const request = inject(REQUEST);

  if (!request) {
    return next(req);
  }

  if (!req.url.startsWith(environment.apiUrl)) {
    return next(req);
  }

  const cookie = request.headers.get('cookie');

  if (!cookie) {
    return next(req);
  }


  return next(
    req.clone({
      headers: req.headers.set('Cookie', cookie),
      withCredentials: true,
    }),
  );
};