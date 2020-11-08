import { Component, OnInit } from '@angular/core';
import { DataServiceService } from 'src/app/service/data-service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  totalConfirmed=0;
  totalActive=0;
  totalDeaths=0;
  totalRecovered=0;
  constructor(private dataService:DataServiceService) { }

  ngOnInit(): void {
    this.dataService.getGlobalData().subscribe({
      next :(result)=>{
        result.forEach(cs => {
          if(!Number.isNaN(cs.confirmed)){
          this.totalConfirmed +=cs.confirmed;
          this.totalActive +=cs.active;
          this.totalDeaths +=cs.deaths;
          this.totalRecovered +=cs.recovered;
        }
        })
      }
    })
  }

}
