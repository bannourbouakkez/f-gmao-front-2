import { Component, Input ,OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {

  
  @Input() breadcrumbs:any[];  
  @Input() autres:any[];  
  //@Input() home:any;

  constructor(private _router:Router) { }

  navigate(url:string){
   this._router.navigate([url]);
  }

  ngOnInit(){
    this._router.routeReuseStrategy.shouldReuseRoute =() => {return false;}
  }

}
