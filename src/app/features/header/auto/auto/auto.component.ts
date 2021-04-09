import { Component, OnInit } from '@angular/core';
import { DaService } from 'src/app/features/achat/da/services/da.service';
import { AutoService } from '../../services/auto.service';

@Component({
  selector: 'app-auto',
  templateUrl: './auto.component.html',
  styleUrls: ['./auto.component.scss']
})
export class AutoComponent implements OnInit {

  constructor(private auto:AutoService,private _daService:DaService) { }
  ngOnInit() {
    this.auto.syestemePlans();
    this._daService.checkDasReportees().then(res=>{});
  }

}
