import { NgModule } from '@angular/core';

import {RouterModule, Routes} from "@angular/router";

import {CommonModule} from "@angular/common";
import {MatCardModule} from "@angular/material/card";
import {ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {MatButtonModule} from "@angular/material/button";
import {ListAgenceComponent} from "./list-agence/list-agence.component";
import {AddAgenceComponent} from "./add-agence/add-agence.component";
import {MatTableModule} from "@angular/material/table";
import {MatIconModule} from "@angular/material/icon";
import { EditAgenceComponent } from './edit-agence/edit-agence.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  {path: '', component:ListAgenceComponent },
  // {path: 'dashboard', component:DashboardComponent },
  {path: 'Add', component:AddAgenceComponent },
  {path: 'edit/:id', component:EditAgenceComponent },
]


@NgModule({
  declarations: [ListAgenceComponent,AddAgenceComponent, EditAgenceComponent, DashboardComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    MatCardModule,
    ReactiveFormsModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
  ]
})
export class AgenceModule { }
