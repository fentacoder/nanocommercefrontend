import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from './components/login/login.component'
import {RegisterComponent} from './components/register/register.component'
import {ConverseComponent} from './components/converse/converse.component'
import {CreatePostComponent} from './components/create-post/create-post.component'
import {SpecificPostComponent} from './components/specific-post/specific-post.component'
import {OfferComponent} from './components/offer/offer.component'
import {PurchaseReviewComponent} from './components/purchase-review/purchase-review.component'
import {MarketplaceComponent} from './components/marketplace/marketplace.component'
import {ActivityComponent} from './components/activities/activities.component'
import {ListAllComponent} from './components/list-all/list-all.component'
import {NewsComponent} from './components/news/news.component'
import {SpecificActivityComponent} from './components/specific-activity/specific-activity.component'
import {StrangerProfileComponent} from './components/stranger-profile/stranger-profile.component'
import {UserProfileComponent} from './components/user-profile/user-profile.component'
import {EditProfileComponent} from './components/edit-profile/edit-profile.component'
import {ArticleComponent} from './components/article/article.component'
import {ForgotPasswordComponent} from './components/forgot-password/forgot-password.component'
import {ResetPasswordComponent} from './components/reset-password/reset-password.component'
import {OrderConfirmedComponent} from './components/order-confirmed/order-confirmed.component'
import {ProfileSettingsComponent} from './components/profile-settings/profile-settings.component'
import {PaymentComponent} from './components/payment/payment.component'
import {PaymentFailedComponent} from './components/payment-failed/payment-failed.component'
import {BidRequestSentComponent} from './components/bid-request-sent/bid-request-sent.component'
import {ContactUserComponent} from './components/contact-user/contact-user.component'
import {RecentlyViewedComponent} from './components/recently-viewed/recently-viewed.component'
import { BidListComponent } from './components/bid-list/bid-list.component';
import { RecentlySoldComponent } from './components/recently-sold/recently-sold.component';
import { BidComponent } from './components/bid/bid.component';
import { ShippingAddressComponent } from './components/shipping-address/shipping-address.component';
import { ChatListComponent } from './components/chat-list/chat-list.component';
import { ChatComponent } from './components/chat/chat.component';
import { MessageListComponent } from './components/message-list/message-list.component';
import { SpecificProductComponent } from './components/specific-product/specific-product.component';
import { CreateActivityComponent } from './components/create-activity/create-activity.component';
import { ForumsComponent } from './components/forums/forums.component';
import { TermsComponent } from './components/terms/terms.component';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { ContactComponent } from './components/contact/contact.component';
import { UserSellingComponent } from './components/user-selling/user-selling.component';
import { UserActivitiesComponent } from './components/user-activities/user-activities.component';
import { PayoutErrorComponent } from './components/payout-error/payout-error.component';
import { EditProductComponent } from './components/edit-product/edit-product.component';


const routes: Routes = [
  {path: '', redirectTo: '/exchange', pathMatch: 'full'},
  {path: 'converse', component: ConverseComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'newpost', component: CreatePostComponent},
  {path: 'post/:postId', component: SpecificPostComponent, pathMatch: 'full'},
  {path: 'offer', component: OfferComponent},
  {path: 'purchasereview/:productId', component: PurchaseReviewComponent},
  {path: 'market', component: MarketplaceComponent,pathMatch: 'full'},
  {path: 'market/list/:seeAllStr', component: ListAllComponent, pathMatch: 'full'},
  {path: 'activities', component: ActivityComponent},
  {path: 'activities/list/:seeAllStr', component: ListAllComponent, pathMatch: 'full'},
  {path: 'news', component: NewsComponent},
  {path: 'news/list/:seeAllStr', component: ListAllComponent, pathMatch: 'full'},
  {path: 'activities/activity/:activityId', component: SpecificActivityComponent, pathMatch: 'full'},
  {path: 'profile/stranger/:strangerId', component: StrangerProfileComponent},
  {path: 'profile/user', component: UserProfileComponent, pathMatch: 'full'},
  {path: 'profile/user/edit', component: EditProfileComponent},
  {path: 'news/article/:articleId', component: ArticleComponent, pathMatch: 'full'},
  {path: 'forgotpassword', component: ForgotPasswordComponent},
  {path: 'resetpassword/:resetToken', component: ResetPasswordComponent},
  {path: 'orderconfirmed', component: OrderConfirmedComponent},
  {path: 'profilesettings', component: ProfileSettingsComponent},
  {path: 'payment', component: PaymentComponent},
  {path: 'paymentfailed', component: PaymentFailedComponent},
  {path: 'bidrequestsent', component: BidRequestSentComponent},
  {path: 'contactuser', component: ContactUserComponent,pathMatch: 'full'},
  {path: 'user/viewed',component: RecentlyViewedComponent, pathMatch: 'full'},
  {path: 'user/bids',component: BidListComponent, pathMatch: 'full'},
  {path: 'recentlysold',component: RecentlySoldComponent},
  {path: 'bid/:productId',component: BidComponent},
  {path: 'user/shippingaddress',component: ShippingAddressComponent},
  {path: 'chatlist/:userId',component: ChatListComponent},
  {path: 'chat/:receiverId',component: ChatComponent},
  {path: 'messagelist/:userId',component: MessageListComponent},
  {path: 'products/:productId',component: SpecificProductComponent},
  {path: 'createactivity',component: CreateActivityComponent},
  {path: 'posts/list/:seeAllStr', component: ListAllComponent, pathMatch: 'full'},
  {path: 'faqs',component: ForumsComponent},
  {path: 'terms',component: TermsComponent},
  {path: 'privacypolicy',component: PrivacyPolicyComponent},
  {path: 'contact',component: ContactComponent,pathMatch: 'full'},
  {path: 'user/products',component: UserSellingComponent,pathMatch: 'full'},
  {path: 'user/activities',component: UserActivitiesComponent,pathMatch: 'full'},
  {path: 'payouterror',component: PayoutErrorComponent},
  {path: 'products/edit/:productId',component: EditProductComponent, pathMatch: 'full'},
  {path: '*',redirectTo: '/converse'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
