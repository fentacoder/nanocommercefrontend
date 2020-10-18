import { Component, OnInit } from '@angular/core';
import { BidService } from 'src/app/services/bid.service';
import { TextFormat } from 'src/app/utils/TextFormat';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bid-request-sent',
  templateUrl: './bid-request-sent.component.html',
  styleUrls: ['./bid-request-sent.component.css']
})
export class BidRequestSentComponent implements OnInit {

  name:string;

  constructor(private bidService:BidService,private router:Router) { }

  ngOnInit(): void {
    if(sessionStorage.getItem('userId')?.length <= 4 || sessionStorage.getItem('userId')?.length === undefined){
      this.router.navigateByUrl('/login');
    }

    let textFormat:TextFormat = new TextFormat();
    this.bidService.retrieveHostName(JSON.stringify({userId: sessionStorage.getItem('userId')}))
      .subscribe(fullName => {
        this.name = textFormat.formatFullName(fullName);
      });
  }

}
