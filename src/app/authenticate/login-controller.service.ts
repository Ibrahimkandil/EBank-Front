import { Injectable } from '@angular/core';
import {CookieService} from "ngx-cookie-service";
import {ActivatedRoute, Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class LoginControllerService {

  constructor(  private cookieService : CookieService,
                private router : Router,
                private route : ActivatedRoute) {

  }

  check_login(){
    console.log("this.route.url", this.route.url)
    console.log("this0router",this.router)
    console.log("this.route.snapshot",this.route.snapshot)
    let valemp:boolean = this.cookieService.get("type")==="Employee"
    let valcli:boolean = this.cookieService.get("type")==="Client"
    let valadm:boolean = this.cookieService.get("type")==="Admin"
    if (this.cookieService.get('token')) {
      console.log('token exist')
      if (valcli) {
        this.router.navigate(["/interface1"]);

      }

    if(valemp) {
      this.router.navigate(["/interface2"]);
    }
    if(valadm){
      // if(  this.route.snapshot.url[0].path!=='auth')
      this.router.navigate(["/interface3"]);
    }

    }
  }
}
