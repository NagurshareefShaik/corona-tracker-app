import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { GlobalDataSummary } from 'src/app/models/global-data';
import { DataServiceService } from 'src/app/service/data-service.service';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.css']
})
export class CountriesComponent implements OnInit {
countries:string[]=[];
data :GlobalDataSummary[];
  constructor(private dtaService:DataServiceService) { }

  ngOnInit(): void {
    this.dtaService.getGlobalData().subscribe(result=>{
      this.data=result;
      this.data.forEach(cs=>{
        this.countries.push(cs.country);
      })
    })
  }

}
