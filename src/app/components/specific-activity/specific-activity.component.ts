import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Offer } from 'src/app/models/Offer';
import { ActivityService } from 'src/app/services/activity.service';
import { Router, ActivatedRoute } from '@angular/router';
import { TextFormat } from 'src/app/utils/TextFormat';
import { PictureConverter } from 'src/app/utils/PictureConverter';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-specific-activity',
  templateUrl: './specific-activity.component.html',
  styleUrls: ['./specific-activity.component.css']
})
export class SpecificActivityComponent implements OnInit {

  initialOffer: Offer = new Offer();
  offer: any = {};
  breakDate: string;
  breakTime: string;
  breakDescription: string;
  teamNumber: number = 0;
  activityId: string;
  hostName: string;
  hostId:string;
  userId:string;
  pricePresent:boolean = false;
  @Output() newMessage: EventEmitter<number> = new EventEmitter<number>();

  constructor(private activityService: ActivityService,private router:Router,private route:ActivatedRoute,private messageService:MessageService) { }

  ngOnInit(): void {
    this.userId = sessionStorage.getItem('userId');

    if(sessionStorage.getItem('userId')?.length <= 4 || sessionStorage.getItem('userId')?.length === undefined){
      this.router.navigateByUrl('/login');
    }

    this.activityId = this.route.snapshot.paramMap.get('activityId');
    sessionStorage.setItem(sessionStorage.getItem('rv1').length > 0 ?
    sessionStorage.getItem('rv2').length > 0 ?

    sessionStorage.getItem('rv3').length > 0 ?
    sessionStorage.getItem('rv4').length > 0 ? sessionStorage.getItem('rv5').length > 0 ? 'rv1' : 'rv5'
    : 'rv5'
     : 'rv4'
    : 'rv2'
    : 'rv1','ahobyn' + this.activityId);
    let textFormat:TextFormat = new TextFormat();
    let pictureConverter:PictureConverter = new PictureConverter();

    this.activityService.retrieveSpecific(JSON.stringify({activityId: this.activityId}))
      .subscribe(activityObj => {
        this.initialOffer.title = activityObj?.title;
        this.initialOffer.askingPrice = activityObj?.price;
        this.initialOffer.details = activityObj?.details;
        this.initialOffer.date = activityObj?.date;
        this.initialOffer.breakDescription = activityObj?.breakDescription;
        this.activityId = activityObj?.id;
        this.hostId = activityObj?.hostId;

        if(this.initialOffer.askingPrice.length > 0){
          this.pricePresent = true;
        }

        this.activityService.retrieveSpecificImages(JSON.stringify({activityId: activityObj?.id}))
          .subscribe(images => {
            this.offer = {...this.initialOffer};

            let tempList:any[] = [];
            images.forEach(image => {
              let picStr = pictureConverter.dataTypeFormat(image?.imageData,image?.type);
              tempList.push(picStr);
            });

            this.offer = {...this.offer,image: tempList[0]};

            this.activityService.retrieveHostName(JSON.stringify({userId: activityObj?.hostId}))
              .subscribe(fullName => {
                this.hostName = textFormat.formatFullName(fullName);
              });
          });
      });
  }

  purchaseBreak(){
    if(sessionStorage.getItem('userId').length > 4){
      //make sure a team is selected
      if(this.teamNumber !== 0){

        sessionStorage.setItem('totalPrice',this.offer.askingPrice);
        sessionStorage.setItem('activityId',this.activityId);
        sessionStorage.setItem('reviewToken',this.activityId);
        sessionStorage.setItem('teamNumber',this.teamNumber.toString());
        sessionStorage.setItem('purchaseType','activity');

        this.router.navigateByUrl('/payment');
      }
    }else{
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
