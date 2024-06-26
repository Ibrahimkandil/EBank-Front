import { Component } from '@angular/core';
import {CookieService} from "ngx-cookie-service";
import {Router} from "@angular/router";
import {LoginControllerService} from "../authenticate/login-controller.service";


@Component({
  selector: 'app-interface2',
  templateUrl: './interface2.component.html',
  styleUrls: ['./interface2.component.css']
})
export class Interface2Component {
  constructor( private cookieservice:CookieService,
               private router:Router,
               private LoginControllerService:LoginControllerService,

  ) {
    this.LoginControllerService.check_login();
    // if(this.cookieservice.get('type')==="Client"){
    //   this.router.navigate(['/interface1']);
    //
    // }
    //   if(this.cookieservice.get('type')==="Client"){
    //   }else{
    //   }
    // }
  }

}
