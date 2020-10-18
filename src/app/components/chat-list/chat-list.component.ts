import { Component, OnInit } from '@angular/core';
import { Message } from 'src/app/models/Message';
import { Router } from '@angular/router';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.css']
})
export class ChatListComponent implements OnInit {

  chats: Message[] = [];

  constructor(private router:Router,private chatService:ChatService) { }

  ngOnInit(): void {
    if(sessionStorage.getItem('userId')?.length <= 4 || sessionStorage.getItem('userId')?.length === undefined){
      this.router.navigateByUrl('/login');
    }

    this.chatService.loadChats(JSON.stringify({receiverId: sessionStorage.getItem('userId'),type:'chat'}))
      .subscribe(chatList => {
        this.chats = chatList.map((chat,idx) => {
          let tempChat = new Message();
          tempChat.senderName = chat.senderName;
          tempChat.id = idx.toString();
          tempChat.senderId = chat.senderId;
          return tempChat;
        });
      });
  }

  chatRedirect(e){
    this.router.navigateByUrl(`/chat/${this.chats[Number(e.target.id)].senderId}`);
  }

}
