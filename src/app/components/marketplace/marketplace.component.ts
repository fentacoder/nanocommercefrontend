import { Component, OnInit, Output,EventEmitter } from '@angular/core';
import { MarketService } from 'src/app/services/market.service';
import { PictureConverter } from 'src/app/utils/PictureConverter';
import { MessageService } from 'src/app/services/message.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-marketplace',
  templateUrl: './marketplace.component.html',
  styleUrls: ['./marketplace.component.css']
})
export class MarketplaceComponent implements OnInit {


  combinedList: any[] = [];

  //these three lists are made using the combined list and sorting based off of type
  popularList: any[] = [];
  availableList: any[] = [];
  recentList: any[] = [];
  loading:boolean = false;
  @Output() newMessage: EventEmitter<number> = new EventEmitter<number>();

  constructor(private marketService:MarketService,private messageService:MessageService,private router:Router) { }

  ngOnInit(): void {
    this.loading = true;
    let pictureConverter:PictureConverter = new PictureConverter();
    //retrieve all of the products
    const boundObj = {
      minBound: 1,
      maxBound: 25,
      lastPage: 'false'
    };
    this.marketService.grabProducts(JSON.stringify(boundObj))
      .subscribe(products => {
        let tempList:any[] = products;

        //get the bid number for each product
        tempList?.forEach((item,idx) => {
          this.marketService.grabBidNum(JSON.stringify({productId: item.id}))
            .subscribe(bidNumber => {
              this.marketService.grabImage(JSON.stringify({productId: item.id}))
                .subscribe(image => {
                  let finalImage = pictureConverter.dataTypeFormat(image?.imageData,image?.type);

                  this.combinedList.push({
                    ...item,
                    bidNum: bidNumber,
                    image: image?.imageData !== null && image?.imageData !== undefined ? finalImage : '../../../assets/default_bg.png'
                  });

                  if(idx === tempList.length - 1){

                    //sort the products into the respective lists
                    this.popularList = this.combinedList.sort((a,b) => (a.bidNum > b.bidNum) ? 1 : -1);
                    this.popularList = this.popularList.slice(0,3);

                    this.recentList = this.combinedList.slice(0,3);
                    this.availableList = this.combinedList.reverse();
                    this.availableList = this.availableList.slice(0,3);
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

  productRedirect(e){
    let tempId:string = e.path[1].id;

    this.router.navigateByUrl(`/products/${tempId.split('>')[1]}`)
  }

  listAllRedirect(e){
    let tempId:string = e.path[0].id;
    this.router.navigateByUrl(`/market/list/${tempId}`);
  }
}
