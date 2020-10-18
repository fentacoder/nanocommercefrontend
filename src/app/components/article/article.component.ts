import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NewsService } from 'src/app/services/news.service';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css']
})
export class ArticleComponent implements OnInit {

  article: any;
  articleId:string;

  //grab a list of article IDs from database and when the user clicks next a new random article is loaded
  articleIdList: string[];
  previousArticleIds: string[] = [];

  constructor(private route:ActivatedRoute,private newsService:NewsService) { }

  ngOnInit(): void {
    this.articleId = this.route.snapshot.paramMap.get('articleId');

    this.articleRetrieval(this.articleId);
  }

  previousArticle(){
    let tempId = this.previousArticleIds[0];
    this.previousArticleIds = this.previousArticleIds.slice(1);
    this.articleIdList.unshift(tempId);
    this.articleId = tempId;
    this.articleRetrieval(tempId);
  }

  nextArticle(){
    //add current article to previous id list only if not present already and show next random article
    let tempId = this.articleIdList[0];
    this.previousArticleIds.unshift(this.articleId);
    this.articleId = tempId;
    this.articleIdList = this.articleIdList.slice(1);
    this.articleRetrieval(this.articleId);
  }

  articleRetrieval(id){
    this.newsService.grabArticle(JSON.stringify({articleId: id}))
      .subscribe(tempArticle => {
        this.article = tempArticle;
      });
  }
}
