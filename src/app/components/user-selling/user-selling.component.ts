import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth-service.service';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-user-selling',
  templateUrl: './user-selling.component.html',
  styleUrls: ['./user-selling.component.css']
})
export class UserSellingComponent implements OnInit {

  itemList: any[] = [];
  @Output() newMessage: EventEmitter<number> = new EventEmitter<number>();

  constructor(private userService:AuthService,private router:Router,
    private messageService:MessageService) { }

  ngOnInit(): void {
    if(sessionStorage.getItem('userId')?.length <= 4 || sessionStorage.getItem('userId')?.length === undefined){
      this.router.navigateByUrl('/login');
    }

    this.userService.grabUserProducts(JSON.stringify({userId: sessionStorage.getItem('userId')}))
      .subscribe(products => {
        products.forEach((product,idx) => {
          this.itemList.push({
            id: product?.id,
            title: `You offered product ${product?.id}`,
            displayId: idx,
            timeStamp: product?.createdAt
          });
        });
      });
  }

  updateMessages(){
    this.messageService.getNewMessageCount(JSON.stringify({id: sessionStorage.getItem('userId')}))
      .subscribe(count => {
        if(count !== -1){
          this.newMessage.emit(count);
        }
      });
  }

}
