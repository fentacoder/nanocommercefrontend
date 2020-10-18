import { Component, OnInit } from '@angular/core';
import { Offer } from 'src/app/models/Offer';
import { Router } from '@angular/router';

@Component({
  selector: 'app-purchase-review',
  templateUrl: './purchase-review.component.html',
  styleUrls: ['./purchase-review.component.css']
})
export class PurchaseReviewComponent implements OnInit {

  initialOffer: Offer = new Offer();
  offer:any = {};
  image:string;
  bidPrice: string;
  processingFee: string;
  shippingFee: string;
  totalPrice: string;
  bidMessage: string;
  postId: number;

  constructor(private router:Router) { }

  ngOnInit(): void {
    if(sessionStorage.getItem('userId')?.length <= 4 || sessionStorage.getItem('userId')?.length === undefined){
      this.router.navigateByUrl('/login');
    }

    //check local storage purchase review token
    if(sessionStorage.getItem('reviewToken')?.length <= 4 || sessionStorage.getItem('reviewToken')?.length === undefined){
      this.router.navigateByUrl('/login');
    }

    //grab fee information and bid price from sessionStorage
    this.bidPrice = sessionStorage.getItem('bid');
    this.processingFee = sessionStorage.getItem('processingFee');
    this.shippingFee = sessionStorage.getItem('shippingFee');
    this.totalPrice = sessionStorage.getItem('totalPrice');
    this.initialOffer = JSON.parse(sessionStorage.getItem('product'));
    this.offer = {...this.initialOffer,image: sessionStorage.getItem('productImage')};
    sessionStorage.setItem('productId',this.offer.id);
    sessionStorage.setItem('ownerId',this.offer.ownerId);
  }

  confirmPurchase(){
    sessionStorage.setItem('fromSite','true');
    sessionStorage.removeItem('paymentBidPrice');
    sessionStorage.removeItem('paymentProcessingFee');
    sessionStorage.removeItem('paymentShippingFee');
    sessionStorage.removeItem('paymentTotalPrice');
    sessionStorage.removeItem('sellerEmail');
    sessionStorage.removeItem('paymentPreferredPay');
    this.router.navigateByUrl('/payment');
  }

  cancelBid(){
    this.router.navigateByUrl(`/product/${this.offer.id}`);
  }
}
