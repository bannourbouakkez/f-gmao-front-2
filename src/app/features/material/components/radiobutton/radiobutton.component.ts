import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { FieldConfig } from "../../field.interface";
@Component({
selector: "app-radiobutton",
template: `
<div class="form-group row">
<label for="fname" class="col-md-5 control-label"
    aria-required="true">{{field.label}}</label>
<div class="col-md-7">

<!--
<div class="demo-full-width margin-top" [formGroup]="group">
<mat-radio-group [formControlName]="field.name">
<mat-radio-button *ngFor="let item of field.options" [value]="item">{{item}}</mat-radio-button>
</mat-radio-group>
</div>
-->
<div style="margin-top:4px;">
<div role="group" [formGroup]="group">
<nz-radio-group [formControlName]="field.name" >
    <label *ngFor="let item of field.options" nz-radio [nzValue]="item">{{item}}</label>
</nz-radio-group>
</div>
</div>

</div>
</div>
<div class="clearfix"></div>
`,
styles: []
})
export class RadiobuttonComponent implements OnInit {
field: FieldConfig;
group: FormGroup;
constructor() {}
ngOnInit() {}
}