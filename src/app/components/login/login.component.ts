import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth-service.service';
import { Router } from '@angular/router';
import { FacebookLoginProvider, SocialAuthService, SocialUser } from "angularx-social-login";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email: string;
  password: string;
  user: SocialUser;
  invalidCredentials:boolean = false;
  loading:boolean = false;

  constructor(private authService:AuthService,private router:Router,
    private socialAuthService:SocialAuthService) { }

  ngOnInit(): void {
    this.socialAuthService.authState.subscribe((user) => {
      this.user = user;
    });

    if(sessionStorage.getItem('userId')?.length > 4 && sessionStorage.getItem('userId')?.length !== undefined){
      this.router.navigateByUrl('/exchange');
    }
  }

  onLoginUser(data): void{
    this.invalidCredentials = false;
    this.loading = true;

    if(data.password.length > 0 && data.email.length > 0){
      const dataObj = {
        email: data.email,
        password: data.password
      }

      this.authService.loginUser(JSON.stringify(dataObj))
        .subscribe(res => {
          console.log('res: ',res);
          this.loading = false;

          if(Number(res?.suspended) !== 1){
            if(res?.id?.length > 0 && res !== null){
              sessionStorage.setItem('userId',res?.id);
              sessionStorage.setItem('email',res?.email);
              sessionStorage.setItem('firstName',res?.firstName);
              sessionStorage.setItem('lastName',res?.lastName);
              sessionStorage.setItem('phoneNumber',res?.phoneNumber);
              this.router.navigateByUrl('/');
            }else{
              this.invalidCredentials = true;
            }
          }else{
            this.router.navigateByUrl('/suspended');
          }

        });
    }else{
      this.loading = false;
    }

  }

  facebookLogin(){
    const fbLoginOptions = {
      scope: 'pages_messaging,pages_messaging_subscriptions,email,pages_show_list,manage_pages',
      return_scopes: true,
      enable_profile_selector: true
    }; // https://developers.facebook.com/docs/reference/javascript/FB.login/v2.11

    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID,fbLoginOptions);
    this.finishFacebookLogin(this.user);
  }

  finishFacebookLogin(user:SocialUser){
    const dataObj = {
      firstName: user.name.split(' ')[0],
      lastName: user.name.split(' ')[1],
      email: user.email
    }

    sessionStorage.setItem('email',user.email);
    sessionStorage.setItem('facebookLogin','true');
    sessionStorage.setItem('firstName',dataObj.firstName);
    sessionStorage.setItem('lastName',dataObj.lastName);

    this.authService.loginUser(JSON.stringify(dataObj))
      .subscribe(res => {
        if(Number(res.suspended) !== 1){
          sessionStorage.setItem('userId',res.id);
          this.router.navigateByUrl('/');
        }else{
          this.router.navigateByUrl('/suspended');
        }
      });
  }

}
