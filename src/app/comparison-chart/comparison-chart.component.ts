import { Component, Input, OnInit } from '@angular/core';
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
    public dataService:DataService,
    private stockService:StockService
  ) { }

  @Input() initialStock = <Stocks>{};
  @Input() comparisonStocks:Stocks[] = []
  @Input () stocks:Stocks[] = [];
  query:string = ''
  symbols:string[] = ['AAPL', 'TSLA', 'BAC'];
  timeframe:number = -1
  startDate:string = '2021-01-01'

  ngOnInit(): void {
    //this.comparisonStocks.push(this.initialStock)
    console.log('check here', this.comparisonStocks)
  }

  onSelectStock = (newSymbol:string) => {
    this.query = ''
    if (this.dataService.symbol.value !== newSymbol) {
     // this.stockService.requestHistoricalData([this.dataService.symbol.value], this.dataService.timeframe.value, this.dataService.date.value)
      this.retrieveStockData(newSymbol)
    }
  }

  retrieveStockData = (newSymbol:string) =>{
    this.stockService.requestHistoricalData([newSymbol], this.dataService.timeframe.value, this.dataService.date.value)
    this.stockService.getStockHistoricalData().subscribe((response)=>{
     this.stocks = this.stocks.filter(stock => stock.symbol !== newSymbol);

      response.data[0].data.sort((a:any,b:any) => {
        if(new Date(a.timestamp) > new Date(b.timestamp)){return 1}
        else if(new Date(a.timestamp) < new Date(b.timestamp)){return -1}
        else return 0;
      });

      console.log('response data', response.data)

      if(newSymbol === response.data[0].symbol){
        this.comparisonStocks.push({
          symbol: newSymbol,
          x:      this.unpackArray(response.data[0].data, "timestamp"),
          close:  this.convertUnpackedArray(response.data[0].data, "close"),
          high:   this.unpackArray(response.data[0].data, "high"),
          low:    this.unpackArray(response.data[0].data, "low"),
          open:   this.unpackArray(response.data[0].data, "open"),
          decreasing: {line: {color: '#7F7F7F'}}, 
          increasing: {line: {color: '#17BECF'}}, 
          line: {color: 'rgba(31,119,180,1)'}, 
          type: 'candlestick', 
          xaxis: 'x', 
          yaxis: 'y' 
        })
      }
  })
  console.log('comparison', this.comparisonStocks)
}

  unpackArray = (array:any[], key:string) => {
    return array.map(array => array[key]);
  }

  convertUnpackedArray = (array:any[], key:string) => {
    let initial = array[0][key]
    return array.map(array => (array[key]-initial)/initial);
  }

  deleteStock(index:number): void {
    this.comparisonStocks.splice(index, 1)
  }
}
