import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CalendarView } from 'angular-calendar';

@Component({
  selector: 'mwl-demo-utils-calendar-header-i-p',
  template: `
    <div class="row text-center first-letter-upper">
      <div class="col-md-4">
        <div class="btn-group">
          <div
            class="btn btn-primary"
            mwlCalendarPreviousView
            [view]="view"
            [(viewDate)]="viewDate"
            (viewDateChange)="viewDateChange.next(viewDate)"

          >
          Précédent
          </div>
          <div
            class="btn btn-outline-secondary"
            mwlCalendarToday
            [(viewDate)]="viewDate"
            (viewDateChange)="viewDateChange.next(viewDate)"
          >
          Aujourd'hui
          </div>
          <div
            class="btn btn-primary"
            mwlCalendarNextView
            [view]="view"
            [(viewDate)]="viewDate"
            (viewDateChange)="viewDateChange.next(viewDate)"

          >
            Suivant
          </div>
        </div> 
      </div>
      <div class="col-md-4" >

        <!--<h3>{{ viewDate | calendarDate: view + 'ViewTitle':locale }}</h3>-->
        
        <h3>  <div class="first-letter-upper"> {{ viewDate | calendarDate:(view + 'ViewTitle'):locale:weekStartsOn }} </div> </h3>
      </div>
      <div class="col-md-4">
        <div class="btn-group">
          <div
            class="btn btn-primary"
            (click)="viewChange.emit(CalendarView.Month)"
            [class.active]="view === CalendarView.Month"
          >
            Mois
          </div>
          <div
            class="btn btn-primary"
            (click)="viewChange.emit(CalendarView.Week)"
            [class.active]="view === CalendarView.Week"
          >
            Semaine
          </div>
          <!--
          <div
            class="btn btn-primary"
            (click)="viewChange.emit(CalendarView.Day)"
            [class.active]="view === CalendarView.Day"
          >
            Day
          </div>
          -->
        </div>
      </div>
    </div>
   



  `,
  styleUrls: ['./calendar-header-i-p.component.scss']

})
export class CalendarHeaderIPComponent {
  @Input() view: CalendarView;

  @Input() viewDate: Date;

  @Input() locale: string = 'fr';

  @Output() viewChange = new EventEmitter<CalendarView>();

  @Output() viewDateChange = new EventEmitter<Date>();

  CalendarView = CalendarView;



}
