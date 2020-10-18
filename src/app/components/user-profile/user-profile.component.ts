import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Activity } from 'src/app/models/Activity';
import { User } from 'src/app/models/User';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth-service.service';
import { PictureConverter } from 'src/app/utils/PictureConverter';
import { RecentActivityService } from 'src/app/services/recent-activity.service';
import { TextFormat } from 'src/app/utils/TextFormat';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  profile: User = new User();
  recentActivities: any[] = [];
  postList: any[] = [];
  productList: any[] = [];
  activitiesList: any[] = [];
  combinedList: any[] = [];
  userId:string;
  @Output() newMessage: EventEmitter<number> = new EventEmitter<number>();

  constructor(private router:Router,private userService:AuthService,
      private recentActivitiesService:RecentActivityService,private messageService:MessageService) { }

  ngOnInit(): void {
    if(sessionStorage.getItem('userId')?.length <= 4 || sessionStorage.getItem('userId')?.length === undefined){
      this.router.navigateByUrl('/login');
    }

    this.profile.city = 'city';
    this.profile.state = 'state';
    this.profile.bio = 'bio';

    this.userId = sessionStorage.getItem('userId');
    let pictureConverter:PictureConverter = new PictureConverter();
    let textFormat:TextFormat = new TextFormat();

    this.userService.getUser(JSON.stringify({userId: this.userId}))
      .subscribe(tempUser => {
        this.profile.firstName = tempUser.firstName;
        this.profile.lastName = tempUser.lastName;
        this.profile.email = tempUser.email !== undefined && tempUser.email !== null ? tempUser.email : '';
        this.profile.twitter = tempUser.twitter !== undefined && tempUser.twitter !== null ? tempUser.twitter : '';
        this.profile.bio = tempUser.bio !== undefined && tempUser.bio !== null ? tempUser.bio : '';
        this.profile.city = tempUser.city !== undefined && tempUser.city !== null ? tempUser.city : '';
        this.profile.state = tempUser.state !== undefined && tempUser.state !== null ? tempUser.state : '';


        this.profile.image = pictureConverter.dataTypeFormat(tempUser?.image,tempUser?.imageType);
        this.profile.imageType = tempUser.imageType;



        /*grab the user's posts' titles, products' titles, and activities they started hosting from
        now to a week ago
        */

        this.recentActivitiesService.grabRecentPosts(JSON.stringify({userId: this.userId}))
          .subscribe(posts => {
            this.postList = posts;

            this.postList = this.postList.map(post => ({...post,type: 'post',location: ''}));

            this.recentActivitiesService.grabRecentProducts(JSON.stringify({userId: this.userId}))
              .subscribe(products => {
                this.productList = products;

                this.productList = this.productList.map(product => ({...product,type: 'product',location: ''}));
                this.recentActivitiesService.grabRecentActivities(JSON.stringify({userId: this.userId}))
                  .subscribe(activities => {
                    this.activitiesList = activities;

                    this.activitiesList = this.activitiesList.map(activity => ({...activity,type: 'activity'}));

                    //combine the three lists
                    this.combinedList = [...this.postList,...this.productList,...activities];

                    //create message for each one
                    this.combinedList.forEach((recAct,idx) => {
                      if(recAct.type === 'post'){
                        this.recentActivities.unshift({
                          message: `${textFormat.formatFirstName(this.profile.firstName)} posted ${recAct.title} on ${recAct.createdAt}`,
                          timeStamp: recAct.createdAt
                        });
                      }else if(recAct.type === 'product'){
                        this.recentActivities.unshift({
                          message: `${textFormat.formatFirstName(this.profile.firstName)} auctioned ${recAct.title} on ${recAct.createdAt}`,
                          timeStamp: recAct.createdAt
                        });
                      }else{
                        this.recentActivities.unshift({
                          message: `${textFormat.formatFirstName(this.profile.firstName)} created ${recAct.title} activity on ${recAct.createdAt}`,
                          timeStamp: recAct.createdAt
                        });
                      }
                    });
                  });
              });
          });
      });
  }

  redirectToEdit(){
    //set data in local storage
    sessionStorage.setItem('userFirstName', this.profile.firstName);
    sessionStorage.setItem('userLastName', this.profile.lastName);
    sessionStorage.setItem('userTwitter', this.profile.twitter !== null ? this.profile.twitter : '');
    sessionStorage.setItem('userEmail', this.profile.email !== null ? this.profile.email : '');
    sessionStorage.setItem('userCity', this.profile.city !== null ? this.profile.city : '');
    sessionStorage.setItem('userState', this.profile.state !== null ? this.profile.state : '');
    sessionStorage.setItem('userBio', this.profile.bio !== null ? this.profile.bio : '');
    sessionStorage.setItem('userPic', this.profile.image !== null ? this.profile.image : '');

    this.router.navigateByUrl('/profile/user/edit');
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
