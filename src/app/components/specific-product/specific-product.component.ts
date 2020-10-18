import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Offer } from 'src/app/models/Offer';
import { ActivatedRoute, Router } from '@angular/router';
import { MarketService } from 'src/app/services/market.service';
import { PictureConverter } from 'src/app/utils/PictureConverter';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-specific-product',
  templateUrl: './specific-product.component.html',
  styleUrls: ['./specific-product.component.css']
})
export class SpecificProductComponent implements OnInit {

  offer:Offer= new Offer();
  imageList:any[] = [];
  ownerId:string;
  userId:string;
  @Output() newMessage: EventEmitter<number> = new EventEmitter<number>();

  constructor(private route:ActivatedRoute,private router:Router,private productService:MarketService,
    private messageService:MessageService) { }



  ngOnInit(): void {
    this.offer.id = this.route.snapshot.paramMap.get('productId');
    sessionStorage.setItem(sessionStorage.getItem('rv1') !== 'null' ?
    sessionStorage.getItem('rv2') !== 'null' ?

    sessionStorage.getItem('rv3') !== 'null' ?
    sessionStorage.getItem('rv4') !== 'null' ? sessionStorage.getItem('rv5') !== 'null' ? 'rv1' : 'rv5'
    : 'rv5'
     : 'rv4'
    : 'rv2'
    : 'rv1','phobyn' + this.offer.id);

    let pictureConverter:PictureConverter = new PictureConverter();
    this.productService.grabSpecificProduct(JSON.stringify({productId: this.offer.id}))
      .subscribe(product => {

        this.offer = product;

        if(this.offer.price.substring(this.offer.price.length - 1) === ','){
          this.offer.price = this.offer.price.substring(0,this.offer.price.length - 1);
        }

        this.ownerId = this.offer.ownerId;
        this.userId = sessionStorage.getItem('userId');
        this.productService.grabImages(JSON.stringify({productId: this.offer.id}))
          .subscribe(listOfImages => {
            listOfImages.forEach((image,idx) => {
              let picStr = pictureConverter.dataTypeFormat(image?.imageData,image?.type);
              this.imageList.push(picStr);
            });

            this.productService.grabHighlights(JSON.stringify({productId: this.offer.id}))
              .subscribe(highlights => {
                let tempList:string[] = [];
                highlights.forEach((highlight,idx) => {
                tempList.push(highlight?.message);

                if(idx === highlights.length - 1){
                  this.offer.highlights = tempList;
                }
              });
          });

      });
    });

  }


  bidRedirect(e){
    let tempId:string = e.path[0].id;
    this.router.navigateByUrl(`/bid/${tempId.split('>')[1]}`);
  }

  offerRedirect(){
    this.router.navigateByUrl(`/offer`);
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
