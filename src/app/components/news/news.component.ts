import { Component, OnInit, Output,EventEmitter } from '@angular/core';
import { PictureConverter } from 'src/app/utils/PictureConverter';
import { NewsService } from 'src/app/services/news.service';
import { MessageService } from 'src/app/services/message.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {

  combinedList: any[] = [];

  //these three lists are made using the combined list and sorting based off of type
  mostRecentNewsList: any[] = [];
  mostPopularNewsList: any[] = [];
  newArticlesList: any[] = [];
  loading:boolean = false;
  @Output() newMessage: EventEmitter<number> = new EventEmitter<number>();

  constructor(private newsService:NewsService,private messageService:MessageService,private router:Router) { }

  ngOnInit(): void {
    this.loading = true;
    let pictureConverter:PictureConverter = new PictureConverter();
    //retrieve all of the products
    const boundObj = {
      minBound: 1,
      maxBound: 25,
      lastPage: 'false'
    };

    this.newsService.grabNews(JSON.stringify(boundObj))
      .subscribe(news => {
        let tempList:any[] = news;

        //get the number of users in each activity
        tempList.forEach((item,idx) => {
          this.newsService.grabImage(JSON.stringify({articleId: item.id}))
                .subscribe(image => {
                  let finalImage = pictureConverter.dataTypeFormat(image?.imageData,image?.type);

                  this.combinedList.push({
                    ...item,
                    image: image?.imageData !== null && image?.imageData !== undefined ? finalImage : '../../../assets/default_bg.png'
                  });

                  if(idx === tempList.length - 1){
                    //sort the news into the respective lists
                    //this.mostPopularNewsList = this.combinedList.sort((a,b) => (a.memberNum > b.memberNum) ? 1 : -1);
                    this.mostPopularNewsList = this.combinedList.slice(0,3);

                    this.mostRecentNewsList = this.combinedList.slice(0,3);
                    this.newArticlesList = this.combinedList.reverse();
                    this.newArticlesList = this.newArticlesList.slice(0,3);
                    this.loading = false;
                  }
                });
        });

      });
  }

  updateMessages(){
    this.messageService.getNewMessageCount(JSON.stringify({id: sessionStorage.getItem('userId')}))
      .subscribe(count => {
        this.newMessage.emit(count);
      });
  }

  newsRedirect(e){
    let tempId:string = e.path[1].id;

    this.router.navigateByUrl(`/news/article/${tempId.split('>')[1]}`)
  }

  listAllRedirect(e){
    let tempId:string = e.path[0].id;
    this.router.navigateByUrl(`/news/list/${tempId}`);
  }
}
