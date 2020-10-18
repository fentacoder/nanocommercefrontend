import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css'],
  animations: [
    // Each unique animation requires its own trigger. The first argument of the trigger function is the name
    // trigger('rotatedState', [
    //   state('default', style({ transform: 'rotate(0)' })),
    //   state('rotated', style({ transform: 'rotate(-360deg)' })),
    //   transition('rotated => default', animate('2000ms ease-out')),
    //   transition('default => rotated', animate('2000ms ease-in'))
    // ])
    trigger('rotatedState', [
      state('default', style({ transform: 'rotateY(0)' })),
      state('rotated', style({ transform: 'rotateY(-360deg)' })),
      transition('* <=> *', animate('2000ms'))
    ])
  ]
})
export class LoadingComponent implements OnInit {

  state:string = 'default';
  times = 100;
  counter = 0;

  constructor() { }

  ngOnInit(): void {
    this.rotate();
  }

  rotate() {
    this.state = (this.state === 'default' ? 'rotated' : 'default');
  }

  onDone($event) {
    // call this function at the end of the previous animation.
    // run it as many time as defined
    if (this.counter < this.times) {
      this.state = this.state === 'rotated' ? 'default' : 'rotated';
      this.counter++;
    }
  }
}
