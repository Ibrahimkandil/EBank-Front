import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {WalletDashboardComponent} from "./WalletDashboard.component";
import {CardLineChartComponent} from "./card-line-chart/card-line-chart.component";
import {CardBarChartComponent} from "./card-bar-chart/card-bar-chart.component";
import {CardPageVisitsComponent} from "./card-page-visits/card-page-visits.component";
import {CardSocialTrafficComponent} from "./card-social-traffic/card-social-traffic.component";
import {HeaderStatsComponent} from "./header-stats/header-stats.component";
import {CardStatsComponent} from "./card-stats/card-stats.component";
import {MatIconModule} from "@angular/material/icon";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {MatTabsModule} from "@angular/material/tabs";
import {ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";


const routes: Routes = [
  {path: '', component: WalletDashboardComponent}
]


@NgModule({
    declarations: [
        WalletDashboardComponent,
        CardLineChartComponent,
        CardBarChartComponent,
        CardPageVisitsComponent,
        CardSocialTrafficComponent,
        HeaderStatsComponent,
        CardStatsComponent
    ],
  exports: [
    HeaderStatsComponent,

  ],
    imports: [
        RouterModule.forChild(routes),
        CommonModule,
        MatIconModule,
        MatFormFieldModule,
        MatOptionModule,
        MatSelectModule,
        MatTabsModule,
        ReactiveFormsModule,
        MatButtonModule
    ]
})
export class WalletDashboardModule { }
