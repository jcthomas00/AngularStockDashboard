import { Component, OnInit } from '@angular/core';
import { LineChart } from 'src/Interfaces';
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

  stocks:LineChart = <LineChart>{};
  
  ngOnInit(): void {
    this.stockService.getStockHistoricalData().subscribe((response)=>{
      this.stocks = <LineChart>{};
      this.stocks = {
        x:      this.unpackArray(response.data[0].data, "timestamp"),
        y:  this.unpackArray(response.data[0].data, "close"),
        decreasing: {line: {color: '#7F7F7F'}}, 
        increasing: {line: {color: '#17BECF'}}, 
        line: {color: 'rgba(31,119,180,1)'}, 
        type: 'line', 
        xaxis: 'x', 
        yaxis: 'y' 
    }
    })
  }

  title = 'comparison-plots';
  // Bar Chart
  graph1 = {
    data: [
      {  
        x: [''],
        y: [''],
    },
    ],
    layout: {
      useResizeHandler: true,
      autosize: true,
      title: 'change',
      margin: 0,
      yaxis: {
        autorange: true, 
        fixedrange: false
      },
      xaxis: {
        autorange: true, 
        domain: [0, 1], 
        color: 'pink',
        title: 'Dates',
        rangebreaks: [
          {
            bounds: ["sat", "mon"] 
          },
          {
            bounds: [16, 9.5], 
            pattern: "hour"
          }
        ]
      }}
  };


  unpackArray(array:any[], key:string) {
    return array.map(array => array[key]);
  }

  hover(event: any): void {
    // this.interactivePlotSubject$.next(
    //   [this.graph2.data[event.points[0].pointIndex]]
    // );
  }
  mouseLeave(event:any): void {
    // this.interactivePlotSubject$.next(this.graph2.data);
  }

}
