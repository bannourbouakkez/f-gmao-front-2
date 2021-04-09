//import { Component,OnInit } from '@angular/core'; 
import { MypagesService } from '../mypages.service';

import { Component, OnInit , OnDestroy, ChangeDetectionStrategy } from "@angular/core";
import { timer, of, Observable, Subject, Subscription } from "rxjs";
import { switchMap, takeUntil, tap ,catchError } from "rxjs/operators";
import { DiService } from '../../correctif/services/di.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-myheader',
  templateUrl: './myheader.component.html',
  styleUrls: ['./myheader.component.scss']
})
export class MyheaderComponent  implements OnInit {

  constructor(private mypages:MypagesService,private diService:DiService, private _router:Router) { }
  
  di:number;
  nbDi:number;
  success:boolean;
  
  
  

  private sub1:Subscription;
  // Kill subject to stop all requests for component
  private killTrigger: Subject<void> = new Subject();
  private fetchData$: Observable<any> =  this.mypages.CountDi(); //of("Last inoraati");
  private refreshInterval$: Observable<any> = timer(0,20000).pipe(
    // This kills the request if the user closes the component
    takeUntil(this.killTrigger),
    // switchMap cancels the last request, if no response have been received since last tick
    switchMap(() => this.fetchData$),
    tap( (response : any)=>{
      console.log(response);
      this.nbDi=response.countDi;
      this.success=response.success;
    }),
    // catchError handles http throws
    catchError(error => of("Error"))
  );


  //public statustext$: Observable<any> = this.refreshInterval$;

  notifications=<any>[]; unread_count:number; unview_count:number; private sub2:Subscription;
  alerts=<any>[]; unread_alerts_count:number; unview_alerts_count:number;
  private killTriggerNotif: Subject<void> = new Subject();
  private fetchDataNotifs$: Observable<any> =  this.mypages.mynotifications(); 
  private refreshIntervalNotif$: Observable<any> = timer(0,5000).pipe(
    takeUntil(this.killTriggerNotif),switchMap(() => this.fetchDataNotifs$),tap( (response : any)=>{
      this.notifications=response.notification; this.alerts=response.alerts;
      this.unread_count=response.unread_count; this.unread_alerts_count=response.unread_alerts_count;
      this.unview_count=response.unview_count; this.unview_alerts_count=response.unview_alerts_count;
      console.log(response);
    }),catchError(error => of("Error")));




  /*
  private datanotifs$: Observable<string> =  this.mypages.notifs(); //of("Last inoraati");
  private refreshnotifs$: Observable<string> = timer(0,5000).pipe(
    takeUntil(this.killTrigger), switchMap(() => this.dataSyestemePlans$),catchError(error => of("Error"))
  );
  public retourSyestemePlans$: Observable<string> = this.refreshSyestemePlans$;
  */



 MarkAsRead(read_at,type,id,route:string){

  if(!read_at){
  this.mypages.markAsRead(id).then(res => {
    console.log(res);
  });

  if(type=='notifications'){
  for(let i=0; i<this.notifications.length; i++){
    if(this.notifications[i].id==id){
      this.notifications[i].read_at='vu';
    }
  }
  }
  if(type=='alerts'){
    for(let i=0; i<this.alerts.length; i++){
      if(this.alerts[i].id==id){
        this.alerts[i].read_at='vu';
      }
    }
    }

  }

  if(route){
  this._router.navigate([route]);
  }

 }

 markAsView(type:string){
  
  
  if(type=='notifications' && this.unview_count>0){
  this.unview_count=0;
  this.mypages.markAsView(type).then(res => {
    //console.log(res);
  });
  }
  if(type=='alerts' && this.unview_alerts_count>0){
  this.unview_alerts_count=0;
  this.mypages.markAsView(type).then(res => {
    //console.log(res);
  });
  }
  //setTimeout(this.UnviewCountZero,1000);
 }

 UnviewCountZero(){
  this.unview_count=0;
 }

 ngOnInit() {
  this.mypages.syestemePlans(); 
  this.sub1=this.refreshInterval$.subscribe();
  this.sub2=this.refreshIntervalNotif$.subscribe();
 }


  ngOnDestroy() {
    this.killTrigger.next(); this.sub1.unsubscribe();
    this.killTriggerNotif.next(); this.sub2.unsubscribe();
  }


}
