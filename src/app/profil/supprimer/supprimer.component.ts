import { Component } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {CookieService} from "ngx-cookie-service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-supprimer',
  templateUrl: './supprimer.component.html',
  styleUrls: ['./supprimer.component.css']
})
export class SupprimerComponent {


    obj: any = [];
    user: any = [];
    type_user: any;

    constructor(private router: Router, private cookieService: CookieService, private http: HttpClient, private route: ActivatedRoute) {
        const headers = new HttpHeaders({
            'Authorization': 'Bearer ' + this.cookieService.get('token')
        });
        let url = 'http://localhost:8081/ebank/api/v1/';
        const id = this.route.snapshot.params['id'];
        this.http.get('http://localhost:8081/ebank/api/v1/admin/controlle/' + id, {headers: headers})
            .subscribe((res: any) => {
                this.obj = res;
                if (this.obj.type === "CLIENT") {
                    this.type_user = "Client"
                    url = url + "client/"
                } else {
                    this.type_user = "Employee"
                    url = url + "employee/"

                }
                this.http.get(url + this.obj.id_User, {headers: headers})
                    .subscribe((res: any) => {
                        this.user = res;
                    }, (err: any) => {
                        console.log("err", err)
                    })


            }, (err: any) => {
                console.log("err", err)
            })

    }

    Return() {
        window.history.back();
    }

    handleImageDataChange(data: any) {
        console.log("Suppression en cours");
        let body: any = {
            "image_data": data.split(',')[1],
            "to": this.user.email || this.user.mail,
            "sujet": "Suppression de votre compte",
            "reponse": "DELETE",
            "id": this.user.id,
            "type": this.user.email ? "Client" : "Employee"
        }
        const headers = new HttpHeaders({
            'Authorization': 'Bearer ' + this.cookieService.get('token')
        });
        this.http.post("http://localhost:8081/ebank/api/v1/admin/supprimer", body, {headers: headers})
            .subscribe((res: any) => {
                this.router.navigate(['/interface1'])
            }, (err: any) => {
                console.log("err", err)
                this.router.navigate(['/interface1'])

            })




  }
  Supprim: boolean = false;
    VersSupp() {
        this.Supprim = true;


    }

    refus() {

        let body:any ={
            "image_data":null,
            "to":this.user.email || this.user.mail,
            "sujet":"Suppression de votre compte",
            "reponse":"REFUSED",
            "id":this.user.id,
            "type": this.user.email ? "Client":"Employee"
        }
        const headers = new HttpHeaders({
            'Authorization': 'Bearer '+this.cookieService.get('token')
        });
        this.http.post("http://localhost:8081/ebank/api/v1/admin/supprimer",body,{headers:headers})
            .subscribe((res:any)=>{
                this.router.navigate(['/interface1'])
            },(err:any)=>{console.log("err",err)})

    }
}
