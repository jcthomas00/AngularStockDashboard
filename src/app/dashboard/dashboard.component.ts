import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { DataService } from '../data.service';
import { StockService } from '../stock.service';
import { UserService } from '../user.service';
import { AuthService } from '../auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  query:string = ''

  
  symbols:string[] = ['AAPL', 'TSLA', 'NVDA', 'JPM', 'BAC','NBR', 'GOOG', 'AXP', 'COF', 'WFC', 'MSFT', 'FB', 'AMZN', 'GS', 'MS', 'V', 'GME', 'NFLX', 'KO', 'JNJ', 'CRM', 'PYPL', 'XOM', 'HD', 'DIS', 'INTC', 'COP', 'CVX', 'SBUX', 'OXY', 'WMT', 'MPC', 'SLB', 'PSX', 'VLO']
  timeframe:number = 5
  startDate:string = '2022-01-01'

  constructor(
    public dataService:DataService,
    private stockService:StockService,
    private userService:UserService,
    private authService:AuthService
    ) { }

  leftBar = [1,];
  rightBar = [2,3];
  favorites:string[] = [];

  drop(event: CdkDragDrop<any[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex);
    }
    this.userService.setUserData({leftBar: this.leftBar, rightBar: this.rightBar, favorites: ['AAPL']})
    console.log(this.leftBar)
    console.log(this.rightBar)

  }
  ngOnInit(): void {
    this.authService.getUser().subscribe(user => {
      if(user){
        this.userService.getUserData(user.uid).subscribe(userInfo=>{
          this.leftBar = userInfo.leftBar; 
          this.rightBar = userInfo.rightBar;
          this.favorites =  userInfo.favorites
          console.log("lefty: ",this.leftBar)
        })
      }
    });
  }

  onSelectStock(newSymbol:string) {
    this.query = ''
    console.log(newSymbol, this.timeframe, this.startDate)
    if (this.dataService.symbol.value !== newSymbol) {
      this.dataService.changeSymbol(newSymbol)
      this.stockService.requestHistoricalData([this.dataService.symbol.value], this.dataService.timeframe.value, this.dataService.date.value)
      console.log('onSymbolChange', this.dataService.symbol.value, this.dataService.timeframe.value, this.dataService.date.value)
    }
  }

  onDateChange() {
    console.log(this.startDate)
    if (this.dataService.date.value !== this.startDate) {
      this.dataService.changeDate(this.startDate)
      this.stockService.requestHistoricalData([this.dataService.symbol.value], this.dataService.timeframe.value, this.dataService.date.value)
      console.log('onDateChange', this.dataService.symbol.value, this.dataService.timeframe.value, this.dataService.date.value)
    }
  }

  onTimeframeChange() {
    console.log(this.timeframe)
    if (this.dataService.timeframe.value !== this.timeframe) {
      this.dataService.changeTimeframe(this.timeframe)
      this.stockService.requestHistoricalData([this.dataService.symbol.value], this.dataService.timeframe.value, this.dataService.date.value)
      console.log('onTimeframeChange', this.dataService.symbol.value, this.dataService.timeframe.value, this.dataService.date.value)
    }
  }

  login = () =>{
    this.authService.login();
  }
  logout = () =>{
    this.authService.logout();
  }
  getUser = ():Observable<any> =>{
    return this.authService.getUser();
  }
}
