import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ListAllService } from 'src/app/services/list-all.service';
import { PictureConverter } from 'src/app/utils/PictureConverter';
import { Post } from 'src/app/models/Post';

@Component({
  selector: 'app-list-all',
  templateUrl: './list-all.component.html',
  styleUrls: ['./list-all.component.css']
})
export class ListAllComponent implements OnInit {

  /*
  query string possibilities grab this from router paramMap:

  mp - most popular
  ma - most available
  rl - recently listed products
  h - hottest
  aso - almost sold out
  rla - recently listed activities
  mrn - most recent news
  mpn - most popular news
  na - new articles
  p - posts filtered from search
  */

  titleText:string;
  listType:string;
  itemList:any[] = [];
  pictureConverter:PictureConverter = new PictureConverter();
  showFilter:boolean = false;
  filterVal:string = 'recent';
  objectCount:number;
  loading:boolean = false;

  constructor(private router:Router,private route:ActivatedRoute,private listAllService:ListAllService) { }

  ngOnInit(): void {
    this.listType = this.route.snapshot.paramMap.get('seeAllStr');

    this.initialize();

  }

  initialize(){
    this.loading = true;
    const boundObj = {
      minBound: 1,
      maxBound: 25,
      lastPage: 'false'
    };

    switch(this.listType){
      case 'mp':
        this.titleText = 'Most Popular';
        this.productRetrieval('mp',boundObj);
        break;
      case 'ma':
        this.titleText = 'Most Available';
        this.productRetrieval('ma',boundObj);
        break;
      case 'rl':
        this.titleText = 'Recently Listed';
        this.productRetrieval('rl',boundObj);
        break;
      case 'h':
        this.titleText = 'Hottest';
        this.activityRetrieval('h',boundObj);
        break;
      case 'aso':
        this.titleText = 'Almost Sold Out';
        this.activityRetrieval('aso',boundObj);
        break;
      case 'rla':
        this.titleText = 'Recently Listed';
        this.activityRetrieval('rla',boundObj);
        break;
      case 'mrn':
        this.titleText = 'Most Recent News';
        this.newsRetrieval(boundObj);
        break;
      case 'mpn':
        this.titleText = 'Hottest Stories';
        this.newsRetrieval(boundObj);
        break;
      case 'na':
        this.titleText = 'Latest Articles';
        this.newsRetrieval(boundObj);
        break;
      case 'p':
        this.titleText = 'Posts';
        let tempList:Post[] = JSON.parse(sessionStorage.getItem('currentPostList'));
        tempList.forEach(post => {
          this.itemList.push({
            id: post?.postId,
            image: post?.postImages[0],
            title: post?.postTitle
          });
        });
        break;
      default:
        this.titleText = 'Most Popular';
        this.productRetrieval('mp',boundObj);
        break;
    }
  }

  redirectSpecific(e){
    switch(this.listType){
      case 'mp':
        this.router.navigateByUrl(`/products/${e.path[1].id}`);
        break;
      case 'ma':
        this.router.navigateByUrl(`/products/${e.path[1].id}`);
        break;
      case 'rl':
        this.router.navigateByUrl(`/products/${e.path[1].id}`);
        break;
      case 'h':
        this.router.navigateByUrl(`/activities/activity/${e.path[1].id}`);
        break;
      case 'aso':
        this.router.navigateByUrl(`/activities/activity/${e.path[1].id}`);
        break;
      case 'rla':
        this.router.navigateByUrl(`/activities/activity/${e.path[1].id}`);
        break;
      case 'mrn':
        this.router.navigateByUrl(`/news/article/${e.path[1].id}`);
        break;
      case 'mpn':
        this.router.navigateByUrl(`/news/article/${e.path[1].id}`);
        break;
      case 'na':
        this.router.navigateByUrl(`/news/article/${e.path[1].id}`);
        break;
      case 'p':
        this.router.navigateByUrl(`/post/${e.path[1].id}`);
        break;
      default:
        this.router.navigateByUrl('/market');
        break;
    }
  }

  productRetrieval(type,boundObj):any{
    let tempList:any[] = [];
    this.listAllService.getProductCount()
      .subscribe(countRes => {
        this.objectCount = countRes.count;

        if(type === 'mp'){
          this.listAllService.grabProducts(JSON.stringify(boundObj))
          .subscribe(products => {
            tempList = products;

            //get the bid number for each product
            tempList.forEach((item,idx) => {
              this.listAllService.grabBidNum(JSON.stringify({productId: item.id}))
                .subscribe(bidNumber => {
                  this.listAllService.grabProductImage(JSON.stringify({productId: item.id}))
                    .subscribe(image => {
                      let finalImage = this.pictureConverter.dataTypeFormat(image?.imageData,image?.type);

                      this.itemList.push({
                        ...item,
                        bidNum: bidNumber,
                        image: image?.imageData !== null && image?.imageData !== undefined ? finalImage : '../../../assets/default_bg.png',
                        createdAt: item.createdAt,
                        price: item?.askingPrice?.length > 0 ? item?.askingPrice : null
                      });

                      if(idx === tempList.length - 1){
                        //sort the products into the respective lists
                        this.itemList = this.itemList.sort((a,b) => (a.bidNum > b.bidNum) ? 1 : -1);
                        this.loading = false;
                      }
                    });
                });
            });


          });
        }else{
          this.listAllService.grabProducts(JSON.stringify(boundObj))
          .subscribe(products => {
            tempList = products;

            //get the bid number for each product
            tempList.forEach((item,idx) => {
              this.listAllService.grabProductImage(JSON.stringify({productId: item.id}))
                .subscribe(image => {
                  let finalImage = this.pictureConverter.dataTypeFormat(image?.imageData,image?.type);

                  this.itemList.push({
                    ...item,
                    image: image?.imageData !== null && image?.imageData !== undefined ? finalImage : '../../../assets/default_bg.png',
                    createdAt: item.createdAt,
                    price: item?.askingPrice.length > 0 ? item?.askingPrice : null
                  });

                  if(idx === tempList.length - 1){
                    this.loading = false;
                  }
                });
            });
          });
        }
      });
  }

  activityRetrieval(type,boundObj):any{
    let tempList:any[] = [];
    if(type === 'h'){
      this.listAllService.grabActivities(JSON.stringify(boundObj))
        .subscribe(products => {
          tempList = products;

          //get the number of users in each activity
          tempList.forEach((item,idx) => {
            this.listAllService.grabMemberNum(JSON.stringify({productId: item.id}))
              .subscribe(memberNumber => {
                this.listAllService.grabActivityImage(JSON.stringify({productId: item.id}))
                  .subscribe(image => {
                    let finalImage = this.pictureConverter.dataTypeFormat(image?.imageData,image?.type);

                    this.itemList.push({
                      ...item,
                      memberNum: memberNumber,
                      image: image?.imageData !== null && image?.imageData !== undefined ? finalImage : '../../../assets/default_bg.png',
                      createdAt: item.createdAt,
                      price: item?.price.length > 0 ? item?.price : null
                    });

                    if(idx === tempList.length - 1){
                      //sort the products into the respective lists
                      this.itemList = this.itemList.sort((a,b) => (a.memberNum > b.memberNum) ? 1 : -1);
                      this.loading = false;
                    }
                  });
              });
          });
      });
    }else{
      this.listAllService.grabActivities(JSON.stringify(boundObj))
        .subscribe(products => {
          tempList = products;

          //get the number of users in each activity
          tempList.forEach((item,idx) => {
            this.listAllService.grabActivityImage(JSON.stringify({productId: item.id}))
              .subscribe(image => {
                let finalImage = this.pictureConverter.dataTypeFormat(image?.imageData,image?.type);

                this.itemList.push({
                  ...item,
                  image: image?.imageData !== null && image?.imageData !== undefined ? finalImage : '../../../assets/default_bg.png',
                  createdAt: item.createdAt,
                  price: item?.price.length > 0 ? item?.price : null
                });

                if(idx === tempList.length - 1){
                  this.loading = false;
                }
              });
          });
      });
    }
  }

  newsRetrieval(boundObj):any{
    let tempList:any[] = [];

    this.listAllService.grabNews(JSON.stringify(boundObj))
      .subscribe(products => {
        tempList = products;

        //get the number of users in each activity
        tempList.forEach((item,idx) => {
          this.listAllService.grabNewsImage(JSON.stringify({productId: item.id}))
                .subscribe(image => {
                  let finalImage = this.pictureConverter.dataTypeFormat(image?.imageData,image?.type);

                  this.itemList.push({
                    ...item,
                    image: image?.imageData !== null && image?.imageData !== undefined ? finalImage : '../../../assets/default_bg.png',
                    createdAt: item.createdAt
                  });

                  if(idx === tempList.length - 1){
                    this.loading = false;
                  }
                });
        });
      });
  }

  toggleFilter(){
    this.showFilter = !this.showFilter;
  }

  filterList(){
    switch(this.filterVal){
      case 'recent':
        this.itemList = this.itemList.sort((a,b) => (a.createdAt > b.createdAt) ? 1 : -1).reverse();
        break;
      case 'mprice':
        if(this.listType === 'mp' || this.listType === 'ma' ||this.listType === 'rl' ||
        this.listType === 'h' || this.listType === 'aso' || this.listType === 'rla'){
          //list is of products or activities so the price works
          this.itemList = this.itemList.sort((a,b) => (a.price > b.price) ? 1 : -1).reverse();
        }else{
          this.itemList = this.itemList.sort((a,b) => (a.createdAt > b.createdAt) ? 1 : -1).reverse();
        }
        break;
        case 'lprice':
          if(this.listType === 'mp' || this.listType === 'ma' ||this.listType === 'rl' ||
          this.listType === 'h' || this.listType === 'aso' || this.listType === 'rla'){
            //list is of products or activities so the price works
            this.itemList = this.itemList.sort((a,b) => (a.price > b.price) ? 1 : -1).reverse();
          }else{
            this.itemList = this.itemList.sort((a,b) => (a.createdAt > b.createdAt) ? 1 : -1).reverse();
          }
          break;
      case 'popular':
        if(this.listType === 'mp' || this.listType === 'ma' ||this.listType === 'rl'){
          this.itemList = this.itemList.sort((a,b) => (a.bidNum > b.bidNum) ? 1 : -1).reverse();
        }else{
          this.itemList = this.itemList.sort((a,b) => (a.createdAt > b.createdAt) ? 1 : -1).reverse();
        }
      default:
        this.itemList = this.itemList.sort((a,b) => (a.createdAt > b.createdAt) ? 1 : -1).reverse();
        break;
    }
  }

  indexList(emittedObj){
    this.loading = true;
    this.itemList = [];
    const boundObj = {
      minBound: ((Number(emittedObj.currentPage) - 1) * 25) + 1,
      maxBound: Number(emittedObj.currentPage) * 25,
      lastPage: emittedObj.lastPage === 'true' ? 'true' : 'false'
    };

    switch(this.listType){
      case 'mp':
        this.titleText = 'Most Popular';
        this.productRetrieval('mp',boundObj);
        break;
      case 'ma':
        this.titleText = 'Most Available';
        this.productRetrieval('ma',boundObj);
        break;
      case 'rl':
        this.titleText = 'Recently Listed';
        this.productRetrieval('rl',boundObj);
        break;
      case 'h':
        this.titleText = 'Hottest';
        this.activityRetrieval('h',boundObj);
        break;
      case 'aso':
        this.titleText = 'Almost Sold Out';
        this.activityRetrieval('aso',boundObj);
        break;
      case 'rla':
        this.titleText = 'Recently Listed';
        this.activityRetrieval('rla',boundObj);
        break;
      case 'mrn':
        this.titleText = 'Most Recent News';
        this.newsRetrieval(boundObj);
        break;
      case 'mpn':
        this.titleText = 'Hottest Stories';
        this.newsRetrieval(boundObj);
        break;
      case 'na':
        this.titleText = 'Latest Articles';
        this.newsRetrieval(boundObj);
        break;
      default:
        this.titleText = 'Most Popular';
        this.productRetrieval('mp',boundObj);
        break;
    }
  }
}
