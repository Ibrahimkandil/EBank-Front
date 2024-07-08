import {Component, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MatProgressBar} from "@angular/material/progress-bar";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {JwtAuthService} from "../jwt-auth.service";
import * as CryptoJS from 'crypto-js';
import {MatSnackBar} from "@angular/material/snack-bar";
import {finalize, interval, Observable, takeWhile} from "rxjs";
import {map} from "rxjs/operators";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {CookieService} from "ngx-cookie-service";
import {Router} from "@angular/router";


@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.css'],
  animations: [
    trigger('slideInOut', [
      state('in', style({
        transform: 'translateX(0%)',
        opacity: 1,
        display:'flex',

      })),
      state('out', style({
        transform: 'translateX(100%)',
        display: 'none',
        opacity: 1,
        position: 'relative',
        bottom: '36%'



      })),
      state('versout', style({

        transform: 'translateX(-100%)',
        display:'none',
        opacity: 0,

      })),
      transition('in => out',animate('400ms  ease-out')),
      transition('in => versout', animate('400ms  ease-out')),
      transition('versout => in', animate('400ms  ease-out')),
      transition('out => in', [ style({position: 'relative', bottom: '0%'}), animate('400ms  ease-in'),])
    ])
  ]
})
export class ResetpasswordComponent {
  errMsg!: string ;
  @ViewChild(MatProgressBar) progressBar!: MatProgressBar;
  restForm=new FormGroup({
    email : new FormControl(null,[Validators.required,Validators.email]),
    code : new FormControl(null,Validators.required)
  })
    verified :boolean =false
    newPasswordForm=new FormGroup({
        newPassword : new FormControl(null,Validators.required),
        newPasswordrepeated : new FormControl(null,Validators.required)
    })
    totalTime: number = 60;
    countdown$! : Observable<string>;
    isTimeUp: boolean = false;

  emailvalide:boolean=false

  constructor(private JwtAuthService:JwtAuthService,
              private snackBar: MatSnackBar,
              private http: HttpClient,
              private cookieService:CookieService,
              private router:Router) {
    console.log("errMsg",this.errMsg)
    if(this.cookieService.get('token') && this.cookieService.get('id')){
      this.router.navigateByUrl("auth");
    }
  }


  reset(){
      const codeValue = this.restForm.get('code')?.value; // Retrieve the value

// && codeValue === this.password
      if (codeValue !== null && codeValue !== undefined  && codeValue === this.password) {
          this.verified = true;

      }else{
        this.errMsg= 'Code invalide';
          this.verified = false;
      }


  }
    startTimer(totalSeconds: number) {
        this.countdown$ = interval(1000).pipe(
            map(i => this.formatTime(totalSeconds - i - 1)),
            takeWhile(time => {
                const remainingSeconds = this.getSecondsFromTimeString(time);
                return remainingSeconds > 0;
            }),
            finalize(() => {
                this.isTimeUp = true;
                console.log('Timer completed.');
            })
        );
    }

    formatTime(totalSeconds: number): string {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${this.padZero(minutes)}:${this.padZero(seconds)}`;
    }

    padZero(num: number): string {
        return num < 10 ? '0' + num : num.toString();
    }

    getSecondsFromTimeString(timeString: string): number {
        const [minutesStr, secondsStr] = timeString.split(':');
        const minutes = parseInt(minutesStr, 10);
        const seconds = parseInt(secondsStr, 10);
        return minutes * 60 + seconds;
    }

     SECRET_KEY = 'verification'; // Replace with your actual secret key
     SALT = 'your_salt'; // Replace with your actual salt

    cryptage(strToEncrypt: string): string {
        const keySize = 256 / 32;
        const iterations = 65536;
        const key = CryptoJS.PBKDF2(this.SECRET_KEY, this.SALT, {
            keySize: keySize,
            iterations: iterations
        });

        const encrypted = CryptoJS.AES.encrypt(strToEncrypt, key, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });



        return encrypted.toString();
    }

  password: string = '';
  suivant() {
    this.progressBar.mode = 'indeterminate';
    // Check if the email field is not empty and is valid
    if (this.restForm.get('email')?.value !== null) {
        this.password = Math.floor(100000 + Math.random() * 900000).toString();

        let body = {
            "to": this.restForm.get('email')?.value,
            "verificationCode":this.cryptage(this.password)
        }
        this.restForm.get('email')?.value
        this.JwtAuthService.restpasswordEmail(body).subscribe(response => {

            this.emailvalide = true;

                this.isTimeUp=false

            this.startTimer(this.totalTime);

            this.snackBar.open(response.response, 'Close', {
                duration: 5000, // duration in milliseconds (optional)
            });



        }, err => {
            // this.submitButton.disabled = false;
            this.progressBar.mode = 'determinate';

            console.log("err",err);
            this.snackBar.open(err.toString(), 'Error', {
                duration: 5000, // duration in milliseconds (optional)
            });
        })

    }
  }
  precedent(){
      this.emailvalide=false
  }
  change() {
    const passValue = this.newPasswordForm.get('newPassword')?.value; // Retrieve the value
    const passrepetedValue = this.newPasswordForm.get('newPasswordrepeated')?.value; // Retrieve the value
    if (passValue !== null && passValue !== undefined && passrepetedValue !== null && passrepetedValue !== undefined && passValue === passrepetedValue) {
      let obj = {
        "email":this.restForm.get('email')?.value

      }

      this.http.post<any>('http://localhost:8081/ebank/api/v1/auth/getEmail',obj)
        .subscribe(response => {

          const headers = new HttpHeaders({
              'Authorization': 'Bearer '+response.token
          });
          let restObj ={
            "password":this.cryptage(passValue)
          }
          this.http.post<any>('http://localhost:8081/ebank/api/v1/client/reset/'+response['client'].id,restObj, { headers: headers })
            .subscribe(response => {
              this.snackBar.open(response, 'Success', {
                duration: 5000, // duration in milliseconds (optional)
              });
            },error => {
              console.log("error",error)
              this.snackBar.open(error, 'Error', {
                duration: 5000, // duration in milliseconds (optional)
              });
            })
        }, err => {
          console.log('err', err);
          this.snackBar.open(err, 'Success', {
            duration: 5000, // duration in milliseconds (optional)
          });
        })

      }


  }
}
