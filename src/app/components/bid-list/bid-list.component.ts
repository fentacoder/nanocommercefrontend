import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth-service.service';

@Component({
  selector: 'app-bid-list',
  templateUrl: './bid-list.component.html',
  styleUrls: ['./bid-list.component.css']
})
export class BidListComponent implements OnInit {

  itemList: any[] = [];

  constructor(private userService:AuthService,private router:Router) { }

  ngOnInit(): void {
    if(sessionStorage.getItem('userId')?.length <= 4 || sessionStorage.getItem('userId')?.length === undefined){
      this.router.navigateByUrl('/login');
    }

    this.userService.grabUserBids(JSON.stringify({userId: sessionStorage.getItem('userId')}))
      .subscribe(bids => {
        bids.forEach((bid,idx) => {
          return{
            id: bid?.id,
            title: `You placed a bid on ${bid?.productId}`,
            displayId: idx,
            timeStamp: bid?.createdAt,
            productId: bid?.productId
          };
        });
      });
  }

}
