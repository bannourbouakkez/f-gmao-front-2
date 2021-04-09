import { Component, OnInit } from '@angular/core';
import { DiService } from '../../correctif/services/di.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  constructor(private diService:DiService) { }

  ngOnInit() {
    
    /*
    this.diService.systemePlanAutoToOt(1).then(
      res=>console.log(res),
      err=>console.log(err)
    );
    */
   /*
    this.diService.syestemePlans().then(
      res=>console.log(res),
      err=>console.log(err)
    );
  */
  

    
  }
  
  

}
