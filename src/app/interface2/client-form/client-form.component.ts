import {Component, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {MatSnackBar} from "@angular/material/snack-bar";
import {CookieService} from "ngx-cookie-service";
import {Router} from "@angular/router";
import {MatButton} from "@angular/material/button";
import {MatProgressBar} from "@angular/material/progress-bar";


@Component({
  selector: 'app-client-form',
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.css']
})
export class ClientFormComponent {
  @ViewChild(MatButton) submitButton!: MatButton;
  @ViewChild(MatProgressBar) progressBar!: MatProgressBar;


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
      private cookieService: CookieService,
      private router: Router

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
    this.submitButton.disabled = true;
    this.progressBar.mode = 'indeterminate';
    if (this.clientForm.valid) {
      const formData = this.clientForm.value;



      let id=this.cookieService.get('id');
      const headers = new HttpHeaders({
        'Authorization': 'Bearer '+this.cookieService.get('token')
      });
      this.http.post<any>('http://localhost:8081/ebank/api/v1/employee/addClient/'+id, formData,{headers: headers}).subscribe(
          response => {
            this.snackBar.open('Client data saved successfully', 'Close', {
              duration: 5000,
            });


            this.router.navigate(['/fiche/Client/'+response.id]);
            // this.clientForm.reset();
          },
          error => {
            this.submitButton.disabled = false;
            this.progressBar.mode = 'determinate';
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
