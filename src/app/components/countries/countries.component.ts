import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { DateWiseData } from 'src/app/models/data-wise-data';
import { GlobalDataSummary } from 'src/app/models/global-data';
import { DataServiceService } from 'src/app/service/data-service.service';
import {formatDate} from '@angular/common';

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
  dataTable;
  data :GlobalDataSummary[];
  selectedCountDateWise:DateWiseData[];
  dateWiseData;
  loading=false;
  constructor(private dataService:DataServiceService) { }

  ngOnInit(): void {
    this.dataService.getDateWiseData().subscribe(
      (result)=>{
        this.dateWiseData=result;
      }
    )
    this.getGlobalDataForTrack(this.getCurrentDate(1));
  }

  getCurrentDate(day:number){
    let currentDate = new Date();
    currentDate.setDate(currentDate.getDate() -day);
    let beforeDayFormatter=formatDate(currentDate, 'MM-dd-yyyy', 'en');
    return beforeDayFormatter;
  }

  getGlobalDataForTrack(beforeDayFormatter){
    this.dataService.getGlobalData(beforeDayFormatter).subscribe(result=>{
      this.data=result;
      this.data.forEach(cs=>{
        if(!Number.isNaN(cs.confirmed)){
        this.countries.push(cs.country);
        }
      })
      this.updateValues(this.data[0]['country'])
    },
    error=>{
      this.getGlobalDataForTrack(this.getCurrentDate(2));
    })
  }

  updateChart(){
      this.dataTable=[];
      // this.dataTable.push(['Cases','Date'])
      this.selectedCountDateWise.forEach(cs=>{
        this.dataTable.push([cs.cases,cs.date])
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
      this.selectedCountDateWise =this.dateWiseData[country]
      this.updateChart();
  }

}
