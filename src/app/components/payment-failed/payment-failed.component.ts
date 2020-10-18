import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PaypalService } from 'src/app/services/paypal.service';

@Component({
  selector: 'app-payment-failed',
  templateUrl: './payment-failed.component.html',
  styleUrls: ['./payment-failed.component.css']
})
export class PaymentFailedComponent implements OnInit {

  constructor(private router:Router,private paypalService:PaypalService) { }

  ngOnInit(): void {
    if(sessionStorage.getItem('userId')?.length <= 4 || sessionStorage.getItem('userId')?.length === undefined){
      this.router.navigateByUrl('/login');
    }

    this.paypalService.deleteBidProcess(JSON.stringify({bidderId:sessionStorage.getItem('userId'),productId: sessionStorage.getItem('productId')}))
      .subscribe(res => {
        console.log('success');

      });
  }

}
