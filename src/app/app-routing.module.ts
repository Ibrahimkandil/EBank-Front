import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthenticateComponent} from "./authenticate/authenticate.component";
import {NotFoundComponent} from "./not-found/not-found.component";
import {ResetpasswordComponent} from "./authenticate/resetpassword/resetpassword.component";
import {WalletDashboardModule} from "./mayssem/WalletDashboard/wallet-dashboard.module";
import {FicheClientComponent} from "./Fiches/fiche-client/fiche-client.component";
import {FicheEmployeeComponent} from "./Fiches/fiche-employee/fiche-employee.component";
import {ProfilComponent} from "./profil/profil.component";
import {SupprimerComponent} from "./profil/supprimer/supprimer.component";
import {QrcodeComponent} from "./tools/qrcode/qrcode.component";
import { CompteComponent } from './Ahmed/compte/compte.component';
import { TransactionComponent } from './Ahmed/transaction/transaction.component';
import { TransfertComponent } from './Ahmed/transfert/transfert.component';
import { UpdateAccountComponent } from './Ahmed/update-account/update-account.component';
import { DeleteAccountComponent } from './Ahmed/delete-account/delete-account.component';

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
  { path: 'suppression/:id',component:SupprimerComponent },

  { path: 'wallet', loadChildren: () => import("./mayssem/WalletDashboard/wallet-dashboard.module").then(m => m.WalletDashboardModule) },
  { path: 'fiche/Client/:id', component:FicheClientComponent },
  { path: 'fiche/Employee/:id', component:FicheEmployeeComponent },

  { path: 'interface1', loadChildren: () => import("./interface1/interface1.module").then(m => m.Interface1Module) },
  { path: 'interface2', loadChildren: () => import("./interface2/interface2.module").then(m => m.Interface2Module) },
  { path: 'interface3', loadChildren: () => import("./interface3/interface3.module").then(m => m.Interface3Module) },
  {path:"Settings",component:ProfilComponent},
  {
    path:'compte', component: CompteComponent
  },
  {
    path:'update-compte', component: UpdateAccountComponent
  },
  {
    path:'delete-compte', component: DeleteAccountComponent
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
