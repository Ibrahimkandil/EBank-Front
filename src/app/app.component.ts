import { Component } from '@angular/core';
import {FormControl,  FormGroup} from "@angular/forms";
import {CookieService} from "ngx-cookie-service";
import { Router} from "@angular/router";
import {LoginControllerService} from "./authenticate/login-controller.service";
import {CookiesGestionnaireService} from "./authenticate/CookiesGestionnaire.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  nav:boolean=false;
  title = 'E-Bank';
  signinForm:any=new FormGroup({
  a : new FormControl(null)
})
  display_menu : boolean=false;
  constructor(
      private cookieGestionnaireService:CookiesGestionnaireService,
      private LoginControllerService:LoginControllerService,
      public CookieService:CookieService,
      private route:Router

  ) {

    // this.LoginControllerService.check_login();

  }
  toggleNav(){
    this.nav=!this.nav;

  }
  logout() {
    this.cookieGestionnaireService.clearCookies();
    this.route.navigateByUrl("auth");
  }
}
