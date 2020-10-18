import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule} from '@angular/forms'
import {HttpClientModule,HttpClientXsrfModule} from '@angular/common/http'
import {MatDialogModule} from '@angular/material/dialog'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { SpecificPostComponent } from './components/specific-post/specific-post.component';
import { OfferComponent } from './components/offer/offer.component';
import { PurchaseReviewComponent } from './components/purchase-review/purchase-review.component';
import { MarketplaceComponent } from './components/marketplace/marketplace.component';
import { ListAllComponent } from './components/list-all/list-all.component';
import { NewsComponent } from './components/news/news.component';
import { StrangerProfileComponent } from './components/stranger-profile/stranger-profile.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { ArticleComponent } from './components/article/article.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { OrderConfirmedComponent } from './components/order-confirmed/order-confirmed.component';
import { ProfileSettingsComponent } from './components/profile-settings/profile-settings.component';
import { CartComponent } from './components/cart/cart.component';
import { BidComponent } from './components/bid/bid.component';
import { PaymentComponent } from './components/payment/payment.component';
import { PaymentFailedComponent } from './components/payment-failed/payment-failed.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BidRequestSentComponent } from './components/bid-request-sent/bid-request-sent.component';
import { ContactUserComponent } from './components/contact-user/contact-user.component';
import {FacebookLoginProvider,SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';
import { RecentlyViewedComponent } from './components/recently-viewed/recently-viewed.component';
import { BidListComponent } from './components/bid-list/bid-list.component';
import { UserSellingComponent } from './components/user-selling/user-selling.component';
import { ShippingAddressComponent } from './components/shipping-address/shipping-address.component';
import { RecentlySoldComponent } from './components/recently-sold/recently-sold.component';
import { ChatComponent } from './components/chat/chat.component';
import { ChatListComponent } from './components/chat-list/chat-list.component';
import { MessageListComponent } from './components/message-list/message-list.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { SpecificProductComponent } from './components/specific-product/specific-product.component';
import { SuspendedComponent } from './components/suspended/suspended.component';
import { CreateActivityComponent } from './components/create-activity/create-activity.component';
import { ForumsComponent } from './components/forums/forums.component';
import { TermsComponent } from './components/terms/terms.component';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { ContactComponent } from './components/contact/contact.component';
import { UserActivitiesComponent } from './components/user-activities/user-activities.component';
import { PayoutErrorComponent } from './components/payout-error/payout-error.component';
import { LoadingComponent } from './components/loading/loading.component';
import { ConverseComponent } from './components/converse/converse.component';
import { CreatePostComponent } from './components/create-post/create-post.component';
import { ActivityComponent } from './components/activities/activities.component';
import { SpecificActivityComponent } from './components/specific-activity/specific-activity.component';
import { XsrfInterceptor} from './services/token.service';
import { HTTP_INTERCEPTORS} from '@angular/common/http';
import { EditProductComponent } from './components/edit-product/edit-product.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ConverseComponent,
    NavBarComponent,
    CreatePostComponent,
    SpecificPostComponent,
    OfferComponent,
    PurchaseReviewComponent,
    MarketplaceComponent,
    ActivityComponent,
    ListAllComponent,
    NewsComponent,
    SpecificActivityComponent,
    StrangerProfileComponent,
    UserProfileComponent,
    EditProfileComponent,
    ArticleComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    OrderConfirmedComponent,
    ProfileSettingsComponent,
    CartComponent,
    BidComponent,
    PaymentComponent,
    PaymentFailedComponent,
    BidRequestSentComponent,
    ContactUserComponent,
    RecentlyViewedComponent,
    BidListComponent,
    UserSellingComponent,
    ShippingAddressComponent,
    RecentlySoldComponent,
    ChatComponent,
    ChatListComponent,
    MessageListComponent,
    PaginationComponent,
    SpecificProductComponent,
    SuspendedComponent,
    CreateActivityComponent,
    ForumsComponent,
    TermsComponent,
    PrivacyPolicyComponent,
    ContactComponent,
    UserActivitiesComponent,
    PayoutErrorComponent,
    LoadingComponent,
    EditProductComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    HttpClientXsrfModule.withOptions({
      cookieName: 'XSRF-TOKEN',
      headerName: 'X-CSRF-TOKEN'
    }),
    BrowserAnimationsModule,
    MatDialogModule,
    SocialLoginModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: XsrfInterceptor, multi: true },
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider(''),
          }
        ],
      } as SocialAuthServiceConfig
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
