import { Component, OnInit , EventEmitter, Output, Input, Inject } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import moment, { isMoment } from 'moment';

@Component({
  selector: 'app-shared-reporter-date',
  templateUrl: './shared-reporter-date.component.html',
  styleUrls: ['./shared-reporter-date.component.scss']
})
export class SharedReporterDateComponent implements OnInit {

  form:FormGroup;
  constructor(private fb:FormBuilder,public dialogRef: MatDialogRef<SharedReporterDateComponent>,@Inject(MAT_DIALOG_DATA) public data ,  ) { }

  ngOnInit() {
    this.InitForm();
    this.FormValuesChanges();
  }

  InitForm(){
    this.form = this.fb.group({
      date: [this.data.date]
    });
  }

  //Action(date){this.action.emit(date);}

  FormValuesChanges() {
    this.form.valueChanges.subscribe(value =>{ 
      let new_date=this.JustDateString(this.form.get('date').value);
      this.dialogRef.close(new_date)
    });
  }

  
JustDateString(date:string){

  if(date==null) return date;
  if (isMoment(date)){
     return date.format('YYYY-MM-DD');
  }
  return date.slice(0,10);
}

}
