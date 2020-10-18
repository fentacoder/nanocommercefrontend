import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-forums',
  templateUrl: './forums.component.html',
  styleUrls: ['./forums.component.css']
})
export class ForumsComponent implements OnInit {

  faq1:boolean = false;
  faq2:boolean = false;
  faq3:boolean = false;
  faq4:boolean = false;
  faq5:boolean = false;
  faq6:boolean = false;
  faq7:boolean = false;
  faq8:boolean = false;
  faq9:boolean = false;
  faq10:boolean = false;
  faq11:boolean = false;
  faq12:boolean = false;
  faq13:boolean = false;
  faq14:boolean = false;
  faq15:boolean = false;
  faq16:boolean = false;
  faq17:boolean = false;
  faq18:boolean = false;
  faq19:boolean = false;
  faq20:boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  toggleFaq(e){
    switch(e.path[1].id){
      case 'faq1':
        this.faq1 = !this.faq1;
        break;
      case 'faq2':
        this.faq2 = !this.faq2;
        break;
      case 'faq3':
        this.faq3 = !this.faq3;
        break;
      case 'faq4':
        this.faq4 = !this.faq4;
        break;
      case 'faq5':
        this.faq5 = !this.faq5;
        break;
      case 'faq6':
        this.faq6 = !this.faq6;
        break;
      case 'faq7':
        this.faq7 = !this.faq7;
        break;
      case 'faq8':
        this.faq8 = !this.faq8;
        break;
      case 'faq9':
        this.faq9 = !this.faq9;
        break;
      case 'faq10':
        this.faq10 = !this.faq10;
        break;
      case 'faq11':
        this.faq11 = !this.faq11;
        break;
      case 'faq12':
        this.faq12 = !this.faq12;
        break;
      case 'faq13':
        this.faq13 = !this.faq13;
        break;
      case 'faq14':
        this.faq14 = !this.faq14;
        break;
      case 'faq15':
        this.faq15 = !this.faq15;
        break;
      case 'faq16':
        this.faq16 = !this.faq16;
        break;
      case 'faq17':
        this.faq17 = !this.faq17;
        break;
      case 'faq18':
        this.faq18 = !this.faq18;
        break;
      case 'faq19':
        this.faq19 = !this.faq19;
        break;
      case 'faq20':
        this.faq20 = !this.faq20;
        break;
      default:
        break;
    }
  }

}
