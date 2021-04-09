import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
} from '@angular/core';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
  format,
  startOfMonth,
  startOfWeek,
  endOfWeek
} from 'date-fns';
import { Subject, Observable } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarDateFormatter,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
  DAYS_OF_WEEK,
  CalendarEvent,
  CalendarEventTitleFormatter
} from 'angular-calendar';
import { CustomEventTitleFormatter } from '../custom-event-title-formatter.provider';
//import { colors } from '../demo-utils/colors';

import { CustomDateFormatter } from '../custom-date-formatter.provider';

import { map } from 'rxjs/operators';
import { HttpParams } from '@angular/common/http';
import { DiService } from '../../services/di.service';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { CorrDiPlanComponent } from '../../di/corr-di-plan/corr-di-plan.component';
import { CorrDiAffComponent } from '../../di/corr-di-aff/corr-di-aff.component';


const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};

interface Di {
  PlanID: number;
  di_id: number;
  anomalie: string;
  date: string;
  type:string;
  //time:string;
}

function getTimezoneOffsetString(date: Date): string {
  const timezoneOffset = date.getTimezoneOffset();
  const hoursOffset = String(
    Math.floor(Math.abs(timezoneOffset / 60))
  ).padStart(2, '0');
  const minutesOffset = String(Math.abs(timezoneOffset % 60)).padEnd(2, '0');
  const direction = timezoneOffset > 0 ? '-' : '+';

  return `T00:00:00${direction}${hoursOffset}:${minutesOffset}`;
}

@Component({
  selector: 'mwl-demo-component',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './corr-calender-plan.component.html',
  styleUrls: ['./corr-calender-plan.component.scss'],
  providers: [
    {
      provide: CalendarDateFormatter,
      useClass: CustomDateFormatter,
    }
    
    /*{
      provide: CalendarEventTitleFormatter,
      useClass: CustomEventTitleFormatter
    }*/
  ]
})
export class CorrCalenderPlanComponent {

  

  PlanifierLabel='<i class="pg-icon md-18 calender-btn">flash</i>';
  ExecuterLabel='<i class="pg-icon md-18 calender-btn">calendar</i>';

  view: CalendarView = CalendarView.Month;

  viewDate: Date = new Date();

  events$: Observable<CalendarEvent<{ di: Di }>[]>;

  activeDayIsOpen: boolean = false;

  refresh: Subject<any> = new Subject(); // ma 3amlit chay -_- 

  // -- 

  locale: string = 'fr';

  weekStartsOn: number = DAYS_OF_WEEK.MONDAY;

  weekendDays: number[] = [DAYS_OF_WEEK.FRIDAY, DAYS_OF_WEEK.SATURDAY];

  CalendarView = CalendarView; // ?
  // ## 

  showMarker=false;

 

  constructor(private diService:DiService,private matDialog: MatDialog) {}

  ngOnInit(): void {
    this.fetchEvents();
  }

  setView(view: CalendarView) { // ?
    this.view = view;
  }

  fetchEvents(): void {
    const getStart: any = {
      month: startOfMonth,
      week: startOfWeek,
      day: startOfDay,
    }[this.view];

    const getEnd: any = {
      month: endOfMonth,
      week: endOfWeek,
      day: endOfDay,
    }[this.view];

    const params = new HttpParams()
      .set(
        'primary_release_date.gte',
        format(getStart(this.viewDate), 'yyyy-MM-dd')
      )
      .set(
        'primary_release_date.lte',
        format(getEnd(this.viewDate), 'yyyy-MM-dd')
      )
      .set('api_key', '0ec33936a68018857d727958dca1424f');

    const body={ 'datestart':format(getStart(this.viewDate), 'yyyy-MM-dd'), 
                 'dateend': format(getEnd(this.viewDate), 'yyyy-MM-dd')
    };

    //  this._itemService.getItem(id).subscribe( res => { 
    this.events$ = this.diService.getEventsPlans(body)
    //.subscribe(res=>{console.log(res)})
    
      // .get('https://api.themoviedb.org/3/discover/movie', { params })
      
      .pipe(
          //map(({ results }: { results: any[] }) => {
          map(results => {
         
          //console.log(results);
          return results.map((di: any) => {
            return {
              title: '<b>'+di.time.slice(0,-3)+'</b> '+di.anomalie,
              start: new Date( di.datetime
                //di.date + getTimezoneOffsetString(this.viewDate)
              ),
              color: this.PickColor(di.type),
              allDay: true,
              meta: {
                di,
              },
              actions: [
                {
                  //label: '<span> Edit </span>',
                  //label: '<span> (E) </span>',
                  //label: '<svg class="bi bi-pencil-square" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/><path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/></svg>',
                

                  label:this.PlanifierLabel,
                  onClick: ({ event }: { event: CalendarEvent }): void => {
                    //this.deplanifierDi(event.meta.di.PlanID);
                    this.executerPlan(event.meta.di.PlanID,0);
                    //this.events$ = this.events$.filter((iEvent) => iEvent !== event.meta);
                    //console.log();
                  },

                },
                {
                  label:this.ExecuterLabel,
                  onClick: ({ event }: { event: CalendarEvent }): void => {
                    this.planifierDi(event.meta.di.PlanID,event.meta.di.di_id);
                    //this.deplanifierDi(event.meta.di.PlanID);
                  },

                }
              
              ]
            

            };
          });
        })
      );
      
      this.events$.subscribe(res=>{console.log('res2:');console.log(res);});

      //.subscribe(res=>{console.log('res:');console.log(res);})
      
      this.closeOpenMonthViewDay();
  }

  dayClicked({
    date,
    events,
  }: {
    date: Date;
    events: CalendarEvent<{ di: Di }>[];
  }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
        this.viewDate = date;
      }
    }
  }

  eventClicked(event: CalendarEvent<{ di: Di }>): void {

    this.AfficherPlan(event.meta.di.di_id);
    //this.planifierDi(event.meta.di.PlanID,event.meta.di.di_id);
    /*
    window.open(
      `https://www.themoviedb.org/movie/${event.meta.di.PlanID}`,
      '_blank'
    );
    */


  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  planifierDi(PlanID:number,DiID:number){
    
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = "500px";
    dialogConfig.data={PlanID,DiID};
    this.matDialog.open(CorrDiPlanComponent, dialogConfig)
    .afterClosed().subscribe( res=> {
      if( res != undefined && res!=null  ){
        console.log(res);
       // =<Observable>[];
       // this.events$=new Observable<CalendarEvent<{di: Di;}>[]>();
        //this.events$=null;
        this.fetchEvents();
        this.refresh.next();
        //console.log('res of planifierDi of CorrDiListComponent:'+res);
        //this.ChangerStatutAddIDAfterAction(res.PlanID,DiID,'planifie');
      }
    });

}

deplanifierDi(PlanID:number){
  this.diService.deplanifierDi(PlanID).then(
    res=>{ 
       console.log(res); 
       //this.events$=null;
       this.fetchEvents();
       this.refresh.next();
       //this.ChangerStatutAddIDAfterAction(null,);
       },
    err=>console.log(err)
  );
}

openDI(DiID:number){
  
  const dialogConfig = new MatDialogConfig();
      dialogConfig.panelClass="custom-dialog-container";
      dialogConfig.autoFocus = true;
      dialogConfig.width = "80%";
      dialogConfig.data=DiID;
      this.matDialog.open(CorrDiAffComponent, dialogConfig)
      .afterClosed().subscribe( res=> {});
  
}

AfficherPlan(DiID:number){
  //console.log('Affichage Plan :'+PlanID);
  this.openDI(DiID);
}

executerPlan(PlanID:number,i:number){

  this.diService.executerPlan(PlanID).then(
    res=>{
     if(res.success){
        //this.plans[i].isExecuted=1;
        //this.plans[i].otid=res.ot.OtID;
          this.fetchEvents();
          this.refresh.next();
          
          
        
         //event.meta.di.PlanID
        // this.events$ = this.events$.filter(d => d.PlanID !== PlanID);
        //{ event }: { event: CalendarEvent }
         //this.events$ = this.events$.filter((iEvent) => iEvent !== event);

       

     } 
     

    },
    err=>console.log(err)
  );
 }


  PickColor(type){
   if(type=='manu'){return  colors.yellow;}
   if(type=='auto'){return  colors.blue;}
  }
 


  /*
  date11: Date = new Date(2020,5,11, 15, 0, 0, 0);  
  date12: Date = new Date(2020,5,11, 16, 30, 0, 0);  

  date21: Date = new Date(2020,5,12, 16, 30, 0, 0);  
  date22: Date = new Date(2020,5,12, 16, 30, 0, 0);  

  date31: Date = new Date(2020,5,13, 16, 30, 0, 0);  
  date32: Date = new Date(2020,5,13, 16, 30, 0, 0);  

  date41: Date = new Date(2020,5,14, 16, 30, 0, 0);  
  date42: Date = new Date(2020,5,14, 16, 30, 0, 0);  

  date51:  Date = new Date(2020,5,12, 16, 35, 0, 0);  

  date71:  Date = new Date(2020,6,5, 16, 35, 0, 0);  
  date72:  Date = new Date(2020,6,6, 18, 35, 0, 0);  


  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"> E </i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"> D </i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
        this.handleEvent('Deleted', event);
      },
    },
  ];

  refresh: Subject<any> = new Subject();

  events: CalendarEvent[] = [
    {
      start: this.date11 , //subDays(startOfDay(new Date()), 1),
      end: this.date11, //addDays(new Date(), 1),
      title: 'A 3 day event 111',
      color: colors.red,
      actions: this.actions,
      allDay: true,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
      draggable: true,
    }
    
    ,
    {
      start: this.date21,//startOfDay(new Date()),
      title: 'An event with no end date 222',
      color: colors.yellow,
      actions: this.actions,
    },
    {
      start: this.date51,//startOfDay(new Date()),
      title: 'An event with no end date 222',
      color: colors.yellow,
      actions: this.actions,
    },
    {
      start: this.date31,//subDays(endOfMonth(new Date()), 3),
      end: this.date32,//addDays(endOfMonth(new Date()), 3),
      title: 'A long event that spans 2 months 333',
      color: colors.blue,
      allDay: true,
    },
    {
      start: this.date41,//addHours(startOfDay(new Date()), 2),
      end: this.date42,//addHours(new Date(), 2),
      title: 'A draggable and resizable event 444',
      color: colors.yellow,
      actions: this.actions,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
      draggable: true,
    }
    
  ];

  activeDayIsOpen: boolean = true;

  constructor(private modal: NgbModal) {}

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: 'lg' });
  }

  addEvent(): void {
    this.events = [
      ...this.events,
      {
        title: 'New event',
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
        color: colors.red,
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
      },
    ];
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter((event) => event !== eventToDelete);
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    console.log(this.viewDate.getMonth());
    this.events=[
    {
      start: this.date71,//startOfDay(new Date()),
      title: '1111111111111',
      color: colors.yellow,
      actions: this.actions,
    },
    {
      start: this.date72,//startOfDay(new Date()),
      title: '22222222222222',
      color: colors.yellow,
      actions: this.actions,
    }
    ];

    this.activeDayIsOpen = false;
  }

*/


}
