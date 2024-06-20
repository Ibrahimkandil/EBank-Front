import { Component, OnInit } from "@angular/core";
import {WalletDashboardService} from "../wallet-dashboard.service";
import {MatSnackBar} from "@angular/material/snack-bar";


@Component({
  selector: "app-header-stats",
  templateUrl: "./header-stats.component.html",
})
export class HeaderStatsComponent implements OnInit {
  datasources:any[] = [];
  constructor(private  walletDashboardService:WalletDashboardService, private snackBar: MatSnackBar,) {
    this.walletDashboardService.fetchWallets().subscribe((data: any) => {
      this.snackBar.open("Success"), 'Error', {
        duration: 5000, // duration in milliseconds (optional)
      };
      if(data){
        this.datasources=data;
      }else{
        this.datasources=this.walletDashboardService.datasources;
      }
    }, (error: any) => {
    });

  }

  ngOnInit(): void {}
}
