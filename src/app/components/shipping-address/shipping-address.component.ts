import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth-service.service';

@Component({
  selector: 'app-shipping-address',
  templateUrl: './shipping-address.component.html',
  styleUrls: ['./shipping-address.component.css']
})
export class ShippingAddressComponent implements OnInit {

  street:string;
  additionalInfo:string;
  city:string;
  state:string;
  zipCode:string;
  addressPresent:boolean = false;

  constructor(private router:Router, private userService:AuthService) { }

  ngOnInit(): void {
    if(sessionStorage.getItem('userId')?.length <= 4 || sessionStorage.getItem('userId')?.length === undefined){
      this.router.navigateByUrl('/login');
    }

    this.userService.grabAddress(JSON.stringify({id: sessionStorage.getItem('userId')}))
      .subscribe(address => {
        if(address?.street.length > 0){
          this.street = address.street;
          this.additionalInfo = address.additionalInfo;
          this.city = address.city;
          this.state = address.state;
          this.zipCode = address.zipCode;
          this.addressPresent = true;
        }
      });
  }

  submitAddress(data){
    if(data.street.length > 0 && data.city.length > 0
      && data.state.length > 0 && data.zipCode.length > 0){
        const addressObj = {
          userId: sessionStorage.getItem('userId'),
          street: data.street,
          additionalInfo: data.additionalInfo.length > 0 ? data.additionalInfo : '',
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
          addressPresent: this.addressPresent ? 'true' : 'false'
        };

        this.userService.submitAddress(JSON.stringify(addressObj))
          .subscribe(resNum => {
            if(resNum === 1){
              console.log('success');
              this.router.navigateByUrl('/profilesettings');
            }else{
              this.router.navigateByUrl('/profilesettings');
            }
          });
      }
  }

}
