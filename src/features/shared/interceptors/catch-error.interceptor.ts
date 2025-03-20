import { HttpInterceptorFn } from '@angular/common/http';
import { catchError } from 'rxjs';
import { inject } from '@angular/core';

import { NotificationService } from '@features/shared';

export const catchErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const notification: NotificationService = inject(NotificationService);
  return next(req).pipe(catchError(err => {
    notification.open(`Oops, something went wrong: ${err.error.message}`);
    console.log('Error:', err.error.message);
    throw err;
  }));
};
