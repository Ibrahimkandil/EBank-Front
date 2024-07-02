import {Component, ViewChild} from '@angular/core';
import {MatProgressBar} from "@angular/material/progress-bar";
import {MatButton} from "@angular/material/button";
import {FormControl, FormGroup, UntypedFormControl, UntypedFormGroup, Validators} from "@angular/forms";
import {Subject} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {JwtAuthService} from "./jwt-auth.service";
import {AppLoaderService} from "./app-loader/app-loader.service";
import { MatSnackBar } from '@angular/material/snack-bar';
import {CookiesGestionnaireService} from "./CookiesGestionnaire.service";
import {LoginControllerService} from "./login-controller.service";

@Component({
  selector: 'app-authenticate',
  templateUrl: './authenticate.component.html',
  styleUrls: ['./authenticate.component.css']
})
export class AuthenticateComponent {
  @ViewChild(MatProgressBar) progressBar!: MatProgressBar;
  @ViewChild(MatButton) submitButton!: MatButton;

  signinForm!: FormGroup;
  errorMsg = '';
  // return: string;

  private _unsubscribeAll: Subject<any>;
  show_Error: boolean = false;

  constructor(
    private jwtAuth: JwtAuthService,
    private matxLoader: AppLoaderService,
    private router: Router,
    private route: ActivatedRoute,
    private cookieService:CookiesGestionnaireService,
    private snackBar: MatSnackBar,
    private LoginControllerService:LoginControllerService
  ) {
    this.LoginControllerService.check_login();
    this._unsubscribeAll = new Subject();
  }

  ngOnInit() {
    this.signinForm =new FormGroup({
      username:  new FormControl(null, Validators.required),
      password:  new FormControl(null, Validators.required),
      rememberMe:  new FormControl(true)
    });

    // this.route.queryParams
    //   .pipe(takeUntil(this._unsubscribeAll))
    //   .subscribe(params => this.return = params['return'] || '/');
  }

  ngAfterViewInit() {
    this.autoSignIn();
  }

  ngOnDestroy() {
    this._unsubscribeAll.next(1);
    this._unsubscribeAll.complete();
  }

  signin() {
    const signinData = this.signinForm.value

    this.submitButton.disabled = true;
    this.progressBar.mode = 'indeterminate';


    this.jwtAuth.signin(signinData.username, signinData.password)
      .subscribe(response => {
        this.cookieService.setCookies(response);

        this.snackBar.open("Success", 'Error', {
          duration: 5000, // duration in milliseconds (optional)
        });
        console.log('response', response);

        this.router.navigateByUrl("interface1");
      }, err => {
        this.submitButton.disabled = false;
        this.progressBar.mode = 'determinate';
        this.errorMsg = err.message;
        console.log(err);
        this.snackBar.open(err.toString(), 'Error', {
          duration: 5000, // duration in milliseconds (optional)
        });
      })
  }

  autoSignIn() {
    if(this.jwtAuth.return === '/') {
      return
    }
    this.matxLoader.open(`Automatically Signing you in! \n Return url: ${this.jwtAuth.return.substring(0, 20)}...`, {width: '320px'});
    setTimeout(() => {
      this.signin();
      console.log('autoSignIn');
      this.matxLoader.close()
    }, 2000);
  }

}
