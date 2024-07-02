import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthenticateComponent} from "./authenticate/authenticate.component";
import {NotFoundComponent} from "./not-found/not-found.component";
import {ResetpasswordComponent} from "./authenticate/resetpassword/resetpassword.component";
import {WalletDashboardModule} from "./mayssem/WalletDashboard/wallet-dashboard.module";
import {FicheClientComponent} from "./Fiches/fiche-client/fiche-client.component";
import {FicheEmployeeComponent} from "./Fiches/fiche-employee/fiche-employee.component";

const routes: Routes = [
  {
    path: 'auth',component:AuthenticateComponent
  },
  {
    path:'reset',component:ResetpasswordComponent
  },
  {path:'',
    redirectTo: 'auth',
    pathMatch: 'full'
  },
  { path: 'wallet', loadChildren: () => import("./mayssem/WalletDashboard/wallet-dashboard.module").then(m => m.WalletDashboardModule) },
  { path: 'fiche/Client/:id', component:FicheClientComponent },
  { path: 'fiche/Employee/:id', component:FicheEmployeeComponent },

  { path: 'interface1', loadChildren: () => import("./interface1/interface1.module").then(m => m.Interface1Module) },
  { path: 'interface2', loadChildren: () => import("./interface2/interface2.module").then(m => m.Interface2Module) },
  { path: 'interface3', loadChildren: () => import("./interface3/interface3.module").then(m => m.Interface3Module) },

  {path:"**",component:NotFoundComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
