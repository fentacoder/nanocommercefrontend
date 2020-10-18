import { Component, OnInit, Output,EventEmitter } from '@angular/core';
import { Post } from 'src/app/models/Post';
import { Router } from '@angular/router';
import { PostService } from 'src/app/services/post.service';
import { PictureConverter } from 'src/app/utils/PictureConverter';
import { CommentService } from 'src/app/services/comment.service';
import { TextFormat } from 'src/app/utils/TextFormat';
import { MessageService } from 'src/app/services/message.service';
import {environment} from '../../../environments/environment'

@Component({
  selector: 'app-converse',
  templateUrl: './converse.component.html',
  styleUrls: ['./converse.component.css']
})
export class ConverseComponent implements OnInit {

  posts: Post[] = [];
  indexedPosts: Post[] = [];
  showFilter:boolean = false;
  filterVal:string = 'recent';
  cookiesClicked:boolean = false;
  loading:boolean = false;
  postCount:number;
  @Output() newMessage: EventEmitter<number> = new EventEmitter<number>();

  constructor(private router:Router,private postService:PostService,
      private commentService:CommentService,private messageService:MessageService) { }

  ngOnInit(): void {
    //remove this in production
    // sessionStorage.setItem('userId','571f929b-bd8b-4fa2-9354-c8d60692ca59');
    // sessionStorage.setItem('firstName','Jamar');
    // sessionStorage.setItem('email','jamar.phillip99@gmail.com');
    // sessionStorage.setItem('lastName','Phillip');

    // sessionStorage.setItem('userId','11111111-1111-1111-1111-111111111111');
    // sessionStorage.setItem('firstName','tom');
    // sessionStorage.setItem('email','laygojaygo44@gmail.com');
    // sessionStorage.setItem('lastName','smith');

    // sessionStorage.setItem('userId','12111111-1111-1111-1111-111111111111');
    // sessionStorage.setItem('firstName','jane');
    // sessionStorage.setItem('email','jexecution.com');
    // sessionStorage.setItem('lastName','doe');

    if(sessionStorage.getItem('userId')?.length <= 4 || sessionStorage.getItem('userId')?.length === undefined){
      this.router.navigateByUrl('/login');
    }

    if(localStorage.getItem('cookiesClicked') === 'true'){
      this.cookiesClicked = true;
    }

    this.updateMessages();

    this.loading = true;

    const boundObj = {
      minBound: 1,
      maxBound: 25,
      lastPage: 'false'
    };

    this.postService.getCount()
      .subscribe(countRes => {
        this.postCount = countRes?.count;
        this.postService.loadAllPosts(JSON.stringify(boundObj))
          .subscribe(res => {
            this.formatPost(res);
          });
      });

  }

  formatPost(res:any[] = []){
    let pictureConverter = new PictureConverter();
    let textFormat = new TextFormat();
    //map response object to ExchangePost class
    res.forEach((tempPost,idx) => {
      let postMap = new Post();
      postMap.postId = tempPost.id;
      postMap.postAuthor = tempPost.authorId;
      postMap.timeStamp = tempPost.createdAt;
      postMap.postTitle = tempPost.title;
      postMap.postPrice = tempPost.price;
      postMap.postDescription = tempPost.message;


      //retrieve author image
      this.postService.retrieveAuthorImage(JSON.stringify({authorId: tempPost.authorId}))
        .subscribe(authorImg => {
          let formattedStr = pictureConverter.dataTypeFormat(authorImg?.image,authorImg?.imageType);
          postMap.postAuthorImg = formattedStr;

          //retrieve post images
          this.postService.retrievePostImages(JSON.stringify({postId: tempPost.id}))
            .subscribe(imagesList => {
              let formattedImagesList = [];
              imagesList.forEach(image => {
                let imageFormattedStr = pictureConverter.dataTypeFormat(image?.imageData,image?.type);
                formattedImagesList.push(imageFormattedStr);
              });
              postMap.postImages = formattedImagesList;

              this.commentService.retrieveCommentNum(JSON.stringify({postId: postMap.postId}))
                .subscribe(commetRes => {
                  postMap.commentNum = commetRes?.commentNum !== null ? commetRes?.commentNum : 0;
                  postMap.likes = commetRes?.likes !== null ? commetRes?.likes : 0;

                  //grab the author name
                  this.postService.grabAuthorName(JSON.stringify({authorId: tempPost.authorId}))
                  .subscribe(fullName => {
                    postMap.postAuthorName = textFormat.formatFullName(fullName);
                    postMap.heartPath = '../../../assets/heart-icon.png';
                    this.posts.push(postMap);

                    if(idx === res.length - 1){
                      this.posts = this.posts.sort((a,b) => (a.timeStamp > b.timeStamp) ? 1 : -1).reverse();
                      sessionStorage.setItem('posts',JSON.stringify(this.posts));
                      this.loading = false;
                      this.indexedPosts = this.posts;
                    }

                  });
                })
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

  likePost(e){
    let tempId:string = e.path[2].id;
    let tempIdNum:number = Number(tempId.split('-')[2]);

    if(e.path[0].src === `${environment.ORIGIN}/assets/heart-icon.png`){
      this.indexedPosts[tempIdNum].heartPath = '../../../assets/blue_heart.png';

      if(sessionStorage.getItem(`p>like>${this.indexedPosts[tempIdNum].postId}`) !== this.indexedPosts[tempIdNum].postId){
        this.postService.addLike(JSON.stringify({postId: this.indexedPosts[tempIdNum].postId,currentLikes: this.indexedPosts[tempIdNum].likes}))
          .subscribe(res => {});
      }
    }else{
      this.indexedPosts[tempIdNum].heartPath = '../../../assets/heart-icon.png';
    }
  }

  redirectSpecificPost(postId){
    //add post data to local storage
    let localPostArr = this.posts.filter(tempPost => tempPost.postId === postId);
    let localPost = localPostArr[0];
    sessionStorage.setItem('postId',localPost.postId);
    sessionStorage.setItem('postAuthor',localPost.postAuthor);
    sessionStorage.setItem('postAuthorName',localPost.postAuthorName);
    sessionStorage.setItem('postTitle',localPost.postTitle);
    sessionStorage.setItem('postCreatedAt',localPost.timeStamp);
    sessionStorage.setItem('postPrice',localPost.postPrice);
    sessionStorage.setItem('postDescription',localPost.postDescription);
    sessionStorage.setItem('postAuthorImg',localPost.postAuthorImg);
    sessionStorage.setItem('postImages',localPost.postImages ? localPost.postImages.toString() : null);

    this.router.navigateByUrl(`/post/${postId}`);
  }

  toggleFilter(){
    this.showFilter = !this.showFilter;
  }

  filterList(){
    switch(this.filterVal){
      case 'recent':
        this.posts = this.posts.sort((a,b) => (a.timeStamp > b.timeStamp) ? 1 : -1).reverse();
        break;
      case 'comment':
        this.posts = this.posts.sort((a,b) => (a.commentNum > b.commentNum) ? 1 : -1);
        break;
      case 'likes':
        this.posts = this.posts.sort((a,b) => (a.likes > b.likes) ? 1 : -1);
        break;
      default:
        this.posts = this.posts.sort((a,b) => (a.timeStamp > b.timeStamp) ? 1 : -1).reverse();
        break;
    }
  }

  indexList(emittedObj:any){
    this.loading = true;

    const boundObj = {
      minBound: ((Number(emittedObj.currentPage) - 1) * 25) + 1,
      maxBound: Number(emittedObj.currentPage) * 25,
      lastPage: emittedObj.lastPage === 'true' ? 'true' : 'false'
    };

     this.posts = [];
     this.indexedPosts = [];

    this.postService.loadAllPosts(JSON.stringify(boundObj))
      .subscribe(res => {
        this.formatPost(res);
      });
  }

  cookiesAccepted(){
    this.cookiesClicked = true;
    localStorage.setItem('cookiesClicked','true');
  }
}
