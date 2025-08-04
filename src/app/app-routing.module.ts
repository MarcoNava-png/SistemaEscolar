import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () =>
      import('./components/login/login.module').then((m) => m.LoginModule),
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./components/home/home.module').then((m) => m.HomeModule),
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  { path: 'alumnos', loadChildren: () => import('./components/alumnos/alumnos.module').then(m => m.AlumnosModule) },
  { path: 'maestros', loadChildren: () => import('./components/maestros/maestros.module').then(m => m.MaestrosModule) },
  { path: 'grupos', loadChildren: () => import('./components/grupos/grupos.module').then(m => m.GruposModule) },
  {
    path: '**',
    redirectTo: 'login',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
