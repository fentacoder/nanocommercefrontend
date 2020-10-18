import { Component, ElementRef, OnInit, ViewChild,OnDestroy,OnChanges, SimpleChanges,AfterViewInit, ChangeDetectorRef, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { StripeService } from 'src/app/services/stripe.service';

@Component({
  selector: 'app-stripe',
  templateUrl: './stripe.component.html',
  styleUrls: ['./stripe.component.css']
})
export class StripeComponent implements OnInit,OnDestroy,OnChanges,AfterViewInit {

  cardNumber:string;
  expMonth:string;
  expYear:string;
  cvv:string;
  stripe:any;
  addScript: boolean = false;
  expand:boolean = false;

  @ViewChild('cardInfo') cardInfo: ElementRef;
  card: any;
  cardHandler:any; //this.onChange.bind(this);
  cardError: string;

  bidPrice: string;
  processingFee: string;
  shippingFee: string;
  totalPrice: string;
  productId: string;

  @Input() stripeToken:string;
  @Input() stripeExpand:boolean;
  @Input() stripeResponse:boolean;
  @Output() payMethod:EventEmitter<any> = new EventEmitter<any>();

  constructor(private router:Router,private stripeService:StripeService,
    private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes:SimpleChanges){
    if(this.expand !== changes['stripeExpand'].currentValue){
      this.expand = changes['stripeExpand'].currentValue;
    }

    if(changes['stripeResponse'].previousValue !== changes['stripeResponse'].currentValue &&
      changes['stripeResponse'].currentValue){
        this.checkout();
      }
    //submit stripe payment if auth token is here
  }

  ngOnDestroy(){
    if (this.card) {
      // We remove event listener here to keep memory clean
      this.card.removeEventListener('change', this.cardHandler);
      this.card.destroy();
    }
  }

  ngAfterViewInit(){
    this.initiateCardElement();
  }

  onMethodClicked(){
    this.payMethod.emit({method:'stripe',
    htmlScript: `<form (ngSubmit)="stripeCheckout()" class="checkout">
    <label for="card-info">Card Info</label>
    <div id="form-field">
        <div id="card-info" #cardInfo></div>
        <button id="submit-button" type="submit">
            Pay ${this.totalPrice}
        </button>
        <div id="card-errors" role="alert" *ngIf="cardError">
            <span style="color: #f44336">cancel</span>
            &nbsp;{{ cardError }}
        </div>
    </div>
  </form>`});
    this.stripeService.getBidInfo(JSON.stringify({productId: this.productId,bidderId: sessionStorage.getItem('userId')}))
    .subscribe(bid => {
      this.bidPrice = bid.bidAmount;
      this.processingFee = bid.processingFee;
      this.shippingFee = bid.shippingFee;
      this.totalPrice = bid.totalPrice;
    });
  }

  initiateCardElement() {
    // Giving a base style here, but most of the style is in scss file
    const cardStyle = {
        base: {
            color: '#32325d',
            fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
            fontSmoothing: 'antialiased',
            fontSize: '16px',
            '::placeholder': {
                color: '#aab7c4'
            },
        },
        invalid: {
            color: '#fa755a',
            iconColor: '#fa755a'
        }
    };
    //this.card = elements.create('card', {cardStyle});
    //this.card.mount(this.cardInfo.nativeElement);
    this.cardInfo?.nativeElement.addEventListener('change', this.cardHandler);
  }

    // submitStripePayment(data){
  //   if(data.cardNumber.length > 0 && data.expMonth.length > 0 && data.expMonth.length <= 2 && data.expYear.length > 0
  //       && data.expYear.length <= 4 && data.cvv.length === 3){
  //         let tempExpMonth = this.formatNumbers(0,data.expMonth);
  //         let tempExpYear = this.formatNumbers(1,data.expYear);

  //         if(tempExpMonth === '' || tempExpYear === ''){
  //           this.router.navigateByUrl('/paymentfailed');
  //         }

  //         //send info to back end to get processed by stripe server

  //       }
  // }

  formatNumbers(choice:number,dataNumber:string):string{
    if(choice === 0){
      //format exp month
      if(dataNumber.substring(0,1) !== '0'){
        if(Number(dataNumber) <= 12 && Number(dataNumber) >= 1){
          return dataNumber;
        }else{
          return '';
        }
      }else{
        if(dataNumber.substring(1) !== '0'){
          return dataNumber;
        }else{
          return '';
        }
      }
    }else{
      //format exp year
      if(dataNumber.length === 2){
        return '20' + dataNumber;
      }else if(dataNumber.length === 4){
        return dataNumber;
      }else{
        return '';
      }
    }
  }


  //stripe code
  onChange({error}) {
    if (error) {
        this.cardError = error.message;
    } else {
        this.cardError = null;
    }
    this.cd.detectChanges();
  }
  async createStripeToken() {
      const {token, error} = await this.stripe.createToken(this.card);
      if (token) {
          this.onSuccess(token);
      } else {
          this.onError(error);
      }
  }
  onSuccess(token) {
      this.checkout();
  }
  onError(error) {
      if (error.message) {
          this.cardError = error.message;
      }
  }


  checkout() {
    //retrieve the stripe token back using the stripe service
    if(sessionStorage.getItem('purchaseType') !== 'activity'){

      this.stripeService.startPayment()
        .subscribe(token => {

          //grab the card details from the form to send to the back end for the user to pay



















          const stripePaymentObj = {
            userId: sessionStorage.getItem('userId'),
            productId: this.productId,
            stripeOrderId: token,
            bidAmount: this.bidPrice,
            processingFee: this.processingFee,
            shippingFee: this.shippingFee,
            totalPrice: this.totalPrice
          };

          this.stripeService.savePayment(JSON.stringify(stripePaymentObj))
            .subscribe(res => {
              sessionStorage.removeItem('reviewToken');
              sessionStorage.removeItem('paymentBidPrice');
              sessionStorage.removeItem('paymentProcessingFee');
              sessionStorage.removeItem('paymentShippingFee');
              sessionStorage.removeItem('paymentTotalPrice');
              sessionStorage.removeItem('sellerEmail');
              sessionStorage.removeItem('paymentPreferredPay');

              if(res === 'success'){
                this.router.navigateByUrl('/orderconfirmed');
              }else{
                this.router.navigateByUrl('/paymentfailed');
              }

            });

        });
    }else{
      this.stripeService.startPayment()
        .subscribe(token => {

          const stripePaymentObj = {
            userId: sessionStorage.getItem('userId'),
            activityId: sessionStorage.getItem('activityId'),
            totalPrice: sessionStorage.getItem('totalPrice')
          };

          this.stripeService.savePayment(JSON.stringify(stripePaymentObj))
            .subscribe(res => {
              sessionStorage.removeItem('reviewToken');
              sessionStorage.removeItem('paymentBidPrice');
              sessionStorage.removeItem('paymentProcessingFee');
              sessionStorage.removeItem('paymentShippingFee');
              sessionStorage.removeItem('paymentTotalPrice');
              sessionStorage.removeItem('sellerEmail');
              sessionStorage.removeItem('paymentPreferredPay');

              if(res === 'success'){
                this.router.navigateByUrl('/orderconfirmed');
              }else{
                this.router.navigateByUrl('/paymentfailed');
              }

            });

        });
    }
  }
}
