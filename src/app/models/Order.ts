export class Order{
  id:string;
  userId:string;
  stripeOrderId:string;
  paypalOrderId:string;
  productId:string;
  activityId:string;
  bidAmount:string;
  processingFee:string;
  shippingFee:string;
  totalPrice:string;
  confirmed:number;
  orderedAt:string;
}
