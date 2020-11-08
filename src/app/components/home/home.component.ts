import { Component, OnInit } from '@angular/core';
import { DataServiceService } from 'src/app/service/data-service.service';
import { GoogleChartInterface } from 'ng2-google-charts';
import { GlobalDataSummary } from 'src/app/models/global-data';

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
  pieChart: GoogleChartInterface={
    chartType: 'PieChart'
  };
  columnChart: GoogleChartInterface={
    chartType: 'ColumnChart'
  };
  constructor(private dataService:DataServiceService) { }

initChart(caseType:string){
  let dataTable=[];
  dataTable.push(["Country","Cases"])
  this.globalData.forEach(cs=>{
    let value:number;
      if(caseType == 'a'){
        value=cs.active
      }
      if(caseType == 'c'){
        value=cs.confirmed
      }
      if(caseType == 'r'){
        value=cs.recovered
      }
      if(caseType == 'd'){
        value=cs.deaths
      }
    dataTable.push([cs.country,value])
  })
  console.log(dataTable);
  
  this.pieChart= {
    chartType: 'PieChart',
    dataTable: dataTable,
    //firstRowIsData: true,
    options: {
      height:400
    },
  };
  this.columnChart= {
    chartType: 'ColumnChart',
    dataTable: dataTable,
    //firstRowIsData: true,
    options: {
      height:400
    },
  };
}

  ngOnInit(): void {
    this.dataService.getGlobalData().subscribe({
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
      }
    })
  }

  updateChart(input:HTMLInputElement){
    let caseType:string=input.value;
    this.initChart(caseType);
  }
}
