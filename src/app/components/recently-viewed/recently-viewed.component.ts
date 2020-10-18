import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recently-viewed',
  templateUrl: './recently-viewed.component.html',
  styleUrls: ['./recently-viewed.component.css']
})
export class RecentlyViewedComponent implements OnInit {

  itemList:any[];

  constructor(private router:Router) { }

  ngOnInit(): void {
  }

  initialize(){
    if(sessionStorage.getItem('rv1').length > 0){
      let type1 = sessionStorage.getItem('rv1').split('hobyn')[0];
      this.addToList(type1,sessionStorage.getItem('rv1').split('hobyn')[1]);
    }
    if(sessionStorage.getItem('rv2').length > 0){
      let type2 = sessionStorage.getItem('rv2').split('hobyn')[0];
      this.addToList(type2,sessionStorage.getItem('rv2').split('hobyn')[1]);
    }
    if(sessionStorage.getItem('rv3').length > 0){
      let type3 = sessionStorage.getItem('rv3').split('hobyn')[0];
      this.addToList(type3,sessionStorage.getItem('rv3').split('hobyn')[1]);
    }
    if(sessionStorage.getItem('rv4').length > 0){
      let type4 = sessionStorage.getItem('rv4').split('hobyn')[0];
      this.addToList(type4,sessionStorage.getItem('rv4').split('hobyn')[1]);
    }
    if(sessionStorage.getItem('rv5').length > 0){
      let type5 = sessionStorage.getItem('rv5').split('hobyn')[0];
      this.addToList(type5,sessionStorage.getItem('rv5').split('hobyn')[1]);
    }
  }

  addToList(type,id){
    switch(type){
      case 'a':
        this.itemList.push({title: `viewed activity ${id}`,id: id});
        break;
      case 'p':
        this.itemList.push({title: `viewed post ${id}`,id:id});
        break;
      default:
        break;
    }
  }

  specificRedirect(e){
    if(e.target.innerText.includes('viewed activity')){
      this.router.navigateByUrl(`/gamebreaks/break/${e.target.id}`);
    }else{
      this.router.navigateByUrl(`/post/${e.target.id}`);
    }
  }

}
