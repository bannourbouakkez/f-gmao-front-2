import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { FieldConfig } from "../../field.interface";
@Component({
selector: "app-multiple",
template: `
<div class="form-group row">
<label for="fname" class="col-md-5 control-label"
    aria-required="true">{{field.label}}</label>
<div class="col-md-7">

<!--
<mat-form-field 
class="demo-full-width margin-top" 
[formGroup]="group">

<mat-select [placeholder]="field.label" [formControlName]="field.name">
<mat-option *ngFor="let item of field.options" [value]="item">{{item}}</mat-option>
</mat-select>
</mat-form-field>
-->

<!-- héthi elli kénét 
<mat-form-field [formGroup]="group" >
  <mat-label>{{field.label}}</mat-label>
  <mat-select [formControlName]="field.name" multiple>
    <mat-option *ngFor="let item of field.options" [value]="item">{{item}}</mat-option>
  </mat-select>
</mat-form-field>
-->
<!--[nzDisabled]="field.options"-->

<div role="group" [formGroup]="group">
<nz-select 
 [formControlName]="field.name" 
 nzMode="multiple" 
 nzShowSearch nzAllowClear
 [nzPlaceHolder]="field.label">
                                                                
<nz-option *ngFor="let item of field.options" [nzValue]="item" [nzLabel]="item">
</nz-option>

</nz-select>
</div>   



</div>
</div>
<div class="clearfix"></div>


`,
styles: []
})
export class MultipleComponent implements OnInit {
field: FieldConfig;
group: FormGroup;
constructor() {}
ngOnInit() {}
}
