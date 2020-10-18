import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth-service.service';
import { PictureConverter } from 'src/app/utils/PictureConverter';
import { RecentActivityService } from 'src/app/services/recent-activity.service';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-stranger-profile',
  templateUrl: './stranger-profile.component.html',
  styleUrls: ['./stranger-profile.component.css']
})
export class StrangerProfileComponent implements OnInit {

  //grab stranger profileId from router paramMap then grab profile using that ID
  strangerId: string;
  profile: User = new User();
  recentActivities: any[] = [];
  postList: any[] = [];
  productList: any[] = [];
  activitiesList: any[] = [];
  combinedList: any[] = [];
  @Output() newMessage: EventEmitter<number> = new EventEmitter<number>();

  constructor(private router:Router,private route:ActivatedRoute,
      private userService:AuthService,private recentActivitiesService:RecentActivityService,
      private messageService:MessageService) { }

  ngOnInit(): void {
    if(sessionStorage.getItem('userId')?.length <= 4 || sessionStorage.getItem('userId')?.length === undefined){
      this.router.navigateByUrl('/login');
    }

    this.strangerId = this.route.snapshot.paramMap.get('strangerId');
    let pictureConverter:PictureConverter = new PictureConverter();

    this.userService.getUser(JSON.stringify({userId: this.strangerId}))
      .subscribe(tempUser => {
        this.profile.firstName = tempUser.firstName;
        this.profile.lastName = tempUser.lastName;
        this.profile.email = tempUser.email !== undefined && tempUser.email !== null ? tempUser.email : null;
        this.profile.twitter = tempUser.twitter !== undefined && tempUser.twitter !== null ? tempUser.twitter : null;
        this.profile.bio = tempUser.bio !== undefined && tempUser.bio !== null ? tempUser.bio : null;
        this.profile.city = tempUser.city !== undefined && tempUser.city !== null ? tempUser.city : null;
        this.profile.state = tempUser.state !== undefined && tempUser.state !== null ? tempUser.state : null;


        this.profile.image = pictureConverter.dataTypeFormat(tempUser?.image,tempUser?.imageType);
        this.profile.imageType = tempUser.imageType;



        /*grab the user's posts' titles, products' titles, and activities they started hosting from
        now to a week ago
        */

        this.recentActivitiesService.grabRecentPosts(JSON.stringify({userId: this.strangerId}))
          .subscribe(posts => {
            this.postList = posts;

            this.postList = this.postList.map(post => ({...post,type: 'post',location: ''}));

            this.recentActivitiesService.grabRecentProducts(JSON.stringify({userId: this.strangerId}))
              .subscribe(products => {
                this.productList = products;

                this.productList = this.productList.map(product => ({...product,type: 'product',location: ''}));
                this.recentActivitiesService.grabRecentActivities(JSON.stringify({userId: this.strangerId}))
                  .subscribe(activities => {
                    this.activitiesList = activities;

                    this.activitiesList = this.activitiesList.map(activity => ({...activity,type: 'activity'}));

                    //combine the three lists
                    this.combinedList = [...this.postList,...this.productList,...activities];

                    //create message for each one
                    this.combinedList.forEach(recAct => {
                      if(recAct.type === 'post'){
                        this.recentActivities.push({
                          message: `${this.profile.firstName} posted ${recAct.title} on ${recAct.createdAt}`,
                          timeStamp: recAct.createdAt
                        });
                      }else if(recAct.type === 'product'){
                        this.recentActivities.push({
                          message: `${this.profile.firstName} auctioned ${recAct.title} on ${recAct.createdAt}`,
                          timeStamp: recAct.createdAt
                        });
                      }else{
                        this.recentActivities.push({
                          message: `${this.profile.firstName} created ${recAct.title} activity on ${recAct.createdAt}`,
                          timeStamp: recAct.createdAt
                        });
                      }
                    });
                  });
              });
          });
      });
  }

  contactUser(){
    sessionStorage.setItem('strangerId',this.strangerId);

    this.router.navigateByUrl('/contactuser');
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
