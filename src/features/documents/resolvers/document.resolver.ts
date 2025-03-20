import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';

import { IDocument } from '../models';
import { RestApiService } from '@shared';

export const documentResolver: ResolveFn<IDocument> = (route, state) => {
  const restApi: RestApiService = inject(RestApiService);
  const docId = route.params['id'];
  return restApi.getDocument(docId);
};
