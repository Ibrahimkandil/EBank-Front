import { Component } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {CookieService} from "ngx-cookie-service";
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import { SendEmailDialogComponent } from 'src/app/authenticate/send-email-dialog/send-email-dialog.component';
@Component({
  selector: 'app-fiche-client',
  templateUrl: './fiche-client.component.html',
  styleUrls: ['./fiche-client.component.css']
})
export class FicheClientComponent {
  client:any
  constructor(public dialog: MatDialog,
    private route:ActivatedRoute,
  private http:HttpClient,
  private cookieService:CookieService,
              private router:Router) {
    let id=this.route.snapshot.params['id']

    const headers = new HttpHeaders({
      'Authorization': 'Bearer '+this.cookieService.get('token')
    });
    this.http.get("http://localhost:8081/ebank/api/v1/client/"+id,{ headers: headers })
      .subscribe((data: any) => {

        this.client=data
        this.client['image64']= this.convertImageDataToBase64(this.client.image_data)

      }, (err: any) => {})
  }

  convertImageDataToBase64(image: any): any {
    const binaryData = atob(image);
    const blob = new Blob([new Uint8Array([...binaryData].map((char) => char.charCodeAt(0)))], { type: 'image/jpeg' });
    const imageUrl = URL.createObjectURL(blob);
    return imageUrl;
  }
    openEmailDialog(email: string): void {
        const dialogConfig = new MatDialogConfig();

        dialogConfig.width = '500px'; // Adjust width as needed
        dialogConfig.data = { email: email }; // Pass email as data to dialog

        const dialogRef = this.dialog.open(SendEmailDialogComponent, dialogConfig);

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
            // Handle actions after the dialog is closed, if needed
        });
    }
    goback(){
      this.router.navigate(["interface2"])
    }
}
