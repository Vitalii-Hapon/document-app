import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';

import { LoaderService } from '@features/shared';

export const loaderInterceptor: HttpInterceptorFn = (req, next) => {
  const loader = inject(LoaderService);
  loader.startLoading();
  const modifiedRequest = req.clone();
  return next(modifiedRequest).pipe(
    finalize(() => loader.endLoading())
  );
};
