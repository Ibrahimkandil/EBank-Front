import {Component, Inject, OnInit} from '@angular/core';
import { MatDialogRef ,MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {CookieService} from "ngx-cookie-service";
@Component({
  selector: 'app-send-email-dialog',
  templateUrl: './send-email-dialog.component.html',
  styleUrls: ['./send-email-dialog.component.css']
})
export class SendEmailDialogComponent {
Email=new FormGroup({
  sujet : new FormControl(null,Validators.required),
    detail:new FormControl(null,Validators.required)
})
    constructor(
        public dialogRef: MatDialogRef<SendEmailDialogComponent>,
        private cookieService:CookieService,
        private http:HttpClient,
        @Inject(MAT_DIALOG_DATA) public data: { email: string }
    ) { }

    closeDialog(): void {
        this.dialogRef.close();
    }

    sendEmail(): void {
        // Implement your logic to send email using this.data.email

        const headers = new HttpHeaders({
            'Authorization': 'Bearer '+this.cookieService.get('token')
        });
        let formData ={
             "to":this.data.email,
             "sujet":this.Email.get('sujet')?.value,
             "text":this.Email.get('detail')?.value
        }
        this.http.post<any>('http://localhost:8081/ebank/api/v1/employee/contact', formData,{headers: headers})
            .subscribe((res:any)=>{

            },(err: any) => {
                console.log("err",err)
            })

        // Close the dialog after sending email
        this.dialogRef.close();
    }
}
