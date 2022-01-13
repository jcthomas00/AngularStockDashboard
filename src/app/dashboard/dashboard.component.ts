import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { DataService } from '../data.service';
import { StockService } from '../stock.service';

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
    private dataService:DataService,
    private stockService:StockService
    ) { }

  leftBar = [0,1,2];
  rightBar = [2,3,4,5,1];
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
    console.log(this.leftBar)
    console.log(this.rightBar)
  }
  ngOnInit(): void {
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
}
