import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";


@Component({
  selector: 'app-wallet-dashboard',
  templateUrl: './WalletDashboard.component.html',
  styleUrls: ['./WalletDashboard.component.css']
})
export class WalletDashboardComponent {

  constructor(private http:HttpClient,
  private router:Router
) {


}




}
