import { Component } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {CookieService} from "ngx-cookie-service";
import {ProfilService} from "./profil.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Observable} from "rxjs";
import {SignatureComponent} from "../tools/signature/signature.component";
import {Router} from "@angular/router";
import {CookiesGestionnaireService} from "../authenticate/CookiesGestionnaire.service";

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

  constructor(private router:Router,private cookieGestionnaireService:CookiesGestionnaireService,
      private formBuilder: FormBuilder,private http:HttpClient,public cookieservice:CookieService,private profilservice:ProfilService) {
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
      console.log("this.list",this.list)
      console.log("url",this.url)
      this.fetchData().subscribe((data:any)=>{
              this.Objet=data
              console.log("this.objet",this.Objet)
              this.list.forEach((input:any) => {
                  if(input!=="image_data"){

                      formGroupConfig[input] = [data[input], Validators.required]; // Set default value and validators if needed

                      }else {
                      formGroupConfig[input] = [data[input]]; // Set default value and validators if needed


                  }
              });
              this.Form = this.formBuilder.group(formGroupConfig);

          },(err:any)=>{console.log(err)})


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
            console.log("data",data)
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

      console.log('Password reset successfully');
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
      console.log('Votre nouveau  mot du passe ne correspondant not match');
    }
  }

  formValid(): boolean {
    return this.newPassword !== '' && this.confirmPassword !== '';
  }
    onSubmit() {
        if (this.Form.valid) {
            console.log('Form submitted successfully');
            const url=this.pathchingurl+this.cookieservice.get('id')
            this.http.patch<any>(url, this.Form.value, { headers: this.headers })
                .subscribe((data:any) => {
                    console.log("data",data)
                }, (err:any) => {
                    console.error('Error:', err)
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
        console.log('Received Image Data:', imageData);
        const url=this.deletingurl+this.cookieservice.get('id')


        let body ={
            "image_data":imageData.split(',')[1]
        }
        this.http.patch<any>(url, body, { headers: this.headers })
            .subscribe((data:any) => {
                console.log("data",data)
                this.cookieGestionnaireService.clearCookies();
                this.router.navigateByUrl("auth");
            }, (err:any) => {
                console.error('Error:', err)
            })
        // You can perform further actions with imageData here
    }
}
