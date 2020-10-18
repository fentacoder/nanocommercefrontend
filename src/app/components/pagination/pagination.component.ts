import { Component, Output,EventEmitter,OnInit, Input,OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit,OnChanges {

  @Output() currentList:EventEmitter<any> = new EventEmitter();
  @Input() itemCount:number;
  pageList: any[] = [];
  currentPage:number = 1;
  numberOfPages:number = 1;
  pageClass1:any = {};
  pageClass2:any = {};
  pageClass3:any = {};
  pageClass4:any = {};
  pageClass5:any = {};
  pageMin:number = 1;
  page1Aval:boolean = false;
  page2Aval:boolean = false;
  page3Aval:boolean = false;
  page4Aval:boolean = false;
  page5Aval:boolean = false;

  constructor() { }

  ngOnInit(){
    this.getPageNum();
    this.stylePages();
  }

  ngOnChanges(changes: SimpleChanges){
    if(changes['itemCount'].previousValue !== changes['itemCount'].currentValue){
      this.itemCount = changes['itemCount'].currentValue;
      this.getPageNum();
      this.stylePages();
    }
  }

  getPageNum(){
    let itemNum = this.itemCount;
    if(itemNum % 25 !== 0){
      this.numberOfPages = Math.floor(itemNum / 25) + 1;
    }else{
      this.numberOfPages = itemNum / 25;
    }
  }

  stylePages(){
    let currentPageStr = this.currentPage.toString();
    let position = '0';
    if(Number(currentPageStr) < 10){
      position = currentPageStr;
    }else{
      position = currentPageStr.substring(1);
    }

    if(Number(position) <= 5){
      switch(Number(position)){
        case 1:
          this.pageClass1 = {'active-pagination':true};
          this.pageClass2 = {'non-active-pagination':true};
          this.pageClass3 = {'non-active-pagination':true};
          this.pageClass4 = {'non-active-pagination':true};
          this.pageClass5 = {'non-active-pagination':true};
          break;
        case 2:
          this.pageClass1 = {'non-active-pagination':true};
          this.pageClass2 = {'active-pagination':true};
          this.pageClass3 = {'non-active-pagination':true};
          this.pageClass4 = {'non-active-pagination':true};
          this.pageClass5 = {'non-active-pagination':true};
          break;
        case 3:
          this.pageClass1 = {'non-active-pagination':true};
          this.pageClass2 = {'non-active-pagination':true};
          this.pageClass3 = {'active-pagination':true};
          this.pageClass4 = {'non-active-pagination':true};
          this.pageClass5 = {'non-active-pagination':true};
          break;
        case 4:
          this.pageClass1 = {'non-active-pagination':true};
          this.pageClass2 = {'non-active-pagination':true};
          this.pageClass3 = {'non-active-pagination':true};
          this.pageClass4 = {'active-pagination':true};
          this.pageClass5 = {'non-active-pagination':true};
          break;
        case 5:
          this.pageClass1 = {'non-active-pagination':true};
          this.pageClass2 = {'non-active-pagination':true};
          this.pageClass3 = {'non-active-pagination':true};
          this.pageClass4 = {'non-active-pagination':true};
          this.pageClass5 = {'active-pagination':true};
          break;
        default:
          break;
      }
    }else{
      switch(Number(position)){
        case 6:
          this.pageClass1 = {'active-pagination':true};
          this.pageClass2 = {'non-active-pagination':true};
          this.pageClass3 = {'non-active-pagination':true};
          this.pageClass4 = {'non-active-pagination':true};
          this.pageClass5 = {'non-active-pagination':true};
          break;
        case 7:
          this.pageClass1 = {'non-active-pagination':true};
          this.pageClass2 = {'active-pagination':true};
          this.pageClass3 = {'non-active-pagination':true};
          this.pageClass4 = {'non-active-pagination':true};
          this.pageClass5 = {'non-active-pagination':true};
          break;
        case 8:
          this.pageClass1 = {'non-active-pagination':true};
          this.pageClass2 = {'non-active-pagination':true};
          this.pageClass3 = {'active-pagination':true};
          this.pageClass4 = {'non-active-pagination':true};
          this.pageClass5 = {'non-active-pagination':true};
          break;
        case 9:
          this.pageClass1 = {'non-active-pagination':true};
          this.pageClass2 = {'non-active-pagination':true};
          this.pageClass3 = {'non-active-pagination':true};
          this.pageClass4 = {'active-pagination':true};
          this.pageClass5 = {'non-active-pagination':true};
          break;
        case 0:
          this.pageClass1 = {'non-active-pagination':true};
          this.pageClass2 = {'non-active-pagination':true};
          this.pageClass3 = {'non-active-pagination':true};
          this.pageClass4 = {'non-active-pagination':true};
          this.pageClass5 = {'active-pagination':true};
          break;
        default:
          break;
      }
    }

    if(this.numberOfPages - this.pageMin <= 4 && this.numberOfPages - this.pageMin > 0){
      let tempNumStr = '';

      if(this.numberOfPages >= 10){
        tempNumStr = this.numberOfPages.toString().substring(1);
      }else{
        tempNumStr = this.numberOfPages.toString();
      }

      let newTempNumStr = Number(tempNumStr) > 5 ? (Number(tempNumStr) - 5).toString() : tempNumStr;

      switch(Number(newTempNumStr)){
        case 1:
          this.page1Aval = true;
          this.page2Aval = false;
          this.page3Aval = false;
          this.page4Aval = false;
          this.page5Aval = false;
          break;
        case 2:
          this.page1Aval = true;
          this.page2Aval = true;
          this.page3Aval = false;
          this.page4Aval = false;
          this.page5Aval = false;
          break;
        case 3:
          this.page1Aval = true;
          this.page2Aval = true;
          this.page3Aval = false;
          this.page4Aval = false;
          this.page5Aval = false;
          break;
        case 4:
          this.page1Aval = true;
          this.page2Aval = true;
          this.page3Aval = false;
          this.page4Aval = false;
          this.page5Aval = false;
          break;
        case 5:
          this.page1Aval = true;
          this.page2Aval = true;
          this.page3Aval = false;
          this.page4Aval = false;
          this.page5Aval = false;
          break;
        default:
          this.page1Aval = true;
          this.page2Aval = false;
          this.page3Aval = false;
          this.page4Aval = false;
          this.page5Aval = false;
          break;
      }
    }else if(this.numberOfPages === this.pageMin){
      this.page1Aval = true;
      this.page2Aval = false;
      this.page3Aval = false;
      this.page4Aval = false;
      this.page5Aval = false;
    }else{
      this.page1Aval = true;
      this.page2Aval = true;
      this.page3Aval = true;
      this.page4Aval = true;
      this.page5Aval = true;
    }
  }

  firstPage(){
    this.currentPage = 1;
    this.currentList.emit({currentPage: this.currentPage,lastPage: 'false'});
    this.pageMin = 1;
    this.stylePages();
  }

  lastPage(){
    this.currentList.emit({currentPage: this.numberOfPages,lastPage: 'true'});
    this.currentPage = this.numberOfPages;

    if(this.numberOfPages >= 10){
      if(Number(this.numberOfPages.toString().substring(1)) <= 5){
        let tempStr = this.numberOfPages.toString().substring(0,1);
        let formattedStr = tempStr + '1';
        this.pageMin = Number(formattedStr);
      }else{
        if(Number(this.numberOfPages.toString().substring(1)) === 0){
          let tempStr = this.numberOfPages.toString().substring(0,1);
          let formattedStr = (Number(tempStr) - 1) + '6';
          this.pageMin = Number(formattedStr);
        }else{
          let tempStr = this.numberOfPages.toString().substring(0,1);
          let formattedStr = tempStr + '6';
          this.pageMin = Number(formattedStr);
        }
      }
    }else{
      if(this.numberOfPages <= 5){
        this.pageMin = 1;
      }else{
        this.pageMin = 6;
      }
    }
    this.stylePages();
  }

  previousPage(){
    if(this.currentPage.toString().substring(1) === '1' || this.currentPage.toString().substring(1) === '6'){
      //go to previous set of 5 pages
      this.pageMin -= 5;
      this.currentPage -= 1;
      this.currentList.emit({currentPage: this.currentPage,lastPage: 'false'});
    }else{
      this.currentPage -= 1;
      this.currentList.emit({currentPage: this.currentPage,lastPage: 'false'});
    }
    this.stylePages();
  }

  nextPage(){
    if(this.currentPage.toString().substring(1) === '5' || this.currentPage.toString().substring(1) === '0'){
      //go to previous set of 5 pages
      this.pageMin += 5;
      this.currentPage += 1;
      if(this.currentPage === this.numberOfPages){
        this.currentList.emit({currentPage: this.currentPage,lastPage: 'true'});
      }else{
        this.currentList.emit({currentPage: this.currentPage,lastPage: 'false'});
      }
    }else{
      this.currentPage += 1;
      if(this.currentPage === this.numberOfPages){
        this.currentList.emit({currentPage: this.currentPage,lastPage: 'true'});
      }else{
        this.currentList.emit({currentPage: this.currentPage,lastPage: 'false'});
      }
    }
    this.stylePages();
  }

  changePage(e){
    let tempPageStr:string = e.path[0].innerText;
    this.currentPage = Number(e.path[0].innerText);
    if(Number(tempPageStr) >= 10){
      let divBy10 = Math.floor(Number(tempPageStr) / 10);

      //now that I have how many tens there are I need to determine which side the current page is on
      if(Number(tempPageStr.substring(1)) <= 5){
        //current page is on the left side
        this.pageMin = Number(divBy10 + '1');
      }else{
        this.pageMin = Number(divBy10 + '6');
      }
      this.stylePages();
      if(this.currentPage === this.numberOfPages){
        this.currentList.emit({currentPage: this.currentPage,lastPage: 'true'});
      }else{
        this.currentList.emit({currentPage: this.currentPage,lastPage: 'false'});
      }
    }else{
      let tempPage = Number(tempPageStr);
      if(tempPage <= 5){
        this.pageMin = 1;
      }else{
        this.pageMin = 6;
      }
      this.stylePages();

      if(this.currentPage === this.numberOfPages){
        this.currentList.emit({currentPage: this.currentPage,lastPage: 'true'});
      }else{
        this.currentList.emit({currentPage: this.currentPage,lastPage: 'false'});
      }
    }
  }
}
