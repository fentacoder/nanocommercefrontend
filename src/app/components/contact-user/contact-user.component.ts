import { Component, OnInit } from '@angular/core';
import { MessageService } from 'src/app/services/message.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contact-user',
  templateUrl: './contact-user.component.html',
  styleUrls: ['./contact-user.component.css']
})
export class ContactUserComponent implements OnInit {

  message:string;
  senderName: string;
  messageSent:boolean = false;

  constructor(private messageService:MessageService,private router:Router) { }

  ngOnInit(): void {
    if(sessionStorage.getItem('userId')?.length <= 4 || sessionStorage.getItem('userId')?.length === undefined){
      this.router.navigateByUrl('/login');
    }

    this.senderName = sessionStorage.getItem('firstName');
  }

  sendMessage(data){
    if(data.message.length > 0 && data.message.length < 500){
      const messageObj = {
        senderId: sessionStorage.getItem('userId'),
        senderName: this.senderName,
        message: data.message,
        email: sessionStorage.getItem('email')
      };

      this.messageService.sendAdminMessage(JSON.stringify(messageObj))
        .subscribe(res => {
          this.messageSent = true;
          setTimeout(() => {
            this.router.navigateByUrl('/market');
          },5000);
        });
    }
  }

}
