import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router, ActivatedRoute } from "@angular/router";
import { map, catchError, delay } from "rxjs/operators";
import { of, BehaviorSubject, throwError } from "rxjs";

// ================= only for demo purpose ===========
const DEMO_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YjhkNDc4MDc4NmM3MjE3MjBkYzU1NzMiLCJlbWFpbCI6InJhZmkuYm9ncmFAZ21haWwuY29tIiwicm9sZSI6IlNBIiwiYWN0aXZlIjp0cnVlLCJpYXQiOjE1ODc3MTc2NTgsImV4cCI6MTU4ODMyMjQ1OH0.dXw0ySun5ex98dOzTEk0lkmXJvxg3Qgz4ed";

// const DEMO_USER: User = {
//   id: "5b700c45639d2c0c54b354ba",
//   displayName: "Watson Joyce",
//   role: "SA",
// };
// ================= you will get those data from server =======

@Injectable({
  providedIn: "root",
})
export class JwtAuthService {
  token:any;

  return!: string;

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.route.queryParams
      .subscribe(params => this.return = params['return'] || '/');
  }
  public restpasswordEmail(body:any){
    return this.http.post<any>('http://localhost:8081/ebank/api/v1/auth/sendEmail',body)
  }

  public signin(username:any, password:any) {

    let body = {
      "identificationnumber": username,
      "password": password
    }

    return this.http.post('http://localhost:8081/ebank/api/v1/auth/signin', body)
  }
}
