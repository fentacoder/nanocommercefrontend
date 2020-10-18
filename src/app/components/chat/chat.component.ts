import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Message } from 'src/app/models/Message';
import { ChatService } from 'src/app/services/chat.service';
import { Router, ActivatedRoute } from '@angular/router';
import { PictureConverter } from 'src/app/utils/PictureConverter';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  displayList:any[] = [];
  receiverId:string;
  messageContent:string = '';
  fileContent:File = null;
  imageInput:boolean = false;
  loading:boolean = false;
  @ViewChild("chatList") chatDiv: ElementRef;

  constructor(private chatService:ChatService,private router:Router,
      private route:ActivatedRoute) { }

  ngOnInit(): void {
    if(sessionStorage.getItem('userId')?.length <= 4 || sessionStorage.getItem('userId')?.length === undefined){
      this.router.navigateByUrl('/login');
    }

    this.receiverId = this.route.snapshot.paramMap.get('receiverId');
    let pictureConverter:PictureConverter = new PictureConverter();

    this.loading = true;
    //does not matter who is the sender or receive it will retrieve messages for both on the back end
    this.chatService.loadMessages(JSON.stringify({senderId: sessionStorage.getItem('userId'),receiverId: this.receiverId}))
      .subscribe(messageList => {
        messageList.forEach((message,idx) => {
          let tempObj = {};

          //determines whether the message is text or an image
          if(message.message.length > 0){
            tempObj = {message: message.message,image: '',imageType: ''};
          }else{
            let picStr:string = pictureConverter.dataTypeFormat(message?.image,message?.imageType)
            tempObj = {message: '',image: picStr,imageType: message.imageType};
          }

          //ui id
          tempObj = {...tempObj,displayId:idx};

          //name
          tempObj = {...tempObj,name:message.senderName};


          tempObj = this.styleMessage(message.senderId,tempObj);

          //timestamp
          tempObj = {...tempObj,timeStamp: message.sentAt};

          //senderId
          tempObj = {...tempObj,senderId:message.senderId};

          //receiver id
          tempObj = {...tempObj,receiverId:message.receiverId};

          //read yet
          tempObj = {...tempObj,readYet:message.readYet};

          this.displayList.push(tempObj);

          if(idx === messageList.length - 1){
            this.chatDiv.nativeElement.scrollTop = this.chatDiv.nativeElement.scrollHeight;
            this.loading = false;
          }
        });
      });
  }

  styleMessage(senderId,tempObj = {}){
    //message styling
    if(senderId !== sessionStorage.getItem('userId')){
      //the message was send from the other person
      return{
        ...tempObj,
        messageContainerStyle: {
          'width':'100vw',
          'display':'flex',
          'padding':'5px',
          'justify-content':'end'
        },
        messageStyle: {
          'background':'blue',
          'width':'auto',
          'padding':'5px',
          'color':'white',
          'border':'none',
          'border-radius':'10px',
          'margin-bottom':'3px',
          'margin-left':'auto',
          'margin-right':'11vw'
        }
      };
    }else{
      //the message was sent from the current user
      return{
        ...tempObj,
        messageContainerStyle: {
          'width':'100vw',
          'display':'flex',
          'padding':'5px',
          'justify-content':'start'
        },
        messageStyle: {
          'background':'rgb(64,255,0)',
          'width':'auto',
          'padding':'5px',
          'color':'white',
          'border':'none',
          'border-radius':'10px',
          'margin-bottom':'3px'
        }
      };
    }
  }

  openImageInput(){
    this.imageInput = !this.imageInput;
  }

  onImageChange(e) {
    this.fileContent = <File>e.target.files[0];
  }

  sendMessage(data){
    this.loading = true;
    const baseObj = {
      senderId: sessionStorage.getItem('userId'),
      receiverId: this.receiverId,
      senderName: sessionStorage.getItem('firstName') + ' ' + sessionStorage.getItem('lastName').substring(0,1).toUpperCase() + '.',
      type: 'chat'
    };

    if(this.messageContent.length === 0){
      //user is sending an image
      let pictureConverter:PictureConverter = new PictureConverter();

      const productImagesObj = {
        ...baseObj,
        image: this.fileContent !== null ? this.fileContent : null,
        imageType: this.fileContent.type
      };

      this.chatService.sendImage(productImagesObj)
        .subscribe(message => {
          let formattedPic = pictureConverter.dataTypeFormat(message?.image,message?.imageType);
          let messageStyles = this.styleMessage(sessionStorage.getItem('userId'),{});
          this.displayList.push({
            message: '',
            image: formattedPic,
            imageType: message?.imageType,
            displayId: this.displayList.length,
            name: baseObj.senderName,
            messageContainerStyle: messageStyles.messageContainerStyle,
            messageStyle: messageStyles.messageStyle,
            timeStamp: 'just now',
            readYet: 0,
            senderId: sessionStorage.getItem('userId'),
            receiverId: baseObj.receiverId
          });
          this.messageContent = '';
          this.fileContent = null;
          this.chatDiv.nativeElement.scrollTop = this.chatDiv.nativeElement.scrollHeight;
          this.imageInput = false;
          this.loading = false;
        });



    }else{
      //user is sending text
      const textObj = {
        ...baseObj,
        message: data.messageContent
      };

      this.chatService.sendText(textObj)
        .subscribe(resNum => {
          let messageStyles = this.styleMessage(sessionStorage.getItem('userId'),{});
            this.displayList.push({
              message: textObj.message,
              image: '',
              imageType: '',
              displayId: this.displayList.length,
              name: baseObj.senderName,
              messageContainerStyle: messageStyles.messageContainerStyle,
              messageStyle: messageStyles.messageStyle,
              timeStamp: 'just now',
              readYet: 0,
              senderId: sessionStorage.getItem('userId'),
              receiverId: baseObj.receiverId
            });
            this.messageContent = '';
            this.fileContent = null;
            this.chatDiv.nativeElement.scrollTop = this.chatDiv.nativeElement.scrollHeight;
            this.loading = false;
        });
    }
  }
}
