import { Injectable } from '@angular/core';
import {CookieService} from "ngx-cookie-service";

@Injectable({
  providedIn: 'root'
})
export class CookiesGestionnaireService {

  constructor(
    private cookieservice:CookieService
  ) { }

  setCookies(object:any){
    let list = Object.keys(object);
    list.forEach(element => {
      if(element !=="addedBy"){
      if(element === 'body'){
        let bodykeys = Object.keys(object[element]);
        bodykeys.forEach(bodyelement => {
          this.cookieservice.set(bodyelement, object[element][bodyelement]);
        })
      }else {
      this.cookieservice.set(element, object[element]);
      }
      }
      });


  }

  clearCookies(){
    this.cookieservice.deleteAll();
  }
}
