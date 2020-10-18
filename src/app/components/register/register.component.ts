import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth-service.service'
import { Router } from '@angular/router';
import { FacebookLoginProvider, SocialAuthService, SocialUser } from "angularx-social-login";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: number;
  city: string;
  state: string;
  user: SocialUser;
  agree:boolean = false;
  submitted:boolean = false;
  accepted:boolean = false;

  constructor(private authService:AuthService,private router: Router,
      private socialAuthService:SocialAuthService) { }

  ngOnInit(): void {
    this.socialAuthService.authState.subscribe((user) => {
      this.user = user;
    });

    if(sessionStorage.getItem('userId')?.length > 4 && sessionStorage.getItem('userId')?.length !== undefined){
      this.router.navigateByUrl('/exchange');
    }
  }

  onRegisterUser(data): void{
    this.submitted = true;
    if(data.agree){
      this.accepted = true;
      if(data.password === data.confirmPassword && data.firstName.length > 0 && data.firstName.length < 150
        && data.lastName.length > 0 && data.lastName.length < 150  && data.email.length > 0 && data.email.length < 150
          && data.phoneNumber.toString().length > 9 && data.phoneNumber.toString().length < 12){

        if(data.phoneNumber.length === 11){
          this.phoneNumber = data.phoneNumber.substring(1);
        }




        const dataObj = {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          password: data.password,
          phoneNumber: this.phoneNumber,
          city: data.city !== null ? data.city : null,
          state: data.state !== null ? data.state : null
        }

        sessionStorage.setItem('email',data.email);
        sessionStorage.setItem('firstName',data.firstName);
        sessionStorage.setItem('lastName',data.lastName);
        sessionStorage.setItem('phoneNumber',data.phoneNumber);

        this.authService.registerUser(JSON.stringify(dataObj))
          .subscribe(user => {
            sessionStorage.setItem('userId',user.id);
            this.router.navigateByUrl('/');
          });
      }
    }
    this.accepted = false;
  }

  facebookSignUp(){
    this.submitted = true;
    if(this.agree){
      this.accepted = true;
      const fbLoginOptions = {
        scope: 'pages_messaging,pages_messaging_subscriptions,email,pages_show_list,manage_pages',
        return_scopes: true,
        enable_profile_selector: true
      }; // https://developers.facebook.com/docs/reference/javascript/FB.login/v2.11

      this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID,fbLoginOptions);
      this.facebookRegister(this.user);
    }
  }

  facebookRegister(user:SocialUser){
    const dataObj = {
      firstName: user.name.split(' ')[0],
      lastName: user.name.split(' ')[1],
      email: user.email
    }

    sessionStorage.setItem('email',user.email);
    sessionStorage.setItem('firstName',dataObj.firstName);
    sessionStorage.setItem('lastName',dataObj.lastName);
    sessionStorage.setItem('facebookLogin','true');

    this.authService.registerUser(JSON.stringify(dataObj))
      .subscribe(res => {
        console.log(res.id);

        sessionStorage.setItem('phoneNumber',res.phoneNumber);
        sessionStorage.setItem('userId',res.id)
        this.router.navigateByUrl('/');
      });
  }

  termsRedirect(){
    this.router.navigateByUrl('/terms');
  }

  privacyRedirect(){
    this.router.navigateByUrl('/privacypolicy');
  }
}
