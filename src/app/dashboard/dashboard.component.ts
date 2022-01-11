import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor() { }
  left = [
    {icon: "fas fa-pencil-alt text-info fa-3x", number: 278, text: "New Posts"},
    {icon: "fas fa-rocket text-danger fa-3x", number: 278, text: "New Projects"},
    {icon: "far fa-user text-success fa-3x", number: 156, text: "New Clients"}
  ]
  right = [
    {icon: "fas fa-chart-line text-success fa-3x", number: 64.89, text: "Bounce Rate"},
    {icon: "fas fa-book-open text-info fa-3x", number: 121, text: "New Rate", progress:{width: 80, class: "progress-bar bg-info"}},
    {icon: "far fa-comments text-warning fa-3x", number: 156, text: "New Comments", progress:{width: 35, class: "progress-bar bg-success"}},
    {icon: "fas fa-mug-hot text-success fa-3x", number: 64.89, text: "New Guests", progress:{width: 60, class: "progress-bar bg-warning"}},
  ]
  drop(event: CdkDragDrop<any[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex);
    }
    console.log(this.left)
    console.log(this.right)
  }
  ngOnInit(): void {
  }

}
