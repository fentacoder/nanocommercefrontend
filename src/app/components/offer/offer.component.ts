import { Component, OnInit } from '@angular/core';
import { OfferService } from 'src/app/services/offer.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-offer',
  templateUrl: './offer.component.html',
  styleUrls: ['./offer.component.css']
})
export class OfferComponent implements OnInit {

  title:string;
  image1:File = null;
  image2:File = null;
  image3:File = null;
  askingPrice:number;
  details:string;
  highlight1:string;
  highlight2:string;
  highlight3:string;
  highlight4:string;
  priceError: boolean = false;
  shippingFee: number;
  preferredPay:string = 'paypal';
  productId:string;


  constructor(private offerService:OfferService,private router:Router) { }

  ngOnInit(): void {
    if(sessionStorage.getItem('userId')?.length <= 4 || sessionStorage.getItem('userId')?.length === undefined){
      this.router.navigateByUrl('/login');
    }
  }

  onImage1Change(e) {
    this.image1 = <File>e.target.files[0];
  }

  onImage2Change(e) {
    this.image2 = <File>e.target.files[0];
  }

  onImage3Change(e) {
    this.image3 = <File>e.target.files[0];
  }

  submitOffer(data){
    let price = this.formatPrice(data.askingPrice);
    let tempShippingFee = this.formatPrice(data.shippingFee);

    if(price !== ''){
      if(data.title.length > 0 && this.image1 !== null && data.details.length > 0 && price.length > 0
        && data.shippingFee > 0){
        //product object
        const productObj = {
          ownerId: sessionStorage.getItem('userId'),
          title: data.title,
          price: price,
          details: data.details,
          shippingFee: tempShippingFee,
          preferredPay: 'paypal'
        };

        //product images
        const productImagesObj = {
          image1: this.image1 !== null ? this.image1 : null,
          image1Type: this.image1 !== null ? this.image1.type.split('/')[1] : null,
          image2: this.image2 !== null ? this.image2 : null,
          image2Type: this.image2 !== null ? this.image2.type.split('/')[1] : null,
          image3: this.image3 !== null ? this.image3 : null,
          image3Type: this.image3 !== null ? this.image3.type.split('/')[1] : null
        };

        //product highlights
        const highlightObj = {
          highlight1: data.highlight1?.length > 0 ? data.highlight1 : null,
          highlight2: data.highlight2?.length > 0 ? data.highlight2 : null,
          highlight3: data.highlight3?.length > 0 ? data.highlight3 : null,
          highlight4: data.highlight4?.length > 0 ? data.highlight4 : null,
        };

        this.offerService.submitProduct(JSON.stringify(productObj),productObj.ownerId)
          .subscribe(productId => {
            this.productId = productId;

          this.offerService.submitProductHighlights(JSON.stringify(highlightObj),this.productId)
          .subscribe(res => {

            let tempCount = 0;
            if(productImagesObj.image1 !== null){
              tempCount++;
            }

            if(productImagesObj.image2 !== null){
              tempCount++;
            }

            if(productImagesObj.image3 !== null){
              tempCount++;
            }

            if(tempCount === 1){
              if(productImagesObj.image1 === null){
                if(productImagesObj.image2 !== null){
                  productImagesObj.image1 = productImagesObj.image2;
                  productImagesObj.image1Type = productImagesObj.image2Type;
                }else{
                  productImagesObj.image1 = productImagesObj.image3;
                  productImagesObj.image1Type = productImagesObj.image3Type;
                }
              }
              this.offerService.submitOneImage(productImagesObj,this.productId)
              .subscribe(res2 => {
                this.router.navigateByUrl('/market');
              });
            }else if(tempCount === 2){
              if(productImagesObj.image1 === null){
                if(productImagesObj.image2 !== null){
                  productImagesObj.image1 = productImagesObj.image3;
                  productImagesObj.image1Type = productImagesObj.image3Type;
                }else{
                  productImagesObj.image1 = productImagesObj.image3;
                  productImagesObj.image1Type = productImagesObj.image3Type;
                }
              }else{
                if(productImagesObj.image2 === null){
                  productImagesObj.image2 = productImagesObj.image3;
                  productImagesObj.image2Type = productImagesObj.image3Type;
                }
              }
              this.offerService.submitTwoProductImages(productImagesObj,this.productId)
              .subscribe(res2 => {
                this.router.navigateByUrl('/market');
              });
            }else{
              this.offerService.submitThreeProductImages(productImagesObj,this.productId)
              .subscribe(res2 => {
                this.router.navigateByUrl('/market');
              });
            }
          });
        });

      }
    }
  }

  formatPrice(price: number):string{
    if(price !== null){
      price = Math.abs(Math.floor(price));
      let priceStr:string = '';

      if(price < 1000){
        return '$' + price;
      }else if(price >= 1000 && price < 1000000){
        priceStr = price.toString();
        return '$' + priceStr.substring(0,4) + ',' + priceStr.substring(4);
      }else if(price >= 1000000 && price < 10000000){
        priceStr = price.toString();
        return '$' + priceStr.substring(0,1) + ',' + priceStr.substring(1,4) + ',' + priceStr.substring(4);
      }else if(price >= 10000000 && price < 100000000){
        priceStr = price.toString();
        return '$' + priceStr.substring(0,2) + ',' + priceStr.substring(2,5) + ',' + priceStr.substring(5);
      }else if(price >= 100000000 && price < 1000000000){
        priceStr = price.toString();
        return '$' + priceStr.substring(0,3) + ',' + priceStr.substring(3,6) + ',' + priceStr.substring(6);
      }else if(price >= 1000000000 && price < 1000000000000){
        priceStr = price.toString();
        return '$' + priceStr.substring(0,1) + ',' + priceStr.substring(1,4) + ',' + priceStr.substring(4,7) + ',' + priceStr.substring(7);
      }else{
        return '';
      }
    }else{
      return '';
    }

  }

  updatePrice(val){
    console.log('val: ',val);

    this.askingPrice = val;
    this.priceError = false;
    this.priceErrorMessage();

    if(this.askingPrice >= 1000000000000){
      this.priceError = true;
      this.priceErrorMessage();
    }
  }

  priceErrorMessage(){
    if(this.priceError === true){
      return {
        'border': 'red 1px solid'
      };
    }else{
      return{
        'border': 'none'
      };
    }

  }
}
