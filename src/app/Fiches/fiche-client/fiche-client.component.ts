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
    pageNumberReclamations:number=1
    datasourceReclamationEnPage:any=[]
    dataSourceHistorique:any=[]
    dataSourceHistoriqueEnPage:any=[]
    numberPage:number=1
    id:any
  constructor(public dialog: MatDialog,
    private route:ActivatedRoute,
  private http:HttpClient,
  public cookieService:CookieService,
              private router:Router) {
     this.id=this.route.snapshot.params['id']

    const headers = new HttpHeaders({
      'Authorization': 'Bearer '+this.cookieService.get('token')
    });
    this.http.get("http://localhost:8081/ebank/api/v1/client/"+this.id,{ headers: headers })
      .subscribe((data: any) => {

        this.client=data
        this.client['image64']= this.convertImageDataToBase64(this.client.image_data)

      }, (err: any) => {
      console.log("err",err)}
  )

    this.http.get('http://localhost:8081/ebank/api/v1/client/historiques/'+this.id, {headers: headers})
.subscribe((res: any) => {
  console.log("res",res)
    let j=0
    for(let i =0;i<res.length;i++){
        for(let x=0;x<res[i].length;x++) {

            this.dataSourceHistorique[j] = res[i][x]
            if(i==1){
                this.dataSourceHistorique[j].type="VIREMENT"
            }
            j++;
        }
        this.DivisonParCing(this.dataSourceHistorique)
    }
    console.log("this.dataSourceHistorique",this.dataSourceHistorique)
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

gofrontHistorique(){
  this.numberPage=this.numberPage+1
}
gobackHistorique(){
  this.numberPage=this.numberPage-1
}
    nombreDePage:number=0
    DivisonParCing(data:any){
        this.nombreDePage  = Math.ceil(data.length/5);
        for(let i =0;i<this.nombreDePage;i++) {

                this.dataSourceHistoriqueEnPage[i] = []

        }
        for(let i=0;i<this.nombreDePage;i++){
            for(let j=0;j<5;j++){
                if(data[j+(i*5)]){

                        this.dataSourceHistoriqueEnPage[i][j]=data[j+(i*5)]

                }

            }
        }
    }
    getDisplayName(i: any): string {
        if (i.idCompteDestinations && i.idCompteDestinations.id === this.id) {
            return `${i.idCompteDestinations.last_name} ${i.idCompteDestinations.first_name}`;
        } else if (i.idCompteSource && i.idCompteSource.id === this.id) {
            return `${i.idCompteSource.last_name} ${i.idCompteSource.first_name}`;
        } else {
            return `${this.client.last_name} ${this.client.first_name}`;
        }
    }
    getDate(i: any): string {
        if (i.type !== "VIREMENT") {
            return i.date_Expiration.split("T")[0]+ " "+i.date_Expiration.split("T")[1].split("Z")[0];
        } else  {
            return i.date.split("T")[0]+ " "+i.date.split("T")[1].split("Z")[0];

        }
    }
}
