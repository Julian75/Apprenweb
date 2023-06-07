import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './templates/vista/inicio/inicio.component';
import { LoginComponent } from './templates/login/login.component';
import { VistaComponent } from './templates/vista/vista.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
  },
  {
    path: 'vista',
    component: VistaComponent,
    loadChildren: () => import('./templates/vista/vista.module').then(m => m.VistaModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
