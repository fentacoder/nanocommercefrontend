import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BidService } from 'src/app/services/bid.service';
import { MessageService } from 'src/app/services/message.service';
import { OfferService } from 'src/app/services/offer.service';
import { PictureConverter } from 'src/app/utils/PictureConverter';
import { Offer } from 'src/app/models/Offer';

@Component({
  selector: 'app-bid',
  templateUrl: './bid.component.html',
  styleUrls: ['./bid.component.css']
})
export class BidComponent implements OnInit {
  product: Offer = new Offer();
  imageList:any[] = [];
  bidPrice: number;
  processingFee: number;
  processingFeeStr:string = '$0';
  totalPriceStr:string = '$0';
  shippingFee: number;
  totalPrice: number;
  bidMessage: string;
  productId: string;
  receiverId: string;

  constructor(private router:Router,private route:ActivatedRoute,private bidService:BidService,
      private messageService:MessageService,private offerService:OfferService) { }

  ngOnInit(): void {
    if(sessionStorage.getItem('userId')?.length <= 4 || sessionStorage.getItem('userId')?.length === undefined){
      this.router.navigateByUrl('/login');
    }

    this.productId = this.route.snapshot.paramMap.get('productId');
    let pictureConverter:PictureConverter = new PictureConverter();

    //retrieve the product
    this.offerService.retrieveProduct(JSON.stringify({productId: this.productId}))
    .subscribe(res => {

      this.product.id = res.id;
      this.product.ownerId = res.ownerId;
      this.product.title = res.title;
      this.product.price = res.price;
      this.product.details = res.details;
      this.product.isSold = res.isSold;
      this.product.shippingFee = res.shippingFee;
      this.product.createdAt = res.createdAt;

      this.shippingFee = Number(this.product.shippingFee.substring(1).replace(',',''));

      if(this.product.price.substring(this.product.price.length - 1) === ','){
        this.product.price = this.product.price.substring(0,this.product.price.length - 1);
      }

      //should be retrieving the ownerId related to the product

      this.receiverId = res.ownerId;

      if(this.receiverId === null){
        this.router.navigateByUrl('/market');
      }

      //retrieve the product images
      this.offerService.retrieveProductImages(JSON.stringify({productId: this.productId}))
        .subscribe(images => {
          let tempList:any[] = [];
          images.forEach((image,idx) => {
            let picStr = pictureConverter.dataTypeFormat(image?.imageData,image?.type);
            tempList.push(picStr);

            if(idx === images.length - 1){
              this.imageList = tempList;
              sessionStorage.setItem('product',JSON.stringify(this.product));
              sessionStorage.setItem('productImage',tempList[0]);
            }
          });

          this.offerService.grabHighlights(JSON.stringify({productId: this.productId}))
            .subscribe(highlights => {
              let tempList:string[] = [];
              highlights.forEach((highlight,idx) => {
                tempList.push(highlight?.message);

                if(idx === highlights.length - 1){
                  this.product.highlights = tempList;
                }
              });
            });
        });
    });
  }

  sendBid(){
    if(this.totalPriceStr !== '$0'){
      //compute fees and total
      if(this.bidPrice <= 750){
        this.processingFee = (0.06 * this.bidPrice) + 1;

      }else{
        this.processingFee = (0.05 * this.bidPrice) + 1;

      }
      this.processingFeeStr = '$' + this.processingFee.toString();
      this.totalPrice = this.processingFee + this.shippingFee + this.bidPrice;



      //put fee info and bid price in sessionStorage
      sessionStorage.setItem('bid',this.bidPrice.toFixed(2));
      sessionStorage.setItem('processingFee',this.processingFee.toFixed(2));
      sessionStorage.setItem('shippingFee',this.shippingFee.toFixed(2));
      sessionStorage.setItem('totalPrice',this.totalPrice.toFixed(2));
      sessionStorage.setItem('product',JSON.stringify(this.product));
      sessionStorage.setItem('productImage',this.imageList[0]);


      const bidObj = {
        productId: this.productId,
        bidderId: sessionStorage.getItem('userId'),
        bidAmount: this.bidPrice.toFixed(2),
        processingFee: this.processingFee.toFixed(2),
        shippingFee: this.shippingFee.toFixed(2),
        totalPrice: this.totalPrice.toFixed(2),
        message: this.bidMessage.length > 0 ? this.bidMessage : ''
      };
      //upload the bid
      this.bidService.addBid(JSON.stringify(bidObj))
        .subscribe(res => {
          const messageObj = {
            senderId: sessionStorage.getItem('userId'),
            senderName: sessionStorage.getItem('firstName') + ' ' + sessionStorage.getItem('lastName'),
            receiverId: this.receiverId,
            message: `${sessionStorage.getItem('userId')} user placed a bid of ${this.bidPrice.toFixed(2)} on product ${this.product.title.length > 50 ? this.product.title.substring(0,47) + '...' : this.product.title} id&#&- ${this.product.id}.`,
            readYet: 0,
            type: 'accept'
          };

          this.messageService.bidAlert(JSON.stringify(messageObj))
            .subscribe(resNum => {

              console.log('success');

              //redirect to purchase review screen
              sessionStorage.setItem('reviewToken',this.productId);
              this.router.navigateByUrl(`/purchasereview/${this.productId}`);
            });
        });
    }
  }

  cancelBid(){
    this.router.navigateByUrl(`product/${this.productId}`);
  }

  calculateFees(){
    if(this.bidPrice !== null){
      //compute fees and total
      if(this.bidPrice <= 750){
        this.processingFee = (0.06 * this.bidPrice) + 1;

      }else{
        this.processingFee = (0.05 * this.bidPrice);

      }
      this.processingFeeStr = '$' + this.processingFee.toFixed(2);
      this.totalPrice = this.processingFee + this.shippingFee + this.bidPrice;
      this.totalPriceStr = '$' + this.totalPrice.toFixed(2);

    }else{
      this.processingFee = 0;
      this.processingFeeStr = '$0';
      this.totalPriceStr = '$' + this.shippingFee.toFixed();
    }

  }
}
