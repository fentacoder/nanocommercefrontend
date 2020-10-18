import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth-service.service';

@Component({
  selector: 'app-user-activities',
  templateUrl: './user-activities.component.html',
  styleUrls: ['./user-activities.component.css']
})
export class UserActivitiesComponent implements OnInit {

  itemList: any[] = [];

  constructor(private router:Router,private userService:AuthService) { }

  ngOnInit(): void {
    if(sessionStorage.getItem('userId')?.length <= 4 || sessionStorage.getItem('userId')?.length === undefined){
      this.router.navigateByUrl('/login');
    }

    this.userService.grabUserActivities(JSON.stringify({hostId: sessionStorage.getItem('userId')}))
      .subscribe(activities => {
        activities.forEach((activity,idx) => {

          this.itemList.push({
            displayId: idx,
            id: activity?.id,
            title: `You hosted activity: ${activity?.title}`,
            timeStamp: activity?.createdAt
          });
        });
      });
  }

}
