import {Component, ElementRef, ViewChild} from '@angular/core';
import {CookieService} from "ngx-cookie-service";
import {Router} from "@angular/router";
import {LoginControllerService} from "../authenticate/login-controller.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {FormControl, FormControlName, FormGroup} from "@angular/forms";
import { Chart } from 'chart.js';
import {config} from "rxjs";



@Component({
  selector: 'app-interface2',
  templateUrl: './interface2.component.html',
  styleUrls: ['./interface2.component.css']
})
export class Interface2Component {
    pageNumber=1;
    pageNumberReclamations=1
    pageNumberDemande=1
  datasourceClient:any=[];
  datasourceClientEnPage:any=[];
  notifications:any=[];
  datasourceDemandeEnPage:any=[];
  datasourceReclamationEnPage:any=[];


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
  FiltrerReclamation =new FormGroup({
    nom_complet: new FormControl(null),
    date_String: new FormControl(null),
    description: new FormControl(null),
    subject: new FormControl(null),
    id: new FormControl(0),
  })
  FiltrerDemande =new FormGroup({
    nom_complet: new FormControl(null),
    montant: new FormControl(null),
    type: new FormControl(null),
    raison: new FormControl(null),
    id: new FormControl(0),
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
  barChart: any;
  chartData: any = {};
  @ViewChild('BarChartTransaction') BarChartTransaction!: ElementRef;
  @ViewChild('BarChartTransfert') BarChartTransfert!: ElementRef;
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
    this.http.get("http://localhost:8081/ebank/api/v1/client/all",{headers: headers})
        .subscribe((res:any)=>{
          this.datasourceClient=res;
          this.datasourceClient.forEach((client:any,i:number)=>{
            if(client.image_data){
            this.datasourceClient[i]['image64']= this.convertImageDataToBase64(client.image_data)
            }
            this.datasourceClient[i]['date_ajout_String']=client.date_d_ajout.split("T")[0]
            this.datasourceClient[i]['date_of_birth_String']=client.date_of_birth.split("T")[0]
          })
          this.DivisonParCing(this.datasourceClient,"client")
          console.log("this.clientenpage",this.datasourceClientEnPage)

        },error => { })
    this.http.get("http://localhost:8081/ebank/api/v1/employee/allDatas",{headers: headers})
        .subscribe((res:any)=>{

          this.chartData = this.sortChartData(res);
          const Keys = Object.keys(this.chartData );
          const size = Keys.length;
          if(size>30) {
            for (let i = 0; i < size - 30; i++) {
                delete this.chartData[Keys[i]];
            }
          }
            this.createBarChart("barChartTransaction",1);
            this.createBarChart("barChartTransfert",2);
        },error => { })
    this.http.get("http://localhost:8081/ebank/api/v1/employee/notifiactions",{headers: headers})
        .subscribe((res:any)=>{
          console.log("res",res)
          this.notifications=res
          console.log("this.notifications",this.notifications["reclamations"].length)
          this.notifications["reclamations"].forEach((elem:any,i:number)=> {
            let v= new Date(elem.date)
            console.log("v",v)
            this.notifications["reclamations"][i]['date_String'] =elem.date.split("T")[0]
          })



          this.DivisonParCing(this.notifications["reclamations"],"reclamation")
          this.DivisonParCing(this.notifications["demandes"],"demande")
          console.log("this.datasourceReclamationEnPage",this.datasourceReclamationEnPage)
          console.log("this.datasourceDemandeEnPage",this.datasourceDemandeEnPage)
          // this.datasourceDemandeEnPage=this.DivisonParCing(this.notifications["demandes"],"demande")

        },error => { })
  }
  nombreDePage=0;
  DivisonParCing(data:any,type:String){
    this.nombreDePage  = Math.ceil(data.length/5);
    for(let i =0;i<this.nombreDePage;i++) {
      if (type === "client") {
        this.datasourceClientEnPage[i] = []
      } else {
        if (type === "reclamation") {
          this.datasourceReclamationEnPage[i] = []


        } else {
          this.datasourceDemandeEnPage[i] = []

        }
      }
    }
    for(let i=0;i<this.nombreDePage;i++){
      for(let j=0;j<5;j++){
        if(data[j+(i*5)]){
          if(type==="client"){
          this.datasourceClientEnPage[i][j]=data[j+(i*5)]
        }else{
            if(type==="reclamation") {
              this.datasourceReclamationEnPage[i][j]=data[j+(i*5)]


            }else{
              this.datasourceDemandeEnPage[i][j]=data[j+(i*5)]

            }
          }
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
    "nom_complet",//0
    "date_ajout_String",//0
    "email",//3
    "address",//4
    "etatCivil",//5
    "id",//6
    "phone",//7
    "sexe",//8
    "date_of_birth_String",//9
    "statutEmploi",//10
  ]
  sortChartData(data: any): any {
    // Convert object to array of key-value pairs
    const dataArray = Object.entries(data);

    // Sort the array based on the key (date in ISO format)
    dataArray.sort((a, b) => {
      const dateA = new Date(a[0]);
      const dateB = new Date(b[0]);
      return dateA.getTime() - dateB.getTime();
    });

    // Convert sorted array back to object
    const sortedData:any = {};
    dataArray.forEach(([key, value]) => {
      sortedData[key] = value;
    });

    return sortedData;
  }
  h3(id: number, e: any) {
    let nouveauDatasource: any=[];
    let v =this.Filtrer.get(`${this.schema[id]}`)!.value
    if (v!==null && v!==undefined && v!=="" && v){
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
      this.DivisonParCing(nouveauDatasource,"client")
    }
  }
  h2(id: number, e: any): void {

    const valueDate: any = this.Filtrer.get(`${this.schema[id]}`)!.value;

    if (valueDate !== null && valueDate !== undefined && valueDate !== "") {
      const valueString = valueDate.toString();
      const tab = valueString.split("-");

      // Adjust day and year positions in the split array if id is not 1
      if (id !== 1 && tab.length >= 3) {
        const day = tab[2];
        tab[2] = tab[0];
        tab[0] = day;
      }


      const FiltredDataSource: any[] = [];
      let j = 0;

      this.datasourceClient.forEach((element: any) => {
        let t: string;

        if (id == 1) {
          t = element.date_ajout_String; // Use date_ajout_String if id is not 1
        } else {
          t = element.date_of_birth_String; // Otherwise use date_of_birth_String
        }
        const ttab = t.split("-");

        // Check if ttab has enough elements and compare dates
        if (ttab.length >= 3 && tab[0] === ttab[0] && tab[1] === ttab[1] && tab[2] === ttab[2]) {
          FiltredDataSource[j] = element;
          j++;
        }
      });


      if (FiltredDataSource.length !== 0) {
        this.DivisonParCing(FiltredDataSource,"client")
      } else {
        this.datasourceClientEnPage = []; // Set to empty array if no data matches filter
      }

    } else {
      this.DivisonParCing(this.datasourceClient,"client")
    }
  }

  h4(id:number,e:any){
      let nouveauDatasource=[]
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
  this.DivisonParCing(nouveauDatasource,"client")
}
  }

    gofront(){
      this.pageNumber=this.pageNumber+1
    }
    goback(){
      this.pageNumber=this.pageNumber-1
    }
  gofrontReclamation(){
    this.pageNumberReclamations=this.pageNumber+1
  }
  gobackReclamation(){
    this.pageNumberReclamations=this.pageNumberReclamations-1
  }
  gofrontDemande(){
    this.pageNumberDemande=this.pageNumberDemande+1
  }
  gobackDemande(){
    this.pageNumberDemande=this.pageNumberDemande-1
  }
    redirectversForm(){
      this.router.navigate(["/interface2/form"])
    }

  createBarChart(id: string, i: number): void {
    const labels = Object.keys(this.chartData);
    let data: number[];

    if (i === 1) {
      data = labels.map(key => this.chartData[key].totalAmount);
    } else {
      data = labels.map(key => this.chartData[key].totalTransferAmount); // Assuming this property exists in your data
    }
    labels.forEach((element,i)=>{
        labels[i]=element.split("T")[0]
    })

    const couleurs = ['#FF6384', '#36A2EB', '#FFCE56']; // Colors for bars
    let  backgroundColors =[]
    let j=0
    for(let i = 0; i < data.length; i++) {
      backgroundColors[i]=couleurs[j]
      if(j==2){
        j=0
      }else{
        j++
      }
    }
    const config: any = {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: i === 1 ? 'Transaction' : 'Transfert', // Dynamic label based on i value
          data: data,
          backgroundColor: backgroundColors,
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    };

    let ctx: CanvasRenderingContext2D | null = null;

    if (id === 'barChartTransaction' && this.BarChartTransaction) {
      ctx = this.BarChartTransaction.nativeElement.getContext('2d');
    } else if (id === 'barChartTransfert' && this.BarChartTransfert) {
      ctx = this.BarChartTransfert.nativeElement.getContext('2d');
    }

    if (ctx) {
      new Chart(ctx, config);
    }
  }
  schemaReclamation=[
    "nom_complet",//0
    "description",//1
    "date_String",//2
    "subject",//3
    "id",//4

  ]
  schemaDemande=[
    "nom_complet",//0
    "type",//1
    "raison",//2
    "montant",//3
    "id",//4
  ]
  h3Reclamation(id: number, e: any) {
    let nouveauDatasource: any=[];
    let v =this.FiltrerReclamation.get(`${this.schemaReclamation[id]}`)!.value
    if (v!==null && v!==undefined && v!=="" && v){
      this.filtrer = this.FiltrerReclamation.get(`${this.schemaReclamation[id]}`)!.value

      let j=0
      this.notifications["reclamations"].forEach((reclamation: any,i:number) => {
        if(id!=4){
        const t = id == 0
            ? `${reclamation['client'].first_name.toLowerCase()} ${reclamation['client'].last_name.toLowerCase()}`
            :  reclamation[this.schemaReclamation[id]].toLowerCase();

          if (t.includes(this.filtrer.toLowerCase())) {
            nouveauDatasource[j]= this.notifications["reclamations"][i];
            j=j+1
          }
        }else{

          const t=  reclamation[this.schemaReclamation[id]].toString();



          if (t==this.filtrer) {
            nouveauDatasource[j]= this.notifications["reclamations"][i];
            j=j+1
          }
        }



      });
    } else {

      this.filtrer = null;
      nouveauDatasource = this.notifications['reclamations'];
    }
    if(nouveauDatasource.length==0){

      this.datasourceReclamationEnPage=[]
    }else {

      this.DivisonParCing(nouveauDatasource,"reclamation")
    }
  }
  h2Reclamation(id: number, e: any): void {

    const valueDate: any = this.FiltrerReclamation.get(`${this.schemaReclamation[id]}`)!.value;

    if (valueDate !== null && valueDate !== undefined && valueDate !== "") {
      const valueString = valueDate.toString();
      const tab = valueString.split("-");

      // Adjust day and year positions in the split array if id is not 1



      const FiltredDataSource: any[] = [];
      let j = 0;

      this.notifications["reclamations"].forEach((element: any) => {
        let t: string;

          t = element.date_String; // Otherwise use date_of_birth_String

        const ttab = t.split("-");

        // Check if ttab has enough elements and compare dates
        if (ttab.length >= 3 && tab[0] === ttab[0] && tab[1] === ttab[1] && tab[2] === ttab[2]) {
          FiltredDataSource[j] = element;
          j++;
        }
      });


      if (FiltredDataSource.length !== 0) {
        this.DivisonParCing(FiltredDataSource,"reclamation")
      } else {
        this.datasourceReclamationEnPage = []; // Set to empty array if no data matches filter
      }

    } else {
      this.DivisonParCing(this.notifications['reclamations'],"reclamation")
    }
  }

  h3RDemande(id: number, e: any) {
    let nouveauDatasource: any=[];
    let v =this.FiltrerDemande.get(`${this.schemaDemande[id]}`)!.value
    if (v!==null && v!==undefined && v!=="" && v){
      this.filtrer = this.FiltrerDemande.get(`${this.schemaDemande[id]}`)!.value

      let j=0
      this.notifications["demandes"].forEach((demande: any,i:number) => {
        if(id!=4 && id!=3){
          const t = id == 0
            ? `${demande['client'].first_name.toLowerCase()} ${demande['client'].last_name.toLowerCase()}`
            :  demande[this.schemaDemande[id]].toLowerCase();

          if (t.includes(this.filtrer.toLowerCase())) {
            nouveauDatasource[j]= this.notifications["demandes"][i];
            j=j+1
          }
        }else{

          const t=  demande[this.schemaDemande[id]].toString();



          if (t==this.filtrer) {
            nouveauDatasource[j]= this.notifications["demandes"][i];
            j=j+1
          }
        }



      });
    } else {

      this.filtrer = null;
      nouveauDatasource = this.notifications['demandes'];
    }
    if(nouveauDatasource.length==0){

      this.datasourceDemandeEnPage=[]
    }else {

      this.DivisonParCing(nouveauDatasource,"demande")
    }
  }

  hh(){
    console.log("Hello")
  }
  goversClientFichTechnique(id:number) {
    this.router.navigate(['fiche/Client/'+id])
  }

}
