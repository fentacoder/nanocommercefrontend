import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivityService } from 'src/app/services/activity.service';

@Component({
  selector: 'app-create-activity',
  templateUrl: './create-activity.component.html',
  styleUrls: ['./create-activity.component.css']
})
export class CreateActivityComponent implements OnInit {

  title:string;
  location:string;
  image:File = null;
  askingPrice:number;
  details:string;
  breakDescription:string;
  activityDate:string;
  activityTime:string;
  priceError:boolean = false;

  constructor(private router:Router,private activityService:ActivityService) { }

  ngOnInit(): void {
    if(sessionStorage.getItem('userId')?.length <= 4 || sessionStorage.getItem('userId')?.length === undefined){
      this.router.navigateByUrl('/login');
    }
  }

  onImageChange(e) {
    this.image = <File>e.target.files[0];
  }

  submitActivity(data){
    let price = this.formatPrice(this.askingPrice);

    if(data.title.length > 0 && data.location.length > 0 && this.image !== null && data.details.length > 0
        && data.activityDate.length > 0 && data.activityTime.length > 0){
      //product object
      const productObj = {
        hostId: sessionStorage.getItem('userId'),
        title: data.title,
        location: data.location,
        price: price !== null && price !== '' ? price : '',
        details: data.details,
        breakDescription: data.breakDescription.length > 0 ? data.breakDescription : '',
        activityDate: data.activityDate,
        activityTime: data.activityTime
      };

      //product images
      const productImagesObj = {
        image: this.image !== null ? this.image : null,
        imageType: this.image !== null ? this.image.type.split('/')[1] : null
      };

      this.activityService.addActivity(JSON.stringify(productObj),productObj.hostId)
        .subscribe(activityId => {

        this.activityService.addActivityImages(productImagesObj,activityId)
          .subscribe(res => {
            console.log('success');

            //redirect back to game & breaks page
            this.router.navigateByUrl('/gamebreaks');
          });
        });

    }

  }

  formatPrice(price: number):string{
    if(price !== null){
      price = Math.abs(Math.floor(price));
      let priceStr:string = '';

      if(price < 1000){
        return '$' + price;
      }else if(price >= 1000 && price < 1000000){
        priceStr = price.toString();
        return '$' + priceStr.substring(0,4) + ',' + priceStr.substring(4);
      }else if(price >= 1000000 && price < 10000000){
        priceStr = price.toString();
        return '$' + priceStr.substring(0,1) + ',' + priceStr.substring(1,4) + ',' + priceStr.substring(4);
      }else if(price >= 10000000 && price < 100000000){
        priceStr = price.toString();
        return '$' + priceStr.substring(0,2) + ',' + priceStr.substring(2,5) + ',' + priceStr.substring(5);
      }else if(price >= 100000000 && price < 1000000000){
        priceStr = price.toString();
        return '$' + priceStr.substring(0,3) + ',' + priceStr.substring(3,6) + ',' + priceStr.substring(6);
      }else if(price >= 1000000000 && price < 1000000000000){
        priceStr = price.toString();
        return '$' + priceStr.substring(0,1) + ',' + priceStr.substring(1,4) + ',' + priceStr.substring(4,7) + ',' + priceStr.substring(7);
      }else{
        return '';
      }
    }else{
      return '';
    }

  }

  updatePrice(val){
    console.log('val: ',val);

    this.askingPrice = val;
    this.priceError = false;
    this.priceErrorMessage();

    if(this.askingPrice >= 1000000000000){
      this.priceError = true;
      this.priceErrorMessage();
    }
  }

  priceErrorMessage(){
    if(this.priceError === true){
      return {
        'border': 'red 1px solid'
      };
    }else{
      return{
        'border': 'none'
      };
    }

  }

}
