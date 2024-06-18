import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthenticateComponent} from "./authenticate/authenticate.component";
import {NotFoundComponent} from "./not-found/not-found.component";

const routes: Routes = [
  {
    path: 'auth',component:AuthenticateComponent
  },
  {path:'',
    redirectTo: 'auth',
    pathMatch: 'full'
  },
  { path: 'interface1', loadChildren: () => import("./interface1/interface1.module").then(m => m.Interface1Module) },
  {path:"**",component:NotFoundComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
