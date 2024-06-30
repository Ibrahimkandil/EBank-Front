import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthenticateComponent} from "./authenticate/authenticate.component";
import {NotFoundComponent} from "./not-found/not-found.component";
import {ResetpasswordComponent} from "./authenticate/resetpassword/resetpassword.component";
import {WalletDashboardModule} from "./mayssem/WalletDashboard/wallet-dashboard.module";
import { CompteComponent } from './Ahmed/compte/compte.component';
import { TransactionComponent } from './Ahmed/transaction/transaction.component';
import { TransfertComponent } from './Ahmed/transfert/transfert.component';

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

  { path: 'interface1', loadChildren: () => import("./interface1/interface1.module").then(m => m.Interface1Module) },
  { path: 'interface2', loadChildren: () => import("./interface2/interface2.module").then(m => m.Interface2Module) },
  {
    path:'compte', component: CompteComponent
  },
  {
    path:'transaction', component: TransactionComponent
  },
  {
    path:'transfert', component: TransfertComponent
  },
  {path:"**",component:NotFoundComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
