import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
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

  @Input() stockClose:number[]=[];
  @Input() times:string[]=[]
  @Input() comparisonStocks:Stocks[] = []
  stocks!:LineChart;

   ngOnInit(): void {
       this.stocks = <LineChart>{};
       this.updateVals();

  }
  updateVals = () => {
    this.stocks = {
      x:  this.times,
      y:  this.stockClose,
      decreasing: {line: {color: '#7F7F7F'}}, 
      increasing: {line: {color: '#17BECF'}}, 
      line: {color: 'orange', line_shape: 'spline'}, 
      type: 'scatter', 
      xaxis: 'x', 
      yaxis: 'y' ,
      mode: 'lines+markers',
      connectgaps: true
    }
  }
  ngOnChanges() {
    this.updateVals();
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
        showticklabels: true,
        domain: [0, 1], 
        color: 'pink',
      }}
  };

  unpackArray(array:any[], key:string) {
    return array.map(array => array[key]);
  }

}