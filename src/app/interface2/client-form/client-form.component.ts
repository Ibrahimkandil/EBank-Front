import { Component } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {MatSnackBar} from "@angular/material/snack-bar";
import {CookieService} from "ngx-cookie-service";

@Component({
  selector: 'app-client-form',
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.css']
})
export class ClientFormComponent {
  clientForm: FormGroup;



  sexes = [ "Homme", "Femme"];
  civilStatuses = [  "CELIBATAIRE",
    "MARIE",
    "DIVORCE",
    "VEUF"];
  employmentStatuses = ["EMPLOYE",
    "INDEPENDANT",
    "AUTRE"];

  constructor(
      private fb: FormBuilder,
      private http: HttpClient,
      private snackBar: MatSnackBar,
      private cookieService: CookieService

  ) {




    this.clientForm = this.fb.group({
      last_name: new FormControl(null, Validators.required),
      first_name: new FormControl(null , Validators.required),
      Address: new FormControl(null ),
      phone: new FormControl(null,  Validators.required),
      email: new FormControl(null,  [Validators.required, Validators.email]),
      date_of_birth: new FormControl(null),
      sexe: new FormControl(null, Validators.required),
      etatCivil: new FormControl(null,  Validators.required),
      statutEmploi: new FormControl(null,  Validators.required),
      image_data: new FormControl(null)
    });
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.clientForm.valid) {
      const formData = this.clientForm.value;
      console.log('Form data:', formData);
      console.log('Form data:', this.clientForm);


      let id=this.cookieService.get('id');
      const headers = new HttpHeaders({
        'Authorization': 'Bearer '+this.cookieService.get('token')
      });
      this.http.post<any>('http://localhost:8080/ebank/api/v1/employee/addClient/'+id, formData,{headers: headers}).subscribe(
          response => {
            console.log('Form submission successful:', response);
            this.snackBar.open('Client data saved successfully', 'Close', {
              duration: 3000,
            });
            // this.clientForm.reset();
          },
          error => {
            console.error('Form submission error:', error);
            this.snackBar.open('Error saving client data', 'Close', {
              duration: 3000,
            });
          }
      );
    } else {
      this.snackBar.open('Please fill in all required fields', 'Close', {
        duration: 3000,
      });
    }
  }
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.clientForm.patchValue({
          image_data: e.target.result.split(',')[1] // Base64 string without data:image/jpeg;base64,
        });
      };
      reader.readAsDataURL(file);
    }
  }
}
