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
  dataTableForAll;
  data :GlobalDataSummary[];
  selectedCountDateWise:DateWiseData[];
  dateWiseData;
  loading=true;
  chart ={
    PieChart:"PieChart",
    height:400,
    options: {
      animtion:{
        duration:1000,
        easing:'out',
      },
      is3D:true
    }
  }

  constructor(private dataService:DataServiceService) { }

  ngOnInit(): void {
    this.dataService.getDateWiseData().subscribe({
      next :(result)=>{
        this.dateWiseData=result;
      },complete:()=>{
        this.getGlobalDataForTrack(this.getCurrentDate(1));
      }
  })
    
  }

  getCurrentDate(day:number){
    let currentDate = new Date();
    currentDate.setDate(currentDate.getDate() -day);
    let beforeDayFormatter=formatDate(currentDate, 'MM-dd-yyyy', 'en');
    return beforeDayFormatter;
  }

  getGlobalDataForTrack(beforeDayFormatter){
    this.dataService.getGlobalData(beforeDayFormatter).subscribe({
      next:(result)=>{
      this.data=result;
      this.data.forEach(cs=>{
        if(!Number.isNaN(cs.confirmed)){
        this.countries.push(cs.country);
        }
      })
    },
    error:()=>{
      this.getGlobalDataForTrack(this.getCurrentDate(2));
    },
    complete:()=>{
      this.updateValues(this.data[0]['country']);
      this.initChart(this.data[0]['country']);
      this.loading=false;
    }
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
      this.initChart(country);
  }
  initChart(country:string){
    this.dataTableForAll=[];
    // this.dataTable.push(["Country","Cases"])
    this.data.forEach(cs=>{
      if(cs.country==country){
        // this.dataTableForAll.push(['Confirmed',cs.confirmed]);
        this.dataTableForAll.push(['Recovered',cs.recovered]);
        this.dataTableForAll.push(['Active',cs.active]);
        this.dataTableForAll.push(['Death',cs.deaths]);
      }
    })
  }
}
