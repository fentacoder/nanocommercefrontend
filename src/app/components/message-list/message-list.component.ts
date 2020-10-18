import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'src/app/services/message.service';
import { Message } from 'src/app/models/Message';
import { PaypalService } from 'src/app/services/paypal.service';
import { Order } from 'src/app/models/Order';
import { Address } from 'src/app/models/Address';

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css']
})
export class MessageListComponent implements OnInit {

  messages:Message[] = [];
  complementaryBidderIdList:any[] = [];
  bearerToken:string;
  currentOrderId:string = '';
  //production
  clientId:string = '';
  clientSecret:string = '';
  //sandbox
  // clientId:string = '';
  // clientSecret:string = '';
  address:Address = new Address();
  loading:boolean = false;

  constructor(private router:Router,private messageService:MessageService,private paypalService:PaypalService) { }

  ngOnInit(): void {
    if(sessionStorage.getItem('userId')?.length <= 4 || sessionStorage.getItem('userId')?.length === undefined){
      this.router.navigateByUrl('/login');
    }

    this.messageService.loadMessages(JSON.stringify({receiverId: sessionStorage.getItem('userId')}))
      .subscribe(messageList => {
         messageList?.forEach((message,idx) => {
          let tempMessage = new Message();
          tempMessage.senderName = message.senderName;
          tempMessage.id = idx.toString();
          tempMessage.senderId = message.senderId;
          tempMessage.type = message.type;
          tempMessage.message = message.message;

          if(message.type === 'accept'){
            tempMessage.databaseProductId = message.message.split('id&#&-')[1].trim().substring(0,36);
            tempMessage.messageId = message.id;
            this.complementaryBidderIdList.push({id: message.senderId});
            tempMessage.displayMessage = message.message.split('id&#&- ')[0];
            tempMessage.displayMessage = message.senderName + tempMessage.displayMessage.substring(41);
          }else{
            tempMessage.messageId = message.id;
            this.complementaryBidderIdList.push({id: idx.toString()});
          }

          this.messages.push(tempMessage);
        });
      });
  }

  removeMessage(e){
    let originalId:string = e.path[0].id;
    let tempId:string = originalId.split('-')[1];
    const messageObj = {
      id: this.messages[Number(tempId)].messageId
    };
    if(this.messages[Number(tempId)].type === 'chat'){
      this.messageService.messagesRead(JSON.stringify(messageObj))
        .subscribe(resNum => {
          this.messages = this.messages.filter(message => message.id !== originalId);
        });
    }else{
      this.messageService.removeMessage(JSON.stringify(messageObj))
        .subscribe(resNum => {
          this.messages = this.messages.filter(message => message.id !== originalId);
        });
    }

  }

  chatRedirect(e){
    let tempId:string = e.path[1].id;
    tempId = tempId.split('-')[1];

    this.messageService.messagesRead(JSON.stringify({id:this.messages[Number(tempId)].messageId}))
      .subscribe(res => {

      });

    this.router.navigateByUrl(`/chat/${this.messages[Number(tempId)].senderId}`);
  }

  chatListRedirect(){
    this.router.navigateByUrl(`/chatlist/${sessionStorage.getItem('userId')}`);
  }

  acceptBid(e){
    let originalId:string = e.path[0].id;
    let tempId:string = originalId.split('-')[1];

    console.log('tempId: ',tempId);


    let currentOrder:Order = new Order();

    const messageObj = {
      message: {
        senderId: sessionStorage.getItem('userId'),
        senderName: sessionStorage.getItem('firstName') + sessionStorage.getItem('lastName').substring(0,1).toUpperCase() + '.',
        receiverId: this.messages[Number(tempId)].senderId,
        type: 'noreply',
        message: `${sessionStorage.getItem('firstName') + sessionStorage.getItem('lastName').substring(0,1).toUpperCase() + '.'} accepted your bid!`
      },
      productId: this.messages[Number(tempId)].databaseProductId

    };

    let tempProductId = this.messages[Number(tempId)].message.split('id&#&-')[1].trim();

    const queryObj = {
      userId: this.messages[Number(tempId)].message.substring(0,36),
      productId: tempProductId.replace('.','')
    };

    this.paypalService.grabOrderId(JSON.stringify(queryObj))
      .subscribe(orderObj => {
        currentOrder = orderObj;
        this.currentOrderId = orderObj?.id;

        if(orderObj?.id?.length === 0 || orderObj === null){
          this.router.navigateByUrl('/payouterror');
        }else{
          this.paypalService.getPayerAddress(JSON.stringify({id: sessionStorage.getItem('userId')}))
          .subscribe(address => {
            this.address = address;

            const payOutObj = {
              sender_batch_header: {
                sender_batch_id: sessionStorage.getItem('userId') + '-' + Date.now(),
                email_subject: 'You have received money from a bid!',
                email_message: 'The shipping details for the bidder are in this message, if they are not there then please contact Hobyn: ' + this.address?.street + ' - ' + this.address?.additionalInfo + ' ' + this.address?.city + ', ' + this.address?.state + ' ' + this.address?.zipCode + '.'
              },
              items: [
                {
                  recipient_type: 'EMAIL',
                  amount: {
                    value: (Number(currentOrder?.totalPrice.replace('$','')) - Number(currentOrder?.processingFee.replace('$',''))).toFixed(2),
                    currency: 'USD'
                  },
                  note: 'Thank you for using Hobyn!',
                  sender_item_id: sessionStorage.getItem('userId') + '-' + Date.now() + '-sender',
                  receiver: sessionStorage.getItem('email')
                }
              ]
            };

            this.paypalService.checkAvailability(JSON.stringify({id: currentOrder?.productId}))
              .subscribe(productRes => {
                if(Number(productRes?.isSold) !== 1){
                  this.paypalService.getToken(this.clientId,this.clientSecret)
                  .subscribe(res => {
                    this.bearerToken = res.access_token;

                    this.paypalService.makePayout(JSON.stringify(payOutObj),this.bearerToken)
                      .subscribe(res => {
                        let tempPayId:string = res?.batch_header?.payout_batch_id;

                        if(tempPayId?.length > 0){
                          this.paypalService.confirmTransaction(JSON.stringify({id: this.currentOrderId,confirmedId: tempPayId}))
                            .subscribe(res => {
                              this.messageService.acceptBid(JSON.stringify(messageObj))
                                .subscribe(response => {
                                  this.loading = true;

                                  this.messageService.removeMessage(JSON.stringify({id: this.messages[tempId].messageId}))
                                    .subscribe(messageRes => {
                                      let formattedList: any[] = [];
                                      this.messages = this.messages.filter(message => message.id !== tempId);

                                      /*each object in the response object is an array
                                      0 index: bidder email
                                      1 index: bid amount
                                      2 index: shipping fee
                                      */

                                      if(response?.length !== undefined){
                                        for(let i = 0; i < response?.length; i++){
                                          if(response?.length === undefined || response?.length === null){
                                            console.log('REFUND ERROR');
                                            break;
                                          }

                                          let tempList:string[] = response[i.toString()];
                                          formattedList.push({
                                            recipient_type: 'EMAIL',
                                            amount: {
                                              value: (Number(tempList[1].replace('$','')) + Number(tempList[2].replace('$',''))).toFixed(2),
                                              currency: 'USD'
                                            },
                                            note: 'The seller accepted a bid from someone else, your money is being refunded now.',
                                            sender_item_id: sessionStorage.getItem('userId') + '-' + Date.now() + '-sender-' + i.toString(),
                                            receiver: tempList[0]
                                          });
                                        }

                                        let refundObj = {
                                          sender_batch_header: {
                                            sender_batch_id: sessionStorage.getItem('userId') + '-' + Date.now(),
                                            email_subject: 'Hobyn Bid Refund',
                                            email_message: 'The seller accepted a bid from someone else, your money is being refunded now.'
                                          },
                                          items: [...formattedList]
                                        };

                                        this.paypalService.makePayout(JSON.stringify(refundObj),this.bearerToken)
                                          .subscribe(refundRes => {
                                            let refundId:string = refundRes?.batch_header?.payout_batch_id;

                                            if(refundId?.length > 0){
                                              this.messageService.changeProductAvailability(JSON.stringify({productId: currentOrder.productId}))
                                                .subscribe(res => {
                                                  this.loading = false;
                                                });
                                            }else{
                                              //payout error
                                              this.router.navigateByUrl('/payouterror');
                                            }
                                          });
                                      }else{
                                        this.messageService.changeProductAvailability(JSON.stringify({productId: currentOrder.productId}))
                                          .subscribe(res => {
                                            this.loading = false;
                                            console.log('success');
                                          });
                                      }
                                    });
                                });
                          });
                        }else{
                          //payout error
                          this.router.navigateByUrl('/payouterror');
                        }
                      });
                  });
                }else{
                  this.messages = this.messages.filter(message => message.id !== tempId);
                  this.messageService.removeMessage(JSON.stringify({id: this.messages[tempId].messageId}))
                    .subscribe(messageRes => {
                    });
                }
              });
          });
        }
      });
  }

  declineBid(e){
    let originalId:string = e.target.id;
    let tempId:string = originalId.split('-')[1];

    const messageObj = {
      message: {
        senderId: sessionStorage.getItem('userId'),
        senderName: sessionStorage.getItem('firstName') + sessionStorage.getItem('lastName').substring(0,1).toUpperCase() + '.',
        receiverId: this.messages[Number(tempId)].senderId,
        type: 'noreply',
        message: `${sessionStorage.getItem('firstName') + sessionStorage.getItem('lastName').substring(0,1).toUpperCase() + '.'} declined your bid.`
      },
      bidderId: this.complementaryBidderIdList[Number(tempId)].id,
      productId: this.messages[Number(tempId)].databaseProductId
    };

    this.messageService.declineBid(JSON.stringify(messageObj))
      .subscribe(resNum => {
        let bidderId = this.complementaryBidderIdList[Number(tempId)].id;
        this.messages = this.messages.filter(message => message.id !== originalId);
        this.complementaryBidderIdList = this.complementaryBidderIdList.filter(idObj => idObj.id !== bidderId);
      });
  }

  confirmOffer(e){
    let originalId:string = e.target.id;
    let tempId:string = originalId.split('-')[1];

    this.messageService.messagesRead(JSON.stringify({id: this.messages[Number(tempId)].messageId}))
      .subscribe(resNum => {
        sessionStorage.setItem('reviewToken',this.messages[Number(tempId)].messageId);
        sessionStorage.setItem('productId',this.messages[Number(tempId)].databaseProductId);
        sessionStorage.setItem('ownerId',this.messages[Number(tempId)].senderId);
        this.router.navigateByUrl('payment');
      });
  }

  cancelOffer(e){
    let originalId:string = e.target.id;
    let tempId:string = originalId.split('-')[1];

    const messageObj = {
      message: {
        senderId: sessionStorage.getItem('userId'),
        senderName: sessionStorage.getItem('firstName') + sessionStorage.getItem('lastName').substring(0,1).toUpperCase() + '.',
        receiverId: this.messages[Number(tempId)].senderId,
        type: 'noreply',
        message: `${sessionStorage.getItem('firstName') + sessionStorage.getItem('lastName').substring(0,1).toUpperCase() + '.'} declined your bid.`
      },
      bidderId: this.complementaryBidderIdList[Number(tempId)].id,
      productId: this.messages[Number(tempId)].databaseProductId
    };

    this.messageService.cancelBid(JSON.stringify(messageObj))
      .subscribe(resNum => {
        let bidderId = this.complementaryBidderIdList[Number(tempId)].id;
        this.messages = this.messages.filter(message => message.id !== originalId);
        this.complementaryBidderIdList = this.complementaryBidderIdList.filter(idObj => idObj.id !== bidderId);
      });
  }

}
