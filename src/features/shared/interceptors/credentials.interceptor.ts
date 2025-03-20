import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';

import { AuthService } from '../../user';

export const credentialsInterceptor: HttpInterceptorFn = (
  request: HttpRequest<any>,
  next: HttpHandlerFn
) => {
  const authService = inject(AuthService);
  if (authService.token) {
    const modifiedRequest = request.clone({headers: request.headers.set('Authorization', `Bearer ${authService.token}`)});
    return next(modifiedRequest);
  }
  return next(request);
};
