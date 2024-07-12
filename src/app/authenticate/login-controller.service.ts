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
    if (this.cookieService.get('token')) {
      console.log('token exist')
     // this.router.navigateByUrl("interface1");
    }else{
      // if(  this.route.snapshot.url[0].path!=='auth')
      this.router.navigateByUrl("auth");
    }
  }
}
