import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

  activePayMethod:string = '';
  somethingIsExpanded:boolean = false;
  paypalToken:string = '';
  stripeToken:string = '';
  stripeExpand:boolean = false;
  stripeFormScript:string = '';
  stripeResponse:boolean = false;

  constructor(private router:Router,
    private route:ActivatedRoute) {}

  ngOnInit(): void {
    if(sessionStorage.getItem('userId')?.length <= 4 || sessionStorage.getItem('userId')?.length === undefined){
      this.router.navigateByUrl('/login');
    }

    //check local storage purchase review token
    if(sessionStorage.getItem('reviewToken')?.length <= 4 || sessionStorage.getItem('reviewToken')?.length === undefined){
      this.router.navigateByUrl('/market');
    }

    switch(this.activePayMethod){
      case 'paypal':
        this.paypalToken = this.route.snapshot.paramMap.get('token');
        break;
      case 'stripe':
        this.stripeExpand = true;
        this.somethingIsExpanded = true;
        break;
      default:
        this.somethingIsExpanded = false;
        break;
    }

  }

  changeMethod(data){
    switch(data.method){
      case 'paypal':
        this.activePayMethod = 'paypal';
        break;
      case 'stripe':
        this.activePayMethod = 'stripe';
        this.stripeFormScript = data.htmlScript;
    }
  }

  stripeCheckout(){
    this.stripeResponse = true;
  }
}
