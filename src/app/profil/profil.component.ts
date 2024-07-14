import {Component, Inject} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {CookieService} from "ngx-cookie-service";
import {ProfilService} from "./profil.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Observable} from "rxjs";
import {SignatureComponent} from "../tools/signature/signature.component";
import {Router} from "@angular/router";
import {CookiesGestionnaireService} from "../authenticate/CookiesGestionnaire.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {CreationComponent} from "../authenticate/creation/creation.component";
import {QrcodeComponent} from "../tools/qrcode/qrcode.component";

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css']
})
export class ProfilComponent {
    agreeToTerms: boolean = false;

    url:String ='http://localhost:8081/ebank/';
    pathchingurl:String ='http://localhost:8081/ebank/';
    deletingurl:String ='http://localhost:8081/ebank/';
   headers = new HttpHeaders({
    'Authorization': 'Bearer ' + this.cookieservice.get('token'),
    'Content-Type': 'application/json'
  });

    SelectList:any = {
        'sexe' : ["Homme", "Femme"],
        'etatCivil' : ["CELIBATAIRE",
            "MARIE",
            "DIVORCE",
            "VEUF"],
        'statutEmploi' : ["EMPLOYE",
            "INDEPENDANT",
            "AUTRE"]
    }

   list:any=[]
    Form!: FormGroup;
    Objet:any
    cantDelete:boolean=false

  constructor(public dialog: MatDialog,private router:Router,private cookieGestionnaireService:CookiesGestionnaireService,
      private formBuilder: FormBuilder,private http:HttpClient,public cookieservice:CookieService,private profilservice:ProfilService,
   ) {
      let formGroupConfig:  any = {};
       if(this.cookieservice.get('type')==="Client"){
          this.list=this.profilservice.Client_Input
           this.url=this.url+"api/v1/client"
           this.pathchingurl=this.pathchingurl+"api/v1/client/Update/"
           this.deletingurl=this.deletingurl+"api/v1/client/Demande_Suppression/"

  }
      if(this.cookieservice.get('type')==="Employee"){
          this.list=this.profilservice.Employee_Input
          this.url=this.url+"api/v1/employee"
          this.pathchingurl=this.pathchingurl+"api/v1/employee"
          this.deletingurl=this.deletingurl+"api/v1/employee/Demande_Suppression/"



      }
      if(this.cookieservice.get('type')==="Admin"){
          this.list=this.profilservice.Admin_Input
          this.url=this.url+"api/v1/admin"
          this.pathchingurl=this.pathchingurl+"api/v1/admin"

      }

      this.fetchData().subscribe((data:any)=>{
              this.Objet=data
              this.list.forEach((input:any) => {
                  if(input!=="image_data"){

                      formGroupConfig[input] = [data[input], Validators.required]; // Set default value and validators if needed

                      }else {
                      formGroupConfig[input] = [data[input]]; // Set default value and validators if needed


                  }
              });
              this.Form = this.formBuilder.group(formGroupConfig);

          },(err:any)=>{console.log("err",err)})


      // Create the FormGroup


  }
    fetchData(): Observable<any> {
        const url = this.url + '/' + this.cookieservice.get('id');
        const headers = new HttpHeaders({
            'Authorization': 'Bearer ' + this.cookieservice.get('token'),
            'Content-Type': 'application/json'
        });

        return this.http.get<any>(url, { headers });
    }

id_div:number=1;
  display(id:number){
    this.id_div=id;


  }
  newPassword: string = '';
  confirmPassword: string = '';
  OldPassword: string = '';
  passwordsMatch: boolean | null = null;
  Errror:boolean=false;
  Sucess:boolean=false;
  MsgToDisplay:string="";
    confirmationDelete:boolean=false;
  hide() {
    this.Errror = false;
    this.Sucess=false
  }

  resetPassword() {
    // Check if passwords match
    this.passwordsMatch = this.newPassword === this.confirmPassword;

    if (this.passwordsMatch && this.newPassword===this.OldPassword) {
      let body = {
        "password": this.OldPassword,
        "newPassword": this.newPassword
      };


      // Reset password logic (e.g., call API)
      this.http.post<any>('http://localhost:8081/ebank/api/v1/client/changerPass/'+this.cookieservice.get('id'),body, {headers: this.headers})
          .subscribe((data:any)=>{
                this.Sucess=true
                this.Errror=false
                this.MsgToDisplay=data.message
                this.newPassword = '';
                this.confirmPassword = '';
                this.OldPassword = '';
              },
              (error:any)=>{
            console.log("Err",error)
            this.Errror=true
                this.Sucess=false
                this.newPassword = '';
                this.confirmPassword = '';
                this.OldPassword = '';
            this.MsgToDisplay=error.error
          })

    } else {
        if(this.newPassword===this.OldPassword){
            this.MsgToDisplay="Votre nouveau mot du passe Saisie doit être different de l'ancien mot du passe"
            this.Errror=true
            this.Sucess=false
        }
        if(this.newPassword!==this.confirmPassword){

        this.MsgToDisplay += "/Votre nouveau mot du passe Saisie ne correspondant pas à le mot du passe réecrit";


            this.Errror=true
        this.Sucess=false
        }
    }
  }

  formValid(): boolean {
    return this.newPassword !== '' && this.confirmPassword !== '';
  }
    onSubmit() {
        if (this.Form.valid) {
            const url=this.pathchingurl+this.cookieservice.get('id')
            this.http.patch<any>(url, this.Form.value, { headers: this.headers })
                .subscribe((data:any) => {
                }, (err:any) => {
                    console.log('Error:', err)
                })
        } else {
            console.error('Form is invalid');
            // Optionally, display validation errors to the user
        }
    }
    onFileSelected(event: any): void {
        const file: File = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e: any) => {
                this.Form.patchValue({
                    image_data: e.target.result.split(',')[1] // Base64 string without data:image/jpeg;base64,
                });
            };
            reader.readAsDataURL(file);
        }
    }
    convertImageDataToBase64(image: any): any {
        const binaryData = atob(image);
        const blob = new Blob([new Uint8Array([...binaryData].map((char) => char.charCodeAt(0)))], { type: 'image/jpeg' });
        const imageUrl = URL.createObjectURL(blob);
        return imageUrl;
    }
    resetImage() {
      this.Form.get("image_data")?.setValue(this.Objet.image_data)
    }
    handleImageDataChange(imageData: any) {
        // Process imageData received from child component
        const url=this.deletingurl+this.cookieservice.get('id')


        let body ={
            "image_data":imageData.split(',')[1]
        }
        this.http.patch<any>(url, body, { headers: this.headers })
            .subscribe((data:any) => {
                this.cookieGestionnaireService.clearCookies();
                this.router.navigateByUrl("auth");
            }, (err:any) => {
                console.error('Error:', err)
            })
    }
     data_wallet:any
     data_compte :any
     data_demande :any
     data_contrat :any
    h2() {
        console.log("HHH")

        const headers = new HttpHeaders({
            'Authorization': 'Bearer ' + this.cookieservice.get('token'),
            'Content-Type': 'application/json'
        });
        this.http.get('http://localhost:8081/ebank/api/v1/client/fetchData/' + this.cookieservice.get('id'), {headers: headers})
            .subscribe((res: any) => {

                    console.log("res", res)
                 this.data_wallet=res[0]
                this.data_compte = res[1]
                this.data_demande = res[2]
                this.data_contrat = res[3]
                console.log("data_compte.compteBancaires.length",this.data_compte.compteBancaires.length)
                console.log("data_compte.compteBancaires",this.data_compte.compteBancaires)
                console.log("data_compte.compteBancaires.length>0",this.data_compte.compteBancaires.length>0)
                if(this.data_contrat.contrats.length==0){

                    this.confirmationDelete=true
                    this.cantDelete=false
                }else{
                    this.confirmationDelete=false
                    this.cantDelete=true

                }
                console.log("this.confirmationDelete",this.confirmationDelete)
                    console.log("this.cantDelete",this.cantDelete)

                    console.log("res", res[0])
                    console.log("res", res[1])
                    console.log("res", res[2])
                }, (err: any) => {
                    console.log("err", err)
                }
            )
    }
    getExchangeRates(): Observable<any> {
        let url=`https://api.exchangerate-api.com/v4/latest/TND`
        return this.http.get<any>(url);
    }
    signSuppression() {
        this.agreeToTerms=true
        let total:number=0
        for(let i=0;i<this.data_compte.compteBancaires.length;i++){
            total=total+this.data_compte.compteBancaires[i].balance

        }

        this.getExchangeRates().subscribe((data: any) => {
            console.log("data", data.rates)
            console.log("this.data_wallet.wallets.length",this.data_wallet.wallets.length)
            for(let i=0;i<this.data_wallet.wallets.length;i++){
                console.log("this.data_wallet.wallets[i].currency",this.data_wallet.wallets[i].currency)
                console.log("this.data",data.rates[`${this.data_wallet.wallets[i].currency}`])
                let rate=data.rates[`${this.data_wallet.wallets[i].currency}`]
                total=total+this.data_wallet.wallets[i].balance/rate

            }
            total=Math.floor(total)

            let  date =new Date()
            date.setHours(date.getHours()+1)
            let numTransaction=""
            for(let i=0;i<12;i++){
                numTransaction=numTransaction+Math.floor(Math.random() * 10)
            }


            let body=  "Numéro:"+numTransaction+ '\''
            +" Client:"+this.cookieservice.get('first_name')+" "+this.cookieservice.get('last_name')+ '\'' +
            " total:"+total+ '\'' +" date:"+date

            this.openConfirmation(body.toString())

            console.log("total",total)

        }, (err: any) => {})

    }
    Refresh() {
        window.location.reload();
    }


    openConfirmation(data:any): void {


        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true; // Prevents closing the dialog by clicking outside of it

        dialogConfig.width = '800px'; // Adjust width as needed
        dialogConfig.height = '400px'; // Adjust height as needed
        dialogConfig.disableClose = true; // Prevents closing the dialog by clicking outside of it

        dialogConfig.data = { data: data }
        const dialogRef = this.dialog.open(QrcodeComponent, dialogConfig);

        dialogRef.afterClosed().subscribe(result => {
            this.http.delete("http://localhost:8081/ebank/api/v1/client/ClearDatas/"+this.cookieservice.get('id'),{headers:this.headers})
                .subscribe((res:any)=>{
                    console.log("res",res)
                },(err:any)=>{console.log("err",err)})
            console.log('The dialog was closed');
            // Handle actions after the dialog is closed, if needed
        });
    }
}
