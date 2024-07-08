import { Injectable } from '@angular/core';
import {CookieService} from "ngx-cookie-service";

@Injectable({
  providedIn: 'root'
})
export class CookiesGestionnaireService {
MenusParCompte:any
  constructor(
    private cookieservice:CookieService
  ) { }

  setCookies(object:any){
    let list = Object.keys(object);
    list.forEach(element => {
        if(element==="menus"){

          let MenuParProfils=""
          this.MenusParCompte=object[element]
          for(let i =0;i<object[element].length;i++){
            if(MenuParProfils===""){
             MenuParProfils= object[element][i].index+":"+object[element][i].link
          }else{
              MenuParProfils= MenuParProfils+","+object[element][i].index+":"+object[element][i].link

            }
          }


          this.cookieservice.set(element, MenuParProfils);

        }
        else{
        if(element === 'body'){
        let bodykeys = Object.keys(object[element]);
        bodykeys.forEach(bodyelement => {
          this.cookieservice.set(bodyelement, object[element][bodyelement]);
        })
      }
        else {
      this.cookieservice.set(element, object[element]);
      }
        }
      });


  }

  clearCookies(){
    this.cookieservice.deleteAll();
  }
}
