import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-comparison-chart',
  templateUrl: './comparison-chart.component.html',
  styleUrls: ['./comparison-chart.component.scss']
})
export class ComparisonChartComponent implements OnInit {

  constructor() { }

  @Input() comparisonStocks:string[] = []

  ngOnInit(): void {
  }

}
