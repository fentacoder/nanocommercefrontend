import { Component, Input, OnInit,OnChanges, SimpleChanges, Output, EventEmitter, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Address } from 'src/app/models/Address';
import { ActivityService } from 'src/app/services/activity.service';
import { PaypalService } from 'src/app/services/paypal.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-paypal',
  templateUrl: './paypal.component.html',
  styleUrls: ['./paypal.component.css']
})
export class PaypalComponent implements OnInit,OnChanges {

  @Input() paypalToken:string;
  @Output() payMethod:EventEmitter<any> = new EventEmitter<any>();

  bidPrice: string;
  processingFee: string;
  shippingFee: string;
  totalPrice: string;
  productId: string;
  payeeEmail: string;
  ownerId:string;
  preferredPay:string = 'paypal';
  address:Address = new Address();
  connectedPaypalCodeObj:any = {};
  connected:boolean = true;

  constructor(private router:Router,private paypalService:PaypalService,private activityService:ActivityService,
    private zone:NgZone) {
      this.totalPrice = sessionStorage.getItem('totalPrice');
    }

  ngOnInit(): void {
    // this.connectedPaypalCodeObj = JSON.parse(this.route.snapshot.paramMap.get('code'));

    // if(this.connectedPaypalCodeObj?.length > 0){
    //   console.log('connectedPaypalCodeObj: ',this.connectedPaypalCodeObj);
    //   this.connected = true;
    //   sessionStorage.setItem('connectedWithPaypal','true');

    // }

    this.productId = sessionStorage.getItem('productId');
    this.ownerId = sessionStorage.getItem('ownerId');

    this.payeeEmail = sessionStorage.getItem('payeeEmail');

    this.paypalService.getBidInfo(JSON.stringify({productId: this.productId,bidderId: sessionStorage.getItem('userId')}))
      .subscribe(bid => {
        this.bidPrice = bid.bidAmount;
        this.processingFee = bid.processingFee;
        this.shippingFee = bid.shippingFee;
        this.totalPrice = bid.totalPrice;

        sessionStorage.setItem('paymentBidPrice',this.bidPrice);
        sessionStorage.setItem('paymentProcessingFee',this.processingFee);
        sessionStorage.setItem('paymentShippingFee',this.shippingFee);
        sessionStorage.setItem('paymentTotalPrice',this.totalPrice);

        this.paypalService.getSellerEmail(JSON.stringify({ownerId: this.ownerId}))
          .subscribe(res => {
            this.payeeEmail = res?.email;

            if(this.payeeEmail === null || this.payeeEmail?.length === 0){
              sessionStorage.removeItem('reviewToken');
              this.router.navigateByUrl('/paymentfailed');
            }
            sessionStorage.setItem('sellerEmail',this.payeeEmail);

            if(sessionStorage.getItem('purchaseType') === 'break'){
              this.preferredPay = 'paypal';
            }else{
              console.log('productId: ',this.productId);

              this.paypalService.getPreferredPay(JSON.stringify({productId: this.productId}))
              .subscribe(res => {
                this.preferredPay = res?.pPay !== '' ? res?.pPay : 'paypal';
                sessionStorage.setItem('paymentPreferredPay',this.preferredPay);
                this.paypalService.getPayerAddress(JSON.stringify({id: sessionStorage.getItem('userId')}))
                  .subscribe(address => {
                    this.address = address;
                    if(this.address?.street?.length === 0){
                      sessionStorage.removeItem('reviewToken');
                      this.router.navigateByUrl('/user/shippingaddress');
                    }
                  });
              });
            }

          });
      });
  }

  ngOnChanges(changes:SimpleChanges){
    if(changes['paypalToken'].previousValue !== changes['paypalToken'].currentValue && changes['paypalToken'].currentValue.length > 0){
      this.zone.run(() => {
        this.submitPaypalPayment(changes['paypalToken'].currentValue);
      });
    }

  }

  onMethodClicked(){
    this.payMethod.emit({method:'paypal'});

    this.createPaypalPayment();
  }

  createPaypalPayment(){
    const dataObj = {
      total: sessionStorage.getItem('paymentTotalPrice'),
      currency: sessionStorage.getItem('preferredCurrency'),
      method: 'paypal',
      intent: 'purchase',
      description: 'offer bid and/or competition access',
      cancelUrl: `${environment.ORIGIN}/market`,
      successUrl: `${environment.ORIGIN}/payment`
    };

    this.paypalService.createPayment(JSON.stringify(dataObj))
      .subscribe(res => {
        this.router.navigateByUrl(res?.url !== null ? res?.url : '/market');
      });
  }

  submitPaypalPayment(token){
    let paypalPaymentObj = {};
    if(sessionStorage.getItem('purchaseType') === 'activity'){
      paypalPaymentObj = {
        userId: sessionStorage.getItem('userId'),
        itemId: sessionStorage.getItem('activityId'),
        type: 'a',
        totalPrice: sessionStorage.getItem('totalPrice'),
        paypalOrderId: token,
        processingFee: this.processingFee
      };
    }else{
      paypalPaymentObj = {
        userId: sessionStorage.getItem('userId'),
        itemId: this.productId,
        type: 'j',
        paypalOrderId: token,
        bidAmount: this.bidPrice,
        processingFee: this.processingFee,
        shippingFee: this.shippingFee,
        totalPrice: this.totalPrice
      };
    }


    const dataObj = {
      paymentId: token,
      payerId: sessionStorage.getItem('email')
    }

    this.paypalService.executePayment(JSON.stringify(dataObj))
      .subscribe(res => {
        if(res.status === 'success'){
          this.paypalService.saveTransaction(JSON.stringify(paypalPaymentObj))
            .subscribe(res => {
              sessionStorage.removeItem('reviewToken');
              sessionStorage.removeItem('paymentBidPrice');
              sessionStorage.removeItem('paymentProcessingFee');
              sessionStorage.removeItem('paymentTotalPrice');
              sessionStorage.removeItem('sellerEmail');
              sessionStorage.removeItem('paymentPreferredPay');
              if(res?.productId?.length > 0 || res?.activityId?.length > 0){
                if(sessionStorage.getItem('purchaseType') === 'activity'){
                  const activityObj = {
                    activityId: sessionStorage.getItem('activityId'),
                    memberId: sessionStorage.getItem('userId'),
                    teamNumber: sessionStorage.getItem('teamNumber')
                  };

                  this.activityService.addMember(JSON.stringify(activityObj))
                    .subscribe(resNum => {
                      if(resNum === 1){
                        sessionStorage.removeItem('activityId');
                        sessionStorage.removeItem('teamNumber');
                        this.router.navigateByUrl('/orderconfirmed');
                      }else{
                        this.router.navigateByUrl('/paymentfailed');
                      }
                    });
                }else{
                  this.router.navigateByUrl('/orderconfirmed');
                }
              }else{
                this.router.navigateByUrl('/paymentfailed');
              }
            });
        }
      });
  }
}
