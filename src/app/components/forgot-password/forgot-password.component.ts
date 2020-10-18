import { Component, OnInit } from '@angular/core';
import { flatten } from '@angular/compiler';
import { MessageService } from 'src/app/services/message.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  emailSent: boolean = false;
  email: string;
  emailSuccess: boolean = false;
  phoneNumber:string;

  constructor(private messageService:MessageService,private router:Router) { }

  ngOnInit(): void {
  }

  sendEmail(){
    //if email is successful set emailSuccess to true
    //the auto generated UUID is the reset token
    if(this.email.length > 0 && this.phoneNumber.length > 0 && this.phoneNumber.length < 12){
      if(this.phoneNumber.length === 11){
        this.phoneNumber = this.phoneNumber.substring(1);
      }

      const emailObj = {
        email: this.email,
        id: sessionStorage.getItem('userId'),
        phoneNumber: this.phoneNumber
      };
      this.emailSent = true;

      this.messageService.passwordReset(JSON.stringify(emailObj))
        .subscribe(res => {
          if(res === 1){
            this.emailSuccess = true;
            this.redirectToLogin();
          }
        });
    }
  }

  tryAgain(){
    this.emailSent = false;
    this.email = '';
    this.phoneNumber = '';
  }

  redirectToLogin(){
    setInterval(() => {
      this.router.navigateByUrl('/login');
    },3000);
  }
}
