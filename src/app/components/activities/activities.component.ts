import { Component, OnInit, Output,EventEmitter } from '@angular/core';
import { ActivityService } from 'src/app/services/activity.service';
import { PictureConverter } from 'src/app/utils/PictureConverter';
import { MessageService } from 'src/app/services/message.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.css']
})
export class ActivityComponent implements OnInit {

  combinedList: any[] = [];

  //these three lists are made using the combined list and sorting based off of type
  hottestList: any[] = [];
  almostSoldList: any[] = [];
  recentList: any[] = [];
  loading:boolean = false;
  @Output() newMessage: EventEmitter<number> = new EventEmitter<number>();

  constructor(private activityService:ActivityService,private messageService:MessageService,private router:Router) { }

  ngOnInit(): void {
    this.loading = true;
    let pictureConverter:PictureConverter = new PictureConverter();
    //retrieve all of the products
    const boundObj = {
      minBound: 1,
      maxBound: 25,
      lastPage: 'false'
    };

    this.activityService.grabActivites(JSON.stringify(boundObj))
      .subscribe(activities => {
        let tempList:any[] = activities;

        //get the number of users in each activity
        tempList.forEach((item,idx) => {
          this.activityService.grabMemberNum(JSON.stringify({productId: item.id}))
            .subscribe(memberNumber => {
              this.activityService.grabImage(JSON.stringify({activityId: item.id}))
                .subscribe(image => {
                  let finalImage = pictureConverter.dataTypeFormat(image?.imageData,image?.type);

                  this.combinedList.push({
                    ...item,
                    memberNum: memberNumber,
                    image: image?.imageData !== null && image?.imageData !== undefined ? finalImage : '../../../assets/default_bg.png'
                  });

                  if(idx === tempList.length - 1){
                    //sort the activities into the respective lists
                    this.hottestList = this.combinedList.sort((a,b) => (a.memberNum > b.memberNum) ? 1 : -1);
                    this.hottestList = this.hottestList.slice(0,3);

                    this.recentList = this.combinedList.slice(0,3);
                    this.almostSoldList = this.combinedList.reverse();
                    this.almostSoldList = this.almostSoldList.slice(0,3);
                    this.loading = false;
                  }
                });
            });
        });

      });
  }

  updateMessages(){
    this.messageService.getNewMessageCount(JSON.stringify({id: sessionStorage.getItem('userId')}))
      .subscribe(count => {
        this.newMessage.emit(count);
      });
  }

  activityRedirect(e){
    let tempId:string = e.path[1].id;

    this.router.navigateByUrl(`/activities/activity/${tempId.split('>')[1]}`)
  }

  listAllRedirect(e){
    let tempId:string = e.path[0].id;
    this.router.navigateByUrl(`/activities/list/${tempId}`);
  }
}
