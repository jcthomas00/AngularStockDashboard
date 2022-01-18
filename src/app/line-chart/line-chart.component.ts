import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { from } from 'rxjs';
import { LineChart } from 'src/Interfaces';
import { Stocks } from 'src/Interfaces';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent implements OnInit {
  dataService: any;
  stockService: any;

  constructor() { }

  @Input() chartData:LineChart[] = [];
  @Input() comparisonStocks:Stocks[] = []
  stocks!:LineChart;
  data:LineChart[] = []

   ngOnInit(): void {
    this.stocks = <LineChart>{};
    //this.updateVals();
  }

  // updateVals = () => {
  //   this.data = []
  //   this.comparisonStocks.forEach(element => {
  //     console.log("x:",  element.close)
  //     this.stocks = {
  //       x:  element.x,
  //       y:  element.close,
  //       decreasing: {line: {color: '#7F7F7F'}}, 
  //       increasing: {line: {color: '#17BECF'}}, 
  //       line: {color: 'orange', line_shape: 'spline'}, 
  //       type: 'scatter', 
  //       xaxis: 'x', 
  //       yaxis: 'y' ,
  //       mode: 'lines',
  //       connectgaps: true
  //     }
  //     this.data.push(this.stocks)
  //   })
  //   this.data[0].x = this.data[0].x.slice();
  // }
  // updateVals = () => {
  //   this.stocks = {
  //     x:  this.times,
  //     y:  this.stockClose,
  //     decreasing: {line: {color: '#7F7F7F'}}, 
  //     increasing: {line: {color: '#17BECF'}}, 
  //     line: {color: 'orange', line_shape: 'spline'}, 
  //     type: 'scatter', 
  //     xaxis: 'x', 
  //     yaxis: 'y' ,
  //     mode: 'lines+markers',
  //     connectgaps: true
  //   }
  //   this.data.push(this.stocks)
  // }

  ngOnChanges() {
    console.log("cha-cha", this.chartData)
   //this.updateVals();
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
        zeroline: false,
        showline: false,
        showticklabels: true
      },
      xaxis: {
        autorange: false,   
        showline: false,
        showgrid: false,
        showticklabels: false,
        domain: [0, 1], 
        color: 'pink',
        range: ['2021-01-01', '2022-01-17'],
        type: 'date'
      }}
  };
}