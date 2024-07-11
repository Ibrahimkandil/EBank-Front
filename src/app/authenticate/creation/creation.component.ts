import { Component } from '@angular/core';
import {CookieService} from "ngx-cookie-service";
import {Router} from "@angular/router";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-creation',
  templateUrl: './creation.component.html',
  styleUrls: ['./creation.component.css']
})
export class CreationComponent {

  agreeToTerms: boolean = false;
  actifurl:String ='http://localhost:8081/ebank/';
  headers = new HttpHeaders({
    'Authorization': 'Bearer ' + this.cookieservice.get('token'),
    'Content-Type': 'application/json'
  });

  constructor(        public dialogRef: MatDialogRef<CreationComponent>,

                      private  cookieservice:CookieService,private http:HttpClient
              ,private router:Router) {
    if(this.cookieservice.get('type')==="Client"){

      this.actifurl=this.actifurl+"api/v1/client/Confirmation_compte/"

    }
    if(this.cookieservice.get('type')==="Employee"){

      this.actifurl=this.actifurl+"api/v1/employee/Confirmation_compte/"



    }
  }
  closeDialog(): void {
    this.dialogRef.close();
  }
  handleImageDataChange(imageData: any) {
    // Process imageData received from child component
    const url=this.actifurl+this.cookieservice.get('id')


    let body ={
      "image_data":imageData.split(',')[1]
    }
    this.http.patch<any>(url, body, { headers: this.headers })
        .subscribe((data:any) => {
            console.log(data)
          this.cookieservice.set('etat','ACTIF')
        }, (err:any) => {
          console.error('Error:', err)
        })
    this.dialogRef.close();
  }
}
