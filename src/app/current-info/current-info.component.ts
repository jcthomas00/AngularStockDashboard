import { Component, Input, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-current-info',
  templateUrl: './current-info.component.html',
  styleUrls: ['./current-info.component.scss']
})
export class CurrentInfoComponent implements OnInit {

  constructor(public dataService:DataService) { }

  currentInfo:any;
  up:number = 0;

  ngOnInit(): void {

    // get and display new stats when a change occurs in the data service
    this.dataService.getCurrentStats().subscribe((data:any)=>{
      this.currentInfo = data;
      if(data.close){
        this.up = (data.open.toFixed(2)-data.close.toFixed(2))/data.open;
      }
    })
  }

}
