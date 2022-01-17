import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Stocks } from 'src/Interfaces';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {

  constructor() {}

  ngOnInit(): void {}
    
  @Input() stockToDisplay:any;

  // Chart configurations
  graph1 = {
    data: [
      {  
        x: [''],
        close: [''],
        high: [''],
        low: [''],
        open: ['']
    },
    ],
    config: {
      responsive: true,
      displaylogo: false,
      showLink: false,
      modeBarButtonsToRemove: ['pan2d','select2d','lasso2d','resetScale2d','toImage','zoom2d']
    },
    layout: {
      useResizeHandler: true,

    paper_bgcolor: 'transparent',
    plot_bgcolor: 'transparent',
      autosize: true,
      title: '',
      margin: {
        l: 50,
        r: 50,
        b: 90,
        t: 0,
      },
      modebar:{
        bgcolor: "transparent",
        activecolor: 'orange'
      },
      yaxis: {
        autorange: true, 
        fixedrange: false,
        tickcolor: "rgba(255,255,255,0)",
        tickwidth: 0,
        
        gridcolor: "rgba(255,255,255,0.25)",
        gridwidth: 1,
        
        zerolinecolor: "green",
        zerolinewidth: 2,
      },
      xaxis: {
        tickcolor: "rgba(255,255,255,0)",
        tickwidth: 0,
        tickformat: '%m/%d/%y %H:%M',
        gridcolor: "rgba(255,255,255,.25)",
        gridwidth: 2, 

        autorange: true, 
        domain: [0, 1], 
        color: 'rgba(255,255,255,.25)',
        //title: 'Dates',
        rangeslider: {visible: false},
        rangebreaks: [
          {
            bounds: ["sat", "mon"] 
          },
          {
            // bounds: [16, 9.5], 
            // pattern: "hour"
          }
        ]
      }}
  };
}
