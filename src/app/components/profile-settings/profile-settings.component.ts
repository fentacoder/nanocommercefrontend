import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { SocialAuthService } from 'angularx-social-login';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.css']
})
export class ProfileSettingsComponent implements OnInit {

  loggedIn:boolean = false;
  @Output() newMessage: EventEmitter<number> = new EventEmitter<number>();

  constructor(private router: Router,private socialAuthService:SocialAuthService,
    private messageService:MessageService) { }

  ngOnInit(): void {
    if(sessionStorage.getItem('userId')?.length > 4 && sessionStorage.getItem('userId')?.length !== undefined){
      this.loggedIn = true;
    }

  }

  signUserOut(){
    if(sessionStorage.getItem('facebookLogin') === 'true'){
      this.socialAuthService.signOut()
        .then(() => {
          sessionStorage.removeItem('userId');
          sessionStorage.removeItem('email');
          this.router.navigateByUrl('/login');
        })
        .catch(err => console.log('err'));
    }else{
      sessionStorage.removeItem('userId');
      sessionStorage.removeItem('email');
      this.router.navigateByUrl('/login');
    }
  }

  updateMessages(){
    this.messageService.getNewMessageCount(JSON.stringify({id: sessionStorage.getItem('userId')}))
      .subscribe(count => {
        if(count !== -1){
          this.newMessage.emit(count);
        }
      });
  }
}
