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
    config: {
      displayModeBar: false,
    },
    layout: {
      useResizeHandler: true,
      legend: {orientation: 'h'},
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