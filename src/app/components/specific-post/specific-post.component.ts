import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Post } from 'src/app/models/Post';
import { ActivatedRoute, Router } from '@angular/router';
import { CommentService } from 'src/app/services/comment.service';
import { Comment } from 'src/app/models/Comment';
import { TextFormat } from 'src/app/utils/TextFormat';
import { MessageService } from 'src/app/services/message.service';
import { PostService } from 'src/app/services/post.service';
import {environment} from '../../../environments/environment'

@Component({
  selector: 'app-specific-post',
  templateUrl: './specific-post.component.html',
  styleUrls: ['./specific-post.component.css']
})
export class SpecificPostComponent implements OnInit {

  post: Post = new Post();
  newCommentStr: string;
  commentList: Comment[] = [];
  commentNum: number;
  heart: string = '../../../assets/heart-icon.png';
  userId:string;
  @Output() newMessage: EventEmitter<number> = new EventEmitter<number>();

  constructor(private route:ActivatedRoute,private router:Router,private commentService:CommentService,
    private messageService:MessageService,private postService:PostService) { }

  ngOnInit(): void {
    this.post.postId = this.route.snapshot.paramMap.get('postId');
    sessionStorage.setItem(sessionStorage.getItem('rv1') !== 'null' ?
    sessionStorage.getItem('rv2') !== 'null' ?

    sessionStorage.getItem('rv3') !== 'null' ?
    sessionStorage.getItem('rv4') !== 'null' ? sessionStorage.getItem('rv5') !== 'null' ? 'rv1' : 'rv5'
    : 'rv5'
     : 'rv4'
    : 'rv2'
    : 'rv1','phobyn' + this.post.postId);
    let textFormat = new TextFormat();
    this.userId = sessionStorage.getItem('userId');

    //map local storage data to post
    this.post.postAuthor = sessionStorage.getItem('postAuthor');
    this.post.postAuthorName = sessionStorage.getItem('postAuthorName');
    this.post.postTitle = sessionStorage.getItem('postTitle');
    this.post.timeStamp = sessionStorage.getItem('postCreatedAt');
    this.post.postPrice = sessionStorage.getItem('postPrice');
    this.post.postDescription = sessionStorage.getItem('postDescription');
    this.post.postAuthorImg = sessionStorage.getItem('postAuthorImg');
    let imageListStr = sessionStorage.getItem('postImages');
    this.post.postImages = imageListStr.split(',');

    //load comments for post
    this.commentService.loadComments(JSON.stringify({postId: this.post.postId}))
      .subscribe(commentArr => {
        this.commentNum = this.commentList.length;

        commentArr.forEach((comment,idx) => {
          let tempComment:Comment = new Comment();
          tempComment = comment;

          //grab the author name
          this.commentService.grabAuthorName(JSON.stringify({authorId: tempComment.authorId}))
            .subscribe(res => {
              tempComment.authorName = textFormat.formatFullName(res.fullName);
              this.commentList.push(tempComment);

              if(idx === commentArr.length - 1){
                this.commentList = this.commentList.reverse();
              }
            });
        });
      });
  }

  likePost(e){
    let tempId:string = e.path[2].id;
    let tempIdNum:number = Number(tempId.split('-')[2]);

    if(e.path[0].src === `${environment.ORIGIN}/assets/heart-icon.png`){
      this.heart = '../../../assets/blue_heart.png';

      if(sessionStorage.getItem(`p>like>${this.post.postId}`) !== this.post.postId){
        this.postService.addLike(JSON.stringify({postId: this.post.postId,currentLikes: this.post.likes}))
          .subscribe(res => {});
      }
    }else{
      this.heart = '../../../assets/heart-icon.png';
    }
  }

  addComment(data){
    if(this.userId !== 'null'){
      if(this.post?.postId?.length > 0){
        if(data.newCommentStr.length > 0 && data.newCommentStr.length < 500){

          const commentObj = {
            postId: this.post.postId,
            authorId: sessionStorage.getItem('userId'),
            message: data.newCommentStr
          };

          this.newCommentStr = '';

          this.commentService.addComment(JSON.stringify(commentObj))
            .subscribe(newComment => {
              let tempComm = {...newComment,authorName: 'Me'};
              tempComm.createdAt = 'now';
              this.commentList.unshift(tempComm);
            });
          }
      }
    }else{
      this.router.navigateByUrl('/login');
    }

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
