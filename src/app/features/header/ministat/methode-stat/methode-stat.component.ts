import { Component, OnInit , OnDestroy, ChangeDetectionStrategy} from '@angular/core';
import { MinistatService } from '../../services/ministat.service';
import { timer, of, Observable, Subject, Subscription } from "rxjs";
import { switchMap, takeUntil, tap ,catchError } from "rxjs/operators";


@Component({
  selector: 'app-methode-stat',
  templateUrl: './methode-stat.component.html',
  styleUrls: ['./methode-stat.component.scss']
})
export class MethodeStatComponent implements OnInit {

  constructor(private ministat:MinistatService) { }

  di:number;
  nbDi:number;
  success:boolean;

  ngOnInit() {
    this.sub1=this.refreshInterval$.subscribe();
  }


  
  private sub1:Subscription;
  // Kill subject to stop all requests for component
  private killTrigger: Subject<void> = new Subject();
  private fetchData$: Observable<any> =  this.ministat.CountDi(); //of("Last inoraati");
  private refreshInterval$: Observable<any> = timer(0,30000).pipe(
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

  ngOnDestroy() {
    this.killTrigger.next(); this.sub1.unsubscribe();
  }

}
