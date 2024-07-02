import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {CookieService} from "ngx-cookie-service";

@Component({
  selector: 'app-fiche-employee',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.css']
})
export class EmployeeFormComponent {
  employeeForm: FormGroup;
  sexes = [ "Homme", "Femme"];

  // // Sample data for admin and agence (replace with actual data as needed)
  // admins: Admin[] = []; // Populate with actual data
  // agences: Agence[] = []; // Populate with actual data

  constructor(private http:HttpClient,private cookieService:CookieService,private fb: FormBuilder) {
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
      const formData: any = this.employeeForm.value ;

      const headers = new HttpHeaders({
        'Authorization': 'Bearer '+this.cookieService.get('token')
      });
      let id=this.cookieService.get('id')
      this.http.post('http://localhost:8081/ebank/api/v1/admin/addEmployee/'+id,formData,{headers: headers})
          .subscribe((res:any)=>{
          console.log("SUCCESS")

          },(err:any)=>{
            console.log("err",err)
          })
      console.log(formData); // Replace with actual submission logic
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
