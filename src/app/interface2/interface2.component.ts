import { Component } from '@angular/core';
import {CookieService} from "ngx-cookie-service";
import {Router} from "@angular/router";
import {LoginControllerService} from "../authenticate/login-controller.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {FormControl, FormControlName, FormGroup} from "@angular/forms";


@Component({
  selector: 'app-interface2',
  templateUrl: './interface2.component.html',
  styleUrls: ['./interface2.component.css']
})
export class Interface2Component {
    pageNumber=1;
  datasourceClient:any=[];
  datasourceClientEnPage:any=[];

  Filtrer =new FormGroup({
    nom_complet: new FormControl(null),
      date_ajout_String: new FormControl(null),
    email: new FormControl(null),
    dateAjout: new FormControl(null),
    address: new FormControl(null),
    etatCivil: new FormControl(null),
    id: new FormControl(0),
    phone:new FormControl(null),
    sexe: new FormControl(null),
      date_of_birth_String: new FormControl(null),
    statutEmploi:new FormControl(null),
  })
    genre=[
    "Homme",
    "Femme",
        ""
    ]
    etatcivil=[
    "CELIBATAIRE",
    "MARIE",
    "DIVORCE",
    "VEUF",
        ""
    ]
    statusemploi=[
        "EMPLOYE",
        "INDEPENDANT",
        "AUTRE",
        ""
    ]
  constructor( private cookieservice:CookieService,
               private router:Router,
               private LoginControllerService:LoginControllerService,
               private http:HttpClient,
               private sanitizer: DomSanitizer

  ) {
    this.LoginControllerService.check_login();
    const headers = new HttpHeaders({
      'Authorization': 'Bearer '+this.cookieservice.get('token')
    });
    this.http.get("http://localhost:8080/ebank/api/v1/client/all",{headers: headers})
        .subscribe((res:any)=>{
          this.datasourceClient=res;
          this.datasourceClient.forEach((client:any,i:number)=>{
            if(client.image_data){
            this.datasourceClient[i]['image64']= this.convertImageDataToBase64(client.image_data)
            }
            this.datasourceClient[i]['date_ajout_String']=client.date_d_ajout.split("T")[0]
            this.datasourceClient[i]['date_of_birth_String']=client.date_of_birth.split("T")[0]
          })
          this.DivisonParCing(this.datasourceClient)
          console.log("this.datasourceClient",this.datasourceClient)
          console.log("this.datasourceClientEnPage",this.datasourceClientEnPage)
        },error => { })
  }
  nombreDePage=0;
  DivisonParCing(data:any){
    this.nombreDePage  = Math.ceil(data.length/5);
    console.log("this.nombreDePage",this.nombreDePage)
    for(let i =0;i<this.nombreDePage;i++){
      this.datasourceClientEnPage[i]=[]
    }
    for(let i=0;i<this.nombreDePage;i++){
      for(let j=0;j<5;j++){
        if(data[j+(i*5)]){
          this.datasourceClientEnPage[i][j]=data[j+(i*5)]
        }
      }
    }
  }
  convertImageDataToBase64(image: any): any {
    const binaryData = atob(image);
    const blob = new Blob([new Uint8Array([...binaryData].map((char) => char.charCodeAt(0)))], { type: 'image/jpeg' });
    const imageUrl = URL.createObjectURL(blob);
    return imageUrl;
  }
  filtrer:any = null
  schema=[
    "nom_complet",
    "date_ajout_String",
    "email",
    "address",
    "etatCivil",
    "id",
    "phone",
    "sexe",
    "date_of_birth_String",
    "statutEmploi",
  ]
  h3(id: number, e: any) {
    let nouveauDatasource: any=[];
    console.log(`this.Filtrer.get(${this.schema[id]}).value`,this.Filtrer.get(`${this.schema[id]}`)!.value)
    if (e.data) {
      this.filtrer = this.Filtrer.get(`${this.schema[id]}`)!.value
      let j=0
      this.datasourceClient.forEach((client: any,i:number) => {
      if(id!=5){
        const t = id == 0
            ? `${client.first_name.toLowerCase()} ${client.last_name.toLowerCase()}`
            :  client[this.schema[id]].toLowerCase();
        if (t.includes(this.filtrer.toLowerCase())) {
          nouveauDatasource[j]= this.datasourceClient[i];
          j=j+1
        }
      }else {
        if (client[this.schema[id]] == this.filtrer) {
        nouveauDatasource[j] = this.datasourceClient[i];
        j = j + 1
        }
      }
    });
    } else {
      this.filtrer = null;
      nouveauDatasource = this.datasourceClient;
    }
    if(nouveauDatasource.length==0){
        this.datasourceClientEnPage=[]
    }else {
    this.DivisonParCing(nouveauDatasource);
    }
  }
  h2(id:number,e:any){
    console.log("e in h2",e)
    console.log("this.schema[id]",this.schema[id])

    console.log("date in h2", this.Filtrer.get(`${this.schema[id]}`)!.value)

    let valueDate:any= this.Filtrer.get(`${this.schema[id]}`)!.value
    if(valueDate!==null && valueDate!==undefined && valueDate!== ""){
      let valueString = valueDate.toString()
      let tab = valueString.split("-")
      console.log(" valueDate", valueString)
      let FiltredDataSource:any = []
      let j = 0
      console.log("tab", tab)
      this.datasourceClient.forEach((element: any, id: number) => {
        let t = id==1? element.date_ajout_String: element.date_of_birth_String
          console.log("t", t)
          console.log("typf t", typeof t)

        let ttab = t.split("-")
        console.log("ttab", ttab)
        if (tab[0] === ttab[0] && tab[1] === ttab[1] && tab[2] === ttab[2]) {
          FiltredDataSource[j] = element;
          j++
        }
      })
      console.log("this.FILTREsOURCE", FiltredDataSource)
      if(FiltredDataSource.length!=0){
        this.DivisonParCing(FiltredDataSource)
      }else {
        this.datasourceClientEnPage=[]
      }

    }else {
      this.DivisonParCing(this.datasourceClient)
    }
  }
  h4(id:number,e:any){
      let nouveauDatasource=[]
      console.log("e in h4",e)

      console.log("this.schema[id]",this.schema[id])
      console.log("date in h4", this.Filtrer.get(`${this.schema[id]}`)!.value)

      if(e!=="" && e!==null && e!==undefined){
          this.filtrer=e

      let j=0
      this.datasourceClient.forEach((client: any,i:number) => {

              const t = client[this.schema[id]];
              if (t===this.filtrer) {
                  nouveauDatasource[j]= this.datasourceClient[i];
                  j=j+1

          }
      });
  } else {
    this.filtrer = null;
    nouveauDatasource = this.datasourceClient;
}
if(nouveauDatasource.length==0){
    this.datasourceClientEnPage=[]
}else {
    this.DivisonParCing(nouveauDatasource);
}
  }

    gofront(){
      this.pageNumber=this.pageNumber+1
    }
    goback(){
      this.pageNumber=this.pageNumber-1
    }
    redirectversForm(){
      this.router.navigate(["/interface2/form"])
    }
}
