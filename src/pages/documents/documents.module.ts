import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { documentResolver } from '@features/documents';

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild([
      {
        path: '',
        redirectTo: 'panel',
        pathMatch: 'full'
      },
      {
        path: 'panel',
        title: 'Documents Panel',
        loadComponent: () => import('./documents-panel/documents-panel.page')
          .then(page => page.DocumentsPanelPage),
      },
      {
        path: 'document/:id',
        title: 'Document',
        resolve: {
          document: documentResolver,
        },
        loadComponent: () => import('./document-view/document-view.page')
          .then(page => page.DocumentViewPage)
      },
      {
        path: 'document-creator',
        title: 'Create document',
        loadComponent: () => import('./document-creat/document-creat.page')
          .then(page => page.DocumentCreatPage)
      }
    ])
  ],
})
export class DocumentsModule { }
