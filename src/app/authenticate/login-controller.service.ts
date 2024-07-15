import { Injectable } from '@angular/core';
import {CookieService} from "ngx-cookie-service";
import {ActivatedRoute, Router} from "@angular/router";
import {CookiesGestionnaireService} from "./CookiesGestionnaire.service";

@Injectable({
  providedIn: 'root'
})
export class LoginControllerService {

  constructor(  private cookieService : CookieService,
                private router : Router,
                private route : ActivatedRoute,
                private cookieGestionnaire:CookiesGestionnaireService) {

  }

  check_login(menu:String){
    let verif_Expiration:boolean=true
    if(this.cookieService.get('time_Expiration')) {
      let h =parseInt(new Date().toString().split("GMT+0200")[0].split(" ")[4].split(":")[0])
      let h_exp= parseInt(this.cookieService.get('time_Expiration').split("CEST")[0].split(" ")[3].split(":")[0])
      let m =parseInt(new Date().toString().split("GMT+0200")[0].split(" ")[4].split(":")[1])
      let m_exp= parseInt(this.cookieService.get('time_Expiration').split("CEST")[0].split(" ")[3].split(":")[1])
      if(h>=21 && h<=23 ) {
        h_exp=h_exp+24
      }
      if(h<h_exp){
        verif_Expiration=true
      }
      if(h==h_exp) {
        if(m<m_exp){
          verif_Expiration=true
        }else {
          verif_Expiration=false
          this.cookieGestionnaire.clearCookies()
          this.router.navigate(['auth'])
        }
      }
      if(h>h_exp){
        verif_Expiration=false
        this.cookieGestionnaire.clearCookies()
        this.router.navigate(['auth'])
      }
    }
    if(verif_Expiration){
    let valemp:boolean = this.cookieService.get("type")==="Employee"
    let valcli:boolean = this.cookieService.get("type")==="Client"
    let valadm:boolean = this.cookieService.get("type")==="Admin"
    if (this.cookieService.get('token')) {
      console.log('token exist')
      if (valcli) {
        if(menu!=="client"){
        this.router.navigate(["/interface1"]);
      }
      }
    if(valemp) {
      if (menu !== "employee") {
        this.router.navigate(["/interface2"]);
      }
    }
    if(valadm) {
      // if(  this.route.snapshot.url[0].path!=='auth')
      if (menu !== "admin") {
        this.router.navigate(["/interface3"]);
      }
    }
    }else{
      this.router.navigate(["auth"]);
    }
    }
  }
}
