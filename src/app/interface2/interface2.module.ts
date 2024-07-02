import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {Interface1Component} from "../interface1/interface1.component";
import {Interface2Component} from "./interface2.component";
import {MatInputModule} from "@angular/material/input";
import {ReactiveFormsModule} from "@angular/forms";
import {MatSelectModule} from "@angular/material/select";
import {MatTabsModule} from "@angular/material/tabs";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatTableModule} from "@angular/material/table";
import {MatSortModule} from "@angular/material/sort";
import {MatIconModule} from "@angular/material/icon";
import { ClientFormComponent } from './client-form/client-form.component';
import {MatButtonModule} from "@angular/material/button";
const routes: Routes = [
  {path: '', component: Interface2Component},
    {path: 'form', component: ClientFormComponent}
]


@NgModule({
  declarations: [
    Interface2Component,
    ClientFormComponent
  ],
    imports: [
        RouterModule.forChild(routes),
        CommonModule,
        MatInputModule,
        ReactiveFormsModule,
        MatSelectModule,
        MatTabsModule,
        MatPaginatorModule,
        MatTableModule,
        MatSortModule,
        MatIconModule,
        MatButtonModule,
    ]
})
export class Interface2Module { }
