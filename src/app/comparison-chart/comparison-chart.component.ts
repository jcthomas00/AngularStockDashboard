import { Component, Input, OnInit } from '@angular/core';
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
  @Input() stocksComparison:any;

  
  ngOnInit(): void {
    this.stockService.getStockHistoricalData().subscribe((response)=>{
      this.stocksComparison = <LineChart>{};
      this.stocksComparison = {
        x:  this.unpackArray(response.data[0].data, "timestamp"),
        y:  this.unpackArray(response.data[0].data, "close"),
        decreasing: {line: {color: '#7F7F7F'}}, 
        increasing: {line: {color: '#17BECF'}}, 
        line: {color: 'orange', line_shape: 'spline'}, 
        type: 'scatter', 
        xaxis: 'x', 
        yaxis: 'y' ,
        mode: 'lines',
        connectgaps: true
    }
    })
    console.log('stocksComparison', this.stocksComparison)
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
      margin: {
        l: 30,
        r: 0,
        b: 50,
        t: 0,
        pad: 0
      },
      yaxis: {
        autorange: true, 
        fixedrange: false,
        showgrid: true,
        zeroline: true,
        showline: false,
        showticklabels: true
      },
      xaxis: {
        autorange: true,   
        showline: false,
        showgrid: false,
        showticklabels: false,
        domain: [0, 1], 
        color: 'pink',
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

  deleteStock(index:number): void {
    this.stocksComparison.splice(index, 1)
  }

}
