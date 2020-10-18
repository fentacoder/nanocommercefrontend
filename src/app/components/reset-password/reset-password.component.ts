import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth-service.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  password: string;
  confirmPassword:string;
  resetId:string;
  resetSuccessful:boolean = false;
  email:string;

  constructor(private userService:AuthService,private route:ActivatedRoute,
      private router:Router) { }

  ngOnInit(): void {
    //grab the reset link id from the paramMap
    //the reset id should be the auto generated UUID from the back end
    this.resetId = this.route.snapshot.paramMap.get('resetToken') !== undefined &&
      this.route.snapshot.paramMap.get('resetToken') !== null ? this.route.snapshot.paramMap.get('resetToken') : '';

    if(this.resetId === ''){
      this.router.navigateByUrl('/login');
    }

    const resetObj = {
      resetToken: this.resetId
    };

    //check that the reset id is equal to the id in the database
    this.userService.validateResetToken(JSON.stringify(resetObj))
      .subscribe(email => {
        if(email.length === 0){
          //they are not equal
          this.router.navigateByUrl('/login');
        }

        this.email = email;
      });
  }

  resetPassword(){
    if(this.password === this.confirmPassword){
      this.userService.resetPassword(JSON.stringify({password: this.password,email: this.email}))
        .subscribe(res => {
          if(res === 1){
            this.resetSuccessful = true;
            setInterval(() => {
              this.router.navigateByUrl('/login');
            },5000);
          }
        });
    }
  }
}
