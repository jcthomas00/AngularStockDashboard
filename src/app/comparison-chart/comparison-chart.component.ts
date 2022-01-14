import { Component, OnInit } from '@angular/core';
import { Stocks } from 'src/Interfaces';
import { DataService } from '../data.service';
import { StockService } from '../stock.service';

@Component({
  selector: 'app-comparison-chart',
  templateUrl: './comparison-chart.component.html',
  styleUrls: ['./comparison-chart.component.scss']
})
export class ComparisonChartComponent implements OnInit {

  constructor(
    private stockService:StockService,
    private dataService:DataService
  ) { }

  stocks:Stocks = <Stocks>{};
  
  ngOnInit(): void {
    this.stockService.getStockHistoricalData().subscribe((response)=>{
      this.stocks = <Stocks>{};
      this.stocks = {
        x:      this.unpackArray(response.data[0].data, "timestamp"),
        close:  this.unpackArray(response.data[0].data, "close"),
        high:   this.unpackArray(response.data[0].data, "high"),
        low:    this.unpackArray(response.data[0].data, "low"),
        open:   this.unpackArray(response.data[0].data, "open"),
        decreasing: {line: {color: '#7F7F7F'}}, 
        increasing: {line: {color: '#17BECF'}}, 
        line: {color: 'rgba(31,119,180,1)'}, 
        type: 'candlestick', 
        xaxis: 'x', 
        yaxis: 'y' 
    }
    })
  }

}
