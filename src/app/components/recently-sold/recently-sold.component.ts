import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OfferService } from 'src/app/services/offer.service';
import { Offer } from 'src/app/models/Offer';

@Component({
  selector: 'app-recently-sold',
  templateUrl: './recently-sold.component.html',
  styleUrls: ['./recently-sold.component.css']
})
export class RecentlySoldComponent implements OnInit {

  productList:Offer[] = [];

  constructor(private router:Router,private offerService:OfferService) { }

  ngOnInit(): void {
    this.offerService.getRecentlySold()
      .subscribe(tempList => {
        this.productList = tempList;
      });
  }

}
