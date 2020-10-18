import { Component, OnInit } from '@angular/core';
import { PostService } from 'src/app/services/post.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent implements OnInit {

  image1:File = null;
  image2:File = null;
  image3:File = null;
  title: string;
  price: number;
  description: string;

  priceError: boolean = false;

  constructor(private postService:PostService,private router:Router) { }

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

  createPost(data){
    let postPrice = '0';
    if(data.price !== null){
      postPrice = this.formatPrice(data.price);
    }

    //add the pictures to the FormData js object and use a service to send the post to the back end
    if(data.title.length > 0 && this.image1 !== null && this.image2 !== null
      && this.image3 !== null && data.description.length > 0){
        console.log('message: ',data.description);

      //post object
      const postObj = {
        authorId: sessionStorage.getItem('userId'),
        title: data.title,
        message: data.description,
        price: postPrice !== '0' ? postPrice : '',
        likes: 0
      };

      //post images
      const postImagesObj = {
        image1: this.image1 !== null ? this.image1 : null,
        image1Type: this.image1 !== null ? this.image1.type.split('/')[1] : null,
        image2: this.image2 !== null ? this.image2 : null,
        image2Type: this.image2 !== null ? this.image2.type.split('/')[1] : null,
        image3: this.image3 !== null ? this.image3 : null,
        image3Type: this.image3 !== null ? this.image3.type.split('/')[1] : null
      };

      this.postService.submitPost(JSON.stringify(postObj),postObj.authorId)
        .subscribe(postId => {
          if(postImagesObj.image1 !== null || postImagesObj.image2 !== null || postImagesObj.image3 !== null){
            let tempCount = 0;
            if(postImagesObj.image1 !== null){
              tempCount++;
            }

            if(postImagesObj.image2 !== null){
              tempCount++;
            }

            if(postImagesObj.image3 !== null){
              tempCount++;
            }

            if(tempCount === 1){
              if(postImagesObj.image1 === null){
                if(postImagesObj.image2 !== null){
                  postImagesObj.image1 = postImagesObj.image2;
                  postImagesObj.image1Type = postImagesObj.image2Type;
                }else{
                  postImagesObj.image1 = postImagesObj.image3;
                  postImagesObj.image1Type = postImagesObj.image3Type;
                }
              }
              this.postService.submitOneImage(postImagesObj,postId)
              .subscribe(res2 => {
                this.router.navigateByUrl('/exchange');
              });
            }else if(tempCount === 2){
              if(postImagesObj.image1 === null){
                if(postImagesObj.image2 !== null){
                  postImagesObj.image1 = postImagesObj.image3;
                  postImagesObj.image1Type = postImagesObj.image3Type;
                }else{
                  postImagesObj.image1 = postImagesObj.image3;
                  postImagesObj.image1Type = postImagesObj.image3Type;
                }
              }else{
                if(postImagesObj.image2 === null){
                  postImagesObj.image2 = postImagesObj.image3;
                  postImagesObj.image2Type = postImagesObj.image3Type;
                }
              }
              this.postService.submitTwoPostImages(postImagesObj,postId)
              .subscribe(res2 => {
                this.router.navigateByUrl('/exchange');
              });
            }else{
              this.postService.submitThreePostImages(postImagesObj,postId)
              .subscribe(res2 => {
                this.router.navigateByUrl('/exchange');
              });
            }
          }

        });
    }
  }

  formatPrice(price: number):string{
    if(price === null){
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
    this.price = val;
    this.priceError = false;
    this.priceErrorMessage();

    if(this.price >= 1000000000000){
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
