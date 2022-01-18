import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { StockService } from '../stock.service';

@Component({
  selector: 'app-index-chart',
  templateUrl: './index-chart.component.html',
  styleUrls: ['./index-chart.component.scss']
})
export class IndexChartComponent implements OnInit {

  constructor(
    public dataService:DataService,
    private stockService:StockService
  ) { }

  stockIndex:string = 'nasdaq'
  timeframe:number = -1
  startDate:string = '2021-10-01'

  ngOnInit(): void {
  }

  onIndexChange = () => {
    console.log(this.stockIndex)
    if (this.dataService.stockIndex !== this.stockIndex) {
      this.dataService.changeTimeframe(this.timeframe)
      this.stockService.requestHistoricalData([this.dataService.symbol.value], this.dataService.timeframe.value, this.dataService.date.value)
      console.log('onTimeframeChange', this.dataService.symbol.value, this.dataService.timeframe.value, this.dataService.date.value)
    }
  }

}
