import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { FieldConfig } from "../../field.interface";
@Component({
selector: "app-input",
template: `
<div class="form-group row">
<label for="fname" class="col-md-5 control-label"
    aria-required="true">{{field.label}}</label>
<div class="col-md-7">

<!--
<mat-form-field class="demo-full-width" [formGroup]="group">
<input matInput [formControlName]="field.name" [placeholder]="field.label" [type]="field.inputType" autocomplete="off">
<ng-container *ngFor="let validation of field.validations;" ngProjectAs="mat-error">
<mat-error *ngIf="group.get(field.name).hasError(validation.name)">{{validation.message}}</mat-error>
</ng-container>
</mat-form-field>
-->

<!--[type]="field.inputType" autocomplete="off" [placeholder]="field.label"-->


   


<ng-container *ngIf="!isNumber">
<div role="group" [formGroup]="group">
<input  class='form-control input-sm'
[formControlName]="field.name" [placeholder]="field.label"
[type]="field.inputType"
autocomplete="off"
>
<ng-container *ngFor="let validation of field.validations;">
<label class="error" *ngIf="group.get(field.name).hasError(validation.name)" [innerHTML]="validation.message"></label>
</ng-container>
</div>
</ng-container>

<ng-container *ngIf="isNumber">
<div role="group" [formGroup]="group">
<nz-input-number 
[formControlName]="field.name" 
[nzMin]="0" [nzStep]="1"
>
</nz-input-number>
<ng-container *ngFor="let validation of field.validations;">
<label class="error" *ngIf="group.get(field.name).hasError(validation.name)" [innerHTML]="validation.message"></label>
</ng-container>
</div>
</ng-container>


<!--
isNumber:{{isNumber}}
<div role="group" [formGroup]="group">
<input  class='form-control input-sm'
[formControlName]="field.name" [placeholder]="field.label"
[type]="field.inputType"
autocomplete="off"
>
<ng-container *ngFor="let validation of field.validations;">
<label class="error" *ngIf="group.get(field.name).hasError(validation.name)" [innerHTML]="validation.message"></label>
</ng-container>
</div>
-->




</div>
</div>
<div class="clearfix"></div>


`,
styles: []
})
export class InputComponent implements OnInit {
field: FieldConfig;
group: FormGroup;
isNumber=false;
constructor() {}

ngOnInit() {
  for(let i=0;i<this.field.validations.length;i++){
    if(this.field.validations[i].validator && this.field.validations[i].validator=='number'){
      this.isNumber=true;
    }
  }

}
}