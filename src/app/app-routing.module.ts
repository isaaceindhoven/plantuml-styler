import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DiagramComponent } from './components/diagram/diagram.component';


const routes: Routes = [
  {
    path: '',
    component: DiagramComponent
  },
  {
    path: '**',
    redirectTo: '',
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
