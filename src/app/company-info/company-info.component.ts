import { Component, OnInit } from '@angular/core';
import { CompanyinfoService } from '../companyinfo.service';
import { DataService } from '../data.service';

@Component({
  selector: 'app-company-info',
  templateUrl: './company-info.component.html',
  styleUrls: ['./company-info.component.scss']
})
export class CompanyInfoComponent implements OnInit {

  info:any = {}
  constructor(private companyInfoService:CompanyinfoService, private dataService:DataService) { }

  ngOnInit(): void {
    
    this.dataService.symbol.subscribe(symbol => {
      if(symbol !== ''){
        this.companyInfoService.getCompanyInfo(symbol).subscribe((info) => {
          this.info = info;
        });
      }
    })
  }

}
