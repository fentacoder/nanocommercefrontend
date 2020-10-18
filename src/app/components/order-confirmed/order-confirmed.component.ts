import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-confirmed',
  templateUrl: './order-confirmed.component.html',
  styleUrls: ['./order-confirmed.component.css']
})
export class OrderConfirmedComponent implements OnInit {

  //grab email from sessionStorage
  email: string = sessionStorage.getItem('email');

  constructor(private router:Router) { }

  ngOnInit(): void {
    if(sessionStorage.getItem('userId')?.length <= 4 || sessionStorage.getItem('userId')?.length === undefined){
      this.router.navigateByUrl('/login');
    }

    setTimeout(() => {
      this.router.navigateByUrl('/market');
    },5000);
  }
}
