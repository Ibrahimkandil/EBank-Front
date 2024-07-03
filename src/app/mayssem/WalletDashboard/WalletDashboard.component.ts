import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {CookieService} from "ngx-cookie-service";
import {LoginControllerService} from "../../authenticate/login-controller.service";


@Component({
  selector: 'app-wallet-dashboard',
  templateUrl: './WalletDashboard.component.html',
  styleUrls: ['./WalletDashboard.component.css']
})
export class WalletDashboardComponent {

  constructor(private http:HttpClient,
  private router:Router,
              private LoginControllerService:LoginControllerService,
              private cookieService:CookieService
) {
    this.LoginControllerService.check_login("client");

    let typeUser=this.cookieService.get('type')
    if(typeUser!=="Client"){
      if(typeUser==="Employee"){
        this.router.navigate(['/interface2'])
      }
    }


}




}
