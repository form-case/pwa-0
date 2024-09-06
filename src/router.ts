import { html } from 'lit';

if (!(globalThis as any).URLPattern) {
  await import("urlpattern-polyfill");
}

import { Router } from '@thepassle/app-tools/router.js';
import { lazy } from '@thepassle/app-tools/router/plugins/lazy.js';

// @ts-ignore
import { title } from '@thepassle/app-tools/router/plugins/title.js';

import './pages/app-home.js';

const baseURL: string = (import.meta as any).env.BASE_URL;

export const router = new Router({
    routes: [
      {
        path: resolveRouterPath(),
        title: 'Home',
        render: () => html`<app-home></app-home>`
      },
      {
        path: resolveRouterPath('about'),
        title: 'About',
        plugins: [
          lazy(() => import('./pages/app-about/app-about.js')),
        ],
        render: () => html`<app-about></app-about>`
      },
      {
        path: resolveRouterPath('participant-list'),
        title: 'Participant List',
        plugins: [
          lazy(() => import('./pages/participant-list.js')),
        ],
        render: () => html`<app-participant-list></app-participant-list>`
      },
      {
        path: resolveRouterPath('form'),
        title: 'Forms',
        plugins: [
          lazy(() => import('./pages/form.js')),  // Asegúrate de que sea form.js, no app-form.js
        ],
        render: () => html`<app-form></app-form>`
      }
    ]
  });

// Esta función resuelve la ruta con la URL base pasada durante el proceso de construcción
export function resolveRouterPath(unresolvedPath?: string) {
  var resolvedPath = baseURL;
  if(unresolvedPath) {
    resolvedPath = resolvedPath + unresolvedPath;
  }
  return resolvedPath;
}
