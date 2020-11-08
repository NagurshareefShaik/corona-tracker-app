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
  totalConfirmed=0;
  totalActive=0;
  totalDeaths=0;
  totalRecovered=0;
countries:string[]=[];
data :GlobalDataSummary[];
  constructor(private dtaService:DataServiceService) { }

  ngOnInit(): void {
    this.dtaService.getGlobalData().subscribe(result=>{
      this.data=result;
      this.data.forEach(cs=>{
        if(!Number.isNaN(cs.confirmed)){
        this.countries.push(cs.country);
        }
      })
      this.updateValues(this.data[0]['country'])
    })
  }

  updateValues(country){
      this.data.forEach(cs=>{
        if(country==cs.country){
          this.totalConfirmed=cs.confirmed;
          this.totalRecovered=cs.recovered;
          this.totalDeaths=cs.deaths;
          this.totalActive=cs.active;
        }
      })
  }

}
