import { Routes } from '@angular/router';
import { documentsGuard } from '@shared';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'documents',
    pathMatch: 'full',
  },
  {
    path: 'documents',
    canActivate: [documentsGuard],
    loadChildren: () => import('../pages/documents/documents.module').then(module => module.DocumentsModule),
  },
  {
    path: 'login',
    title: 'Login',
    loadComponent: () => import('../pages/login/login.page').then(page => page.LoginPage),
  },
  {
    path: '**',
    title: 'Page was not found',
    loadComponent: () => import('../pages/not-found/not-found.page').then((page) => page.NotFoundPage)
  },
];
