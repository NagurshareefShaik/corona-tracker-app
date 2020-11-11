import { Component, OnInit } from '@angular/core';
import { DataServiceService } from 'src/app/service/data-service.service';
import { GlobalDataSummary } from 'src/app/models/global-data';
import {formatDate} from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  globalData:GlobalDataSummary[]=[];
  totalConfirmed=0;
  totalActive=0;
  totalDeaths=0;
  totalRecovered=0;
  dataTable=[];
  chartTitle='';
  loading=true;
  chart ={
    PieChart:"PieChart",
    ColumnChart:'ColumnChart',
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

initChart(caseType:string){
  this.dataTable=[];
  // this.dataTable.push(["Country","Cases"])
  this.globalData.forEach(cs=>{
    let value:number;
      if(caseType == 'a'){
        value=cs.active;
        this.chartTitle='Active  Cases';
      }
      if(caseType == 'c'){
        value=cs.confirmed;
        this.chartTitle='Confirmed Cases';
      }
      if(caseType == 'r'){
        value=cs.recovered;
        this.chartTitle='Recovered Cases';
      }
      if(caseType == 'd'){
        value=cs.deaths;
        this.chartTitle='Deaths';
      }
    this.dataTable.push([cs.country,value])
  })
}

  ngOnInit(): void {
    this.getGlobalDataForTrack(this.getCurrentDate(1));
  }

  updateChart(input:HTMLInputElement){
    let caseType:string=input.value;
    this.initChart(caseType);
  }

  getCurrentDate(day:number){
    let currentDate = new Date();
    currentDate.setDate(currentDate.getDate() -day);
    let beforeDayFormatter=formatDate(currentDate, 'MM-dd-yyyy', 'en');
    return beforeDayFormatter;
  }

  getGlobalDataForTrack(beforeDayFormatter){
    this.dataService.getGlobalData(beforeDayFormatter).subscribe({
      next :(result)=>{
        this.globalData=result;
        result.forEach(cs => {
          if(!Number.isNaN(cs.confirmed)){
          this.totalConfirmed +=cs.confirmed;
          this.totalActive +=cs.active;
          this.totalDeaths +=cs.deaths;
          this.totalRecovered +=cs.recovered;
        }
        })
        this.initChart('c');
      },
      error:()=>{
        this.getGlobalDataForTrack(this.getCurrentDate(2));
      },
      complete:()=>{
        this.loading=false;
      }
    })
    
  }
}
