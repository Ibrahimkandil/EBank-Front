import {Component, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {CookieService} from "ngx-cookie-service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Route, Router} from "@angular/router";
import {MatProgressBar} from "@angular/material/progress-bar";
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'app-fiche-employee',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.css']
})
export class EmployeeFormComponent {
  @ViewChild(MatProgressBar) progressBar!: MatProgressBar;
  @ViewChild(MatButton) submitButton!: MatButton;
  employeeForm: FormGroup;
  sexes = [ "Homme", "Femme"];

  // // Sample data for admin and agence (replace with actual data as needed)
  // admins: Admin[] = []; // Populate with actual data
  // agences: Agence[] = []; // Populate with actual data

  constructor(private router:Router,private snackBar: MatSnackBar,private http:HttpClient,private cookieService:CookieService,private fb: FormBuilder) {
    this.employeeForm = this.fb.group({
      name: ['', Validators.required],
      mail: ['', [Validators.required, Validators.email]],
      salaire: ['', Validators.required],
      address: ['', Validators.required],
      cin: ['', Validators.required],
      last_name: ['', Validators.required],
      image_data: [null],
      sexe: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Initialize form controls or fetch data for dropdowns (admins, agences)
  }

  onSubmit(): void {

    if (this.employeeForm.valid) {
      this.submitButton.disabled = true;
      this.progressBar.mode = 'indeterminate';
      const formData: any = this.employeeForm.value ;

      const headers = new HttpHeaders({
        'Authorization': 'Bearer '+this.cookieService.get('token')
      });

      let id=this.cookieService.get('id')
      this.http.post('http://localhost:8081/ebank/api/v1/admin/addEmployee/'+id,formData,{headers: headers})
          .subscribe((res:any)=>{
            this.snackBar.open("Success", 'Error', {
              duration: 5000, // duration in milliseconds (optional)
            });
          this.router.navigate(['/fiche/Employee/'+res.id]);

          },(err:any)=>{
            console.log(err)
            this.submitButton.disabled = false;
            this.progressBar.mode = 'determinate';

          })
    } else {

      // Handle form validation errors
    }
  }
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.employeeForm.patchValue({
          image_data: e.target.result.split(',')[1] // Base64 string without data:image/jpeg;base64,
        });
      };
      reader.readAsDataURL(file);
    }
  }

}
