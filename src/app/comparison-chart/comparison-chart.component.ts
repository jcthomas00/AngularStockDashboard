import { Component, Input, OnInit } from '@angular/core';
import { LineChart, Stocks } from 'src/Interfaces';
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

  @Input() comparisonStocks:Stocks[] = []
  @Input () stocks:Stocks[] = [];

  query:string = ''
  symbols:string[] = [];
  
  stocksToCompare:Stocks[] = [];
  chartData:LineChart[] = [];
  color:string[] = []

  ngOnInit(): void {
    this.stockService.getStockList().subscribe(list => {
      this.symbols = list.symbols;
    });
    this.dataService.getcomparisonSymbols().subscribe(symbols => {
      this.stocksToCompare = []; 
      symbols.forEach(sym => {
        setTimeout(() => {
          const stockToPush = this.stocks.filter((stock) => stock.symbol===sym)[0];
          let initialValue = stockToPush.close[0]
          stockToPush.close.forEach((closingVal, index) => {
            stockToPush.close[index] = closingVal//(closingVal-initialValue)/initialValue
          })
          this.stocksToCompare.push(stockToPush)

          this.chartData = [];
          this.stocksToCompare.forEach((element,index) => {
            this.chartData.push({
              x:  element.x,
              y:  element.close,
              name: element.symbol,
              decreasing: {line: {color: '#7F7F7F'}}, 
              increasing: {line: {color: '#17BECF'}}, 
              line: {line_shape: 'spline'}, 
              type: 'scatter', 
              xaxis: 'x', 
              yaxis: 'y' ,
              mode: 'lines',
              connectgaps: true
            });
          })
        },500)
      })
  })
  }

  onSelectStock = (newSymbol:string) => {
    this.dataService.setcomparisonSymbol(newSymbol)
    this.query = ''
    if (this.dataService.symbol.value !== newSymbol) {
      this.retrieveStockData(newSymbol)
    }
  }

  retrieveStockData = (newSymbol:string) =>{
    this.stockService.requestHistoricalData([newSymbol], this.dataService.timeframe.value, this.dataService.date.value)
  }

  deleteStock(index:number): void {
    console.log('symbol comparison array', this.dataService.symbolComparison.value)
    this.dataService.deletecomparisonSymbol(this.stocksToCompare[index].symbol)
    this.chartData.splice(index, 1)
  }
}