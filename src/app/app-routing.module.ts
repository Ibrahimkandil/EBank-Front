import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthenticateComponent} from "./authenticate/authenticate.component";
import {NotFoundComponent} from "./not-found/not-found.component";
import {ResetpasswordComponent} from "./authenticate/resetpassword/resetpassword.component";
import {WalletDashboardModule} from "./mayssem/WalletDashboard/wallet-dashboard.module";

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
  { path: 'agence', loadChildren: () => import("./agence/agence.module").then(m => m.AgenceModule) },

  { path: 'interface1', loadChildren: () => import("./interface1/interface1.module").then(m => m.Interface1Module) },
  {path:"**",component:NotFoundComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
