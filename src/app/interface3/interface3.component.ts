import {Component, ElementRef, ViewChild} from '@angular/core';
import {LoginControllerService} from "../authenticate/login-controller.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {CookieService} from "ngx-cookie-service";
import {FormControl, FormGroup} from "@angular/forms";
import {Chart} from "chart.js";
import {Router} from "@angular/router";

@Component({
  selector: 'app-interface3',
  templateUrl: './interface3.component.html',
  styleUrls: ['./interface3.component.css']
})
export class Interface3Component {
  @ViewChild('BarChartEmployeeClient') BarChartEmployeeClient!: ElementRef;
  @ViewChild('BarChartAgenceClient') BarChartAgenceClient!: ElementRef;
  Filtrer = new FormGroup({
  id:new FormControl(0),
  nom_complet:new FormControl(null),
  mail:new FormControl(null),
  address:new FormControl(null),
  cin:new FormControl(null),
  date_ajout_String:new FormControl(null),
  sexe:new FormControl(null)

})
  FiltrerAgence = new FormGroup({
    id:new FormControl(0),
    name:new FormControl(null),
    address:new FormControl(null),
    phone:new FormControl(null),
    email:new FormControl(null),
    postalCode:new FormControl(null),
    city:new FormControl(null),
    country:new FormControl(null),
    description:new FormControl(null),
    code:new FormControl(null),
    creationDate:new FormControl(null),
    nom_Responsable:new FormControl(null),
    budget: new FormControl(0),


  })
  FiltrerContrat = new FormGroup({
    id:new FormControl(0),
    client:new FormControl(null),
    description:new FormControl(null),
    demande:new FormControl(0),
    date_debut_String:new FormControl(null),
    date_fin_String:new FormControl(null),
    etatContrat:new FormControl(null),
    typeCredit:new FormControl(null),
    typeInteret:new FormControl(null),
    informationsAssurance:new FormControl(null),
    mensualites:new FormControl(null),
    duree:new FormControl(null),
    fraisDossier:new FormControl(null),
    frequencePaiement:new FormControl(null),


  })

  genre=[
    "Homme",
    "Femme",
    ""
  ]
  pageNumberAgence=1
  datasourceAgenceEnPage:any=[]
  dataAgence:any=[]
  nombreDePageAgence=0;
  pageNumbercontrat=1
  datasourcecontratEnPage:any=[]
  datacontrat:any=[]
  nombreDePagecontrat=0;
  pageNumber=1
  datasourceEmployeeEnPage:any=[]
  dataEmployees:any=[]
  nombreDePage=0;
constructor(private loginControllerService:LoginControllerService,
            private http:HttpClient,
            private cookieService:CookieService,
            private router:Router) {
  loginControllerService.check_login("admin")
  const headers = new HttpHeaders({
    'Authorization': 'Bearer '+this.cookieService.get('token')
  });
  this.http.get('http://localhost:8081/ebank/api/v1/admin/employee/all',{headers: headers})
      .subscribe((res:any)=>{
        this.dataEmployees=res
        this.dataEmployees.forEach((employee:any,i:number)=>{
          if(employee.image_data){
            this.dataEmployees[i]['image64']= this.convertImageDataToBase64(employee.image_data)
          }
          this.dataEmployees[i]['date_ajout_String']=employee.date_ajout.split("T")[0]
        })
        this.DivisonParCing(this.dataEmployees,"employee")


      },(err:any)=>{})
  this.http.get('http://localhost:8081/ebank/api/v1/admin/agencce/all',{headers: headers})
      .subscribe((res:any)=>{
        this.dataAgence=res

        this.DivisonParCing(this.dataAgence,"agence")
        this.dataAgence.forEach((agence:any,i:number)=>{
          this.dataAgence[i]['nom_Responsable']= agence.responsable.name+" "+agence.responsable.last_name

        })



      },(err:any)=>{})
  this.http.get('http://localhost:8081/ebank/api/v1/admin/clients-by-employee',{headers: headers})
      .subscribe((res:any)=>{
        this.chartData=res
        this.createBarChart("BarChartEmployeeClient",1)
        this.createBarChart("BarChartAgenceClient",2)




      },(err:any)=>{})
  this.http.get('http://localhost:8081/ebank/api/v1/admin/getContrats',{headers: headers})
    .subscribe((res:any)=>{
      this.datacontrat=res
      this.datacontrat.forEach((contrat:any,i:number)=>{
// console.log(contrat.date)
        this.datacontrat[i]['date_debut_String']=contrat.date_debut.split("T")[0]
        this.datacontrat[i]['date_fin_String']=contrat.date_fin.split("T")[0]
      })
      console.log("this.datacontrat",this.datacontrat)


      this.DivisonParCing(this.datacontrat,'contrat')

      console.log("this.datasourcecontratEnPage",this.datasourcecontratEnPage)

    },(err:any)=>{})

}
  redirectversForm(){
    this.router.navigate(["/interface3/form"])
  }
  DivisonParCing(data:any,type:String){
    this.nombreDePage  = Math.ceil(data.length/5);
    for(let i =0;i<this.nombreDePage;i++) {
      if (type === "employee") {
        this.datasourceEmployeeEnPage[i] = []
      }
      else {
        if (type === "agence") {
          this.datasourceAgenceEnPage[i] = []


        }else{
          this.datasourcecontratEnPage[i] = []
        }
      }
        //else {
      //     this.datasourceDemandeEnPage[i] = []
      //
      //   }
      // }
    }
    for(let i=0;i<this.nombreDePage;i++){
      for(let j=0;j<5;j++){
        if(data[j+(i*5)]){
          if(type==="employee"){
            this.datasourceEmployeeEnPage[i][j]=data[j+(i*5)]
          }
          else{
            if(type==="agence") {
              this.datasourceAgenceEnPage[i][j]=data[j+(i*5)]


            }else{
              this.datasourcecontratEnPage[i][j]=data[j+(i*5)]
            }
          }
          //else{
          //     this.datasourceDemandeEnPage[i][j]=data[j+(i*5)]
          //
          //   }
          // }
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
  schema=[
    "id",//0
    "nom_complet",//1
    "mail",//2
    "address",//3
    "cin",//4
    "date_ajout_String",//5
    "Sexe"//6
]
  schemaAgence=[
      "id",
      "name",
      "address",
      "phone",
      "email",
      "postalCode",
      "city",
      "country",
      "description",
      "code",
      "creationDate",
      "nom_Responsable",
      "budget"
  ]
  schemaContrat=[
    "id",
    "client",
  "description",
  "demande",
  "date_debut_String",
  "date_fin_String",
  "etatContrat",
  "typeCredit",
  "typeInteret",
  "informationsAssurance",
  "mensualites",
  "duree",
  "fraisDossier",
  "frequencePaiement",
  ]
  filtrer:any = null
  h3(id: number, e: any) {
    let nouveauDatasource: any=[];
    let v =this.Filtrer.get(`${this.schema[id]}`)!.value
    if (v!==null && v!==undefined && v!=="" && v){
      this.filtrer = this.Filtrer.get(`${this.schema[id]}`)!.value
      let j=0
      this.dataEmployees.forEach((client: any,i:number) => {
        if(id!=0){
          const t = id == 1
              ? `${client.name.toLowerCase()} ${client.last_name.toLowerCase()}`
              :  client[this.schema[id]].toLowerCase();
          if (t.includes(this.filtrer.toLowerCase())) {
            nouveauDatasource[j]= this.dataEmployees[i];
            j=j+1
          }
        }else {
          if (client[this.schema[id]] == this.filtrer) {
            nouveauDatasource[j] = this.dataEmployees[i];
            j = j + 1
          }
        }
      });
    } else {
      this.filtrer = null;
      nouveauDatasource = this.dataEmployees;
    }
    if(nouveauDatasource.length==0){
      this.datasourceEmployeeEnPage=[]
    }else {
      this.DivisonParCing(nouveauDatasource,"employee")
    }
  }
  h2(id: number, e: any): void {

    const valueDate: any = this.Filtrer.get(`${this.schema[id]}`)!.value;

    if (valueDate !== null && valueDate !== undefined && valueDate !== "") {
      const valueString = valueDate.toString();
      const tab = valueString.split("-");

      // Adjust day and year positions in the split array if id is not 1
      // if (id !== 1 && tab.length >= 3) {
      //   const day = tab[2];
      //   tab[2] = tab[0];
      //   tab[0] = day;
      // }


      const FiltredDataSource: any[] = [];
      let j = 0;

      this.dataEmployees.forEach((element: any) => {
        let t: string;

        if (id == 5) {
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

        this.DivisonParCing(FiltredDataSource,"employee")
      } else {
        this.datasourceEmployeeEnPage = []; // Set to empty array if no data matches filter
      }

    } else {
      this.DivisonParCing(this.dataEmployees,"employee")
    }
  }

  h4(id:number,e:any){
    let nouveauDatasource=[]
    if(e!=="" && e!==null && e!==undefined){
      this.filtrer=e

      let j=0
      this.dataEmployees.forEach((client: any,i:number) => {

        const t = client[this.schema[id]];
        if (t===this.filtrer) {
          nouveauDatasource[j]= this.dataEmployees[i];
          j=j+1

        }
      });
    } else {
      this.filtrer = null;
      nouveauDatasource = this.dataEmployees;
    }
    if(nouveauDatasource.length==0){
      this.datasourceEmployeeEnPage=[]
    }else {
      this.DivisonParCing(nouveauDatasource,"employee")
    }
  }
  goversEmployeeFichTechnique(id:number) {
    this.router.navigate(['fiche/Employee/'+id])

  }
  gofront(){
    this.pageNumber=this.pageNumber+1
  }
  goback(){
    this.pageNumber=this.pageNumber-1
  }
  h3Agence(id: number, e: any) {
    let nouveauDatasource: any=[];
    let v =this.FiltrerAgence.get(`${this.schemaAgence[id]}`)!.value
    if (v!==null && v!==undefined && v!=="" && v){
      this.filtrer = this.FiltrerAgence.get(`${this.schemaAgence[id]}`)!.value
      let j=0
      this.dataAgence.forEach((agence: any,i:number) => {
        if(id!=0 && id!=12){
          const t = agence[this.schemaAgence[id]].toLowerCase();
          if (t.includes(this.filtrer.toLowerCase())) {
            nouveauDatasource[j]= this.dataAgence[i];
            j=j+1
          }
        }else {
          if (agence[this.schema[id]] == this.filtrer) {
            nouveauDatasource[j] = this.dataAgence[i];
            j = j + 1
          }
        }
      });
    } else {
      this.filtrer = null;
      nouveauDatasource = this.dataAgence;
    }
    if(nouveauDatasource.length==0){
      this.datasourceAgenceEnPage=[]
    }else {
      this.DivisonParCing(nouveauDatasource,"agence")
    }
  }
  h2Agence(id: number, e: any): void {

    const valueDate: any = this.FiltrerAgence.get(`${this.schemaAgence[id]}`)!.value;

    if (valueDate !== null && valueDate !== undefined && valueDate !== "") {
      const valueString = valueDate.toString();
      const tab = valueString.split("-");

      // Adjust day and year positions in the split array if id is not 1
      // if (id !== 1 && tab.length >= 3) {
      //   const day = tab[2];
      //   tab[2] = tab[0];
      //   tab[0] = day;
      // }


      const FiltredDataSource: any[] = [];
      let j = 0;

      this.dataAgence.forEach((element: any) => {


        let   t = element.creationDate; // Use date_ajout_String if id is not 1
        const ttab = t.split("-");
        // Check if ttab has enough elements and compare dates
        if (ttab.length >= 3 && tab[0] === ttab[0] && tab[1] === ttab[1] && tab[2] === ttab[2]) {
          FiltredDataSource[j] = element;
          j++;
        }
      });


      if (FiltredDataSource.length !== 0) {

        this.DivisonParCing(FiltredDataSource,"agence")
      } else {
        this.datasourceAgenceEnPage = []; // Set to empty array if no data matches filter
      }

    } else {
      this.DivisonParCing(this.dataAgence,"agence")
    }
  }
  chartData:any={}
  createBarChart(id:String,i:number): void {
  let labels:any=[]
    let data: number[]=[];
    if(i==1){
    let e:number=0;
  for(let i =0;i< Object.keys(this.chartData).length;i++){
    let t=Object.keys(this.chartData[i])

    for(let x=0;x< t.length;x++){
      labels[e]=t[x]
      e++
    }

  }
    // const labels = Object.keys(this.chartData);

  let t=labels[0].toString()

    for(let i=0;i<labels.length;i++){
      let t=labels[i].toString()

    data[i]=this.chartData[i][t]
    }
    }
    else{
      let e =0
      for(let i=0;i<this.dataAgence.length;i++){

        labels[e]=this.dataAgence[i].id
        e=e+1
      }

    let y=0
    for(let x=0;x<labels.length;x++){
      let fd=this.dataAgence.find((ele:any)=>ele.id==labels[x])
      let tot=0
      for(let w=0;w<fd.employees.length;w++){
        this.chartData.forEach((e:any)=>{
          let keys=Object.keys(e)
          let q1=keys[0]
          let q=keys[0].toString()
          if(q1==fd.employees[w].id){
            tot=tot+e[q]
          }
        })
      }
      data[x]=tot

    }
    }


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
          label: i === 1 ? 'Nombre des Clients Par Employee' : 'Nombre des Clients Par Agence', // Dynamic label based on i value
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

    if (id === 'BarChartEmployeeClient' && this.BarChartEmployeeClient) {
      ctx = this.BarChartEmployeeClient.nativeElement.getContext('2d');
    } else if (id === 'BarChartAgenceClient' && this.BarChartAgenceClient) {
      ctx = this.BarChartAgenceClient.nativeElement.getContext('2d');
    }

    if (ctx) {
      new Chart(ctx, config);
    }
  }

  h3Contrat(id:number,e:any){
    let nouveauDatasource: any=[];
    let v =this.FiltrerContrat.get(`${this.schemaContrat[id]}`)!.value
    if (v!==null && v!==undefined && v!=="" && v){
      this.filtrer = this.FiltrerContrat.get(`${this.schemaContrat[id]}`)!.value
      let j=0
      this.datacontrat.forEach((contrat: any,i:number) => {
        if(id!=0 && id!=3){
          console.log("contrat[this.schema[id]]",contrat[this.schemaContrat[id]])
          const t = id == 1
            ? `${contrat.client.first_name.toLowerCase()} ${contrat.client.last_name.toLowerCase()}`
            :  contrat[this.schemaContrat[id]].toLowerCase();
          console.log("t",t)
          if (t.includes(this.filtrer.toLowerCase())) {
            nouveauDatasource[j]= this.datacontrat[i];
            j=j+1
          }
        }else {
          console.log("contrat[this.schema[id]]",contrat[this.schema[id]])
          if(id==0){
          if (contrat[this.schema[id]] == this.filtrer) {
            nouveauDatasource[j] = this.datacontrat[i];
            j = j + 1
          }
          }else{
            if (contrat[this.schema[id]].montant == this.filtrer) {
              nouveauDatasource[j] = this.datacontrat[i];
              j = j + 1
            }

          }
          }
      });
    } else {
      this.filtrer = null;
      nouveauDatasource = this.datacontrat;
    }
    if(nouveauDatasource.length==0){
      this.datasourcecontratEnPage=[]
    }else {
      this.DivisonParCing(nouveauDatasource,"contrat")
    }
  }
  h4Contrat(id:number,e:any){

    const valueDate: any = this.FiltrerContrat.get(`${this.schemaContrat[id]}`)!.value;

    if (valueDate !== null && valueDate !== undefined && valueDate !== "") {
      const valueString = valueDate.toString();
      const tab = valueString.split("-");

      // Adjust day and year positions in the split array if id is not 1
      // if (id !== 1 && tab.length >= 3) {
      //   const day = tab[2];
      //   tab[2] = tab[0];
      //   tab[0] = day;
      // }


      const FiltredDataSource: any[] = [];
      let j = 0;

      this.datacontrat.forEach((element: any) => {


        let   t = element[this.schemaContrat[id]]; // Use date_ajout_String if id is not 1
        const ttab = t.split("-");
        // Check if ttab has enough elements and compare dates
        if (ttab.length >= 3 && tab[0] === ttab[0] && tab[1] === ttab[1] && tab[2] === ttab[2]) {
          FiltredDataSource[j] = element;
          j++;
        }
      });


      if (FiltredDataSource.length !== 0) {

        this.DivisonParCing(FiltredDataSource,"contrat")
      } else {
        this.datasourcecontratEnPage = []; // Set to empty array if no data matches filter
      }

    } else {
      this.DivisonParCing(this.datacontrat,"contrat")
    }
  }

}
