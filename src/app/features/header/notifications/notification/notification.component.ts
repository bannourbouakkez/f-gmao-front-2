import { Component, OnInit , OnDestroy, ChangeDetectionStrategy} from '@angular/core';
import { Router } from '@angular/router';
import { NotifService } from '../../services/notif.service';
import { timer, of, Observable, Subject, Subscription } from "rxjs";
import { switchMap, takeUntil, tap ,catchError } from "rxjs/operators";


@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

  constructor(private _router:Router,private notif:NotifService) { }

  ngOnInit() {
    //console.log('zabbb');
    this.sub=this.refreshIntervalNotif$.subscribe();
    this._router.routeReuseStrategy.shouldReuseRoute =() => {return false;}

  }

  notifications=<any>[]; unread_count:number; unview_count:number; private sub:Subscription;
  alerts=<any>[]; unread_alerts_count:number; unview_alerts_count:number;
  private killTriggerNotif: Subject<void> = new Subject();
  private fetchDataNotifs$: Observable<any> =  this.notif.mynotifications(); 
  private refreshIntervalNotif$: Observable<any> = timer(0,30000).pipe(
    takeUntil(this.killTriggerNotif),switchMap(() => this.fetchDataNotifs$),tap( (response : any)=>{
      this.notifications=response.notification; this.alerts=response.alerts;
      this.unread_count=response.unread_count; this.unread_alerts_count=response.unread_alerts_count;
      this.unview_count=response.unview_count; this.unview_alerts_count=response.unview_alerts_count;
      console.log(response);
    }),catchError(error => of("Error")));

    

 MarkAsRead(read_at,type,id,route:string){

  if(!read_at){
  this.notif.markAsRead(id).then(res => {
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
  this.notif.markAsView(type).then(res => {
    //console.log(res);
  });
  }
  if(type=='alerts' && this.unview_alerts_count>0){
  this.unview_alerts_count=0;
  this.notif.markAsView(type).then(res => {
    //console.log(res);
  });
  }
  //setTimeout(this.UnviewCountZero,1000);
 }


  
  ngOnDestroy() {
    this.killTriggerNotif.next(); this.sub.unsubscribe();
  }

}
