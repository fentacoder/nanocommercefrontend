import { Component, OnChanges, SimpleChanges,Input, AfterViewInit, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Post } from 'src/app/models/Post';
import { SocialAuthService } from 'angularx-social-login';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnChanges,OnInit,AfterViewInit {

  newMessagesNum: number = 0;
  @Input() newMessages:boolean;
  @Input() count:number;
  newMessage:boolean = false;
  searchText:string;
  addOpen:boolean = false;
  addSelection:string;
  loggedIn:boolean = false;
  settingsHover:boolean = false;
  linksActive:boolean = true;

  constructor(private router:Router,private socialAuthService:SocialAuthService,private elementRef:ElementRef) { }

  ngOnInit(){
    if(sessionStorage.getItem('userId')?.length > 4 && sessionStorage.getItem('userId')?.length !== undefined){
      this.loggedIn = true;
    }
  }

  ngAfterViewInit(){
    this.elementRef.nativeElement.querySelector('#profileBtn').addEventListener('mouseenter',this.onMouseEnter.bind(this));

    //this.elementRef.nativeElement.querySelector('#profileBtn').addEventListener('mouseleave',this.onMouseLeave.bind(this));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['newMessages'].currentValue !== this.newMessage && this.newMessages === false){
      this.newMessages = true;
      this.newMessages = false;
      this.newMessagesNum = changes['count'].currentValue;
    }
  }

  onMouseEnter(){
    this.settingsHover = true;
  }

  onMouseLeave(){
    this.settingsHover = false;
  }

  closeHover(){
    this.settingsHover = false;
  }

  toggleLinks(){
    this.linksActive = !this.linksActive;
  }

  onSearch(data){
    let text:string = data.searchText;
    text = text.trim().toLowerCase();
    if(text.length > 0){
      let tempList:Post[] = JSON.parse(sessionStorage.getItem('posts'));
      tempList = tempList.filter(post => post.postTitle?.toLowerCase().includes(text));
      sessionStorage.setItem('currentPostList',JSON.stringify(tempList));
      this.searchText = '';
      this.router.navigateByUrl('/posts/list/p');
    }
  }

  messageRedirect(){
    this.newMessage = false;
    this.router.navigateByUrl(`/messagelist/${sessionStorage.getItem('userId')}`);
  }

  toggleAdd(){
    this.addOpen = !this.addOpen;
  }

  addRedirect(){
    if(this.addSelection.length > 0){
      switch(this.addSelection){
        case 'post':
          this.router.navigateByUrl('/newpost');
          this.addOpen = false;
          break;
        case 'product':
          this.router.navigateByUrl('/offer');
          this.addOpen = false;
          break;
        case 'activity':
          this.router.navigateByUrl('/createactivity');
          this.addOpen = false;
          break;
        default:
          break;
      }
    }
  }

  signUserOut(){
    if(sessionStorage.getItem('facebookLogin') === 'true'){
      this.socialAuthService.signOut()
        .then(() => {
          sessionStorage.removeItem('userId');
          sessionStorage.removeItem('email');
          this.router.navigateByUrl('/login');
        })
        .catch(err => console.log('err'));
    }else{
      sessionStorage.removeItem('userId');
      sessionStorage.removeItem('email');
      this.router.navigateByUrl('/login');
    }
  }

  homeRedirect(){
    this.router.navigateByUrl('/converse');
  }
}
