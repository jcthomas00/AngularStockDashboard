import { Component, OnInit } from '@angular/core';
import { CompanyinfoService } from '../companyinfo.service';

@Component({
  selector: 'app-company-info',
  templateUrl: './company-info.component.html',
  styleUrls: ['./company-info.component.scss']
})
export class CompanyInfoComponent implements OnInit {

  constructor(private companyInfoService:CompanyinfoService) { }

  ngOnInit(): void {
    this.companyInfoService.getCompanyInfo('AAPL').subscribe((data) => {
      console.log('company info', data)
    })
  }

}
