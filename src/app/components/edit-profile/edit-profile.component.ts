import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth-service.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

  profile: User = new User();
  bio: string;
  city: string;
  state: string;
  twitter: string;
  email: string;
  image:File = null;

  constructor(private router:Router,private userService:AuthService) { }

  ngOnInit(): void {
    if(sessionStorage.getItem('userId')?.length <= 4 || sessionStorage.getItem('userId')?.length === undefined){
      this.router.navigateByUrl('/login');
    }
    this.profile.firstName = sessionStorage.getItem('userFirstName');
    this.profile.lastName = sessionStorage.getItem('userLastName');
    this.profile.twitter = sessionStorage.getItem('userTwitter') !== 'null' ? sessionStorage.getItem('userTwitter') : '';
    this.profile.email = sessionStorage.getItem('userEmail') !== 'null' ? sessionStorage.getItem('userEmail') : '';
    this.profile.city = sessionStorage.getItem('userCity') !== 'null' ? sessionStorage.getItem('userCity') : '';
    this.profile.state = sessionStorage.getItem('userState') !== 'null' ? sessionStorage.getItem('userState') : '';
    this.profile.bio = sessionStorage.getItem('userBio') !== 'null' ? sessionStorage.getItem('userBio') : '';
    this.profile.image = sessionStorage.getItem('userPic') !== 'null' ? sessionStorage.getItem('userPic') : '';


  }

  onImageChange(e) {
    this.image = <File>e.target.files[0];
  }

  saveProfile(data){
    if(this.image !== null){
      const imageObj = {
        id: sessionStorage.getItem('userId'),
        email: data.email?.length > 0 ? data.email : this.profile.email,
        twitter: data.twitter?.length > 0 ? data.twitter : this.profile.twitter,
        city: data.city?.length > 0 ? data.city : this.profile.city,
        state: data.state?.length > 0 ? data.state : this.profile.state,
        bio: data.bio?.length > 0 ? data.bio : this.profile.bio,
        image: this.image !== null ? this.image : null,
        imageType: this.image !== null ? this.image.type.split('/')[1] : null
      };

      this.userService.updateUserWithImage(imageObj)
      .subscribe(res => {

        if(imageObj.email.length > 0){
          sessionStorage.setItem('email',data.email);
        }

        this.router.navigateByUrl('/profile/user');
      });
    }else{
      const updateObj = {
        id: sessionStorage.getItem('userId'),
        email: data.email?.length > 0 ? data.email : this.profile.email,
        twitter: data.twitter?.length > 0 ? data.twitter : this.profile.twitter,
        city: data.city?.length > 0 ? data.city : this.profile.city,
        state: data.state?.length > 0 ? data.state : this.profile.state,
        bio: data.bio?.length > 0 ? data.bio : this.profile.bio
      };

      this.userService.updateUserWithoutImage(JSON.stringify(updateObj))
        .subscribe(res => {
          if(updateObj.email.length > 0){
            sessionStorage.setItem('email',data.email);
          }

          this.router.navigateByUrl('/profile/user');
        });
    }
  }
}
