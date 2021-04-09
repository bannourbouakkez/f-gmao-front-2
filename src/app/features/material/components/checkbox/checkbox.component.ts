import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { FieldConfig } from "../../field.interface";
@Component({
selector: "app-checkbox",
template: `

<div class="form-group row">
<label for="fname" class="col-md-5 control-label"
    aria-required="true">{{field.label}}</label>
<div class="col-md-7">

<!--
<div class="demo-full-width margin-top" [formGroup]="group" >
<mat-checkbox [formControlName]="field.name">{{field.label}}</mat-checkbox>
</div>
-->

<div style="margin-top:4px;">
<div role="group" [formGroup]="group">
<label nz-checkbox [formControlName]="field.name">
{{field.label}} </label>
</div>
</div>



</div>
</div>
<div class="clearfix"></div>

`,
styles: []
})
export class CheckboxComponent implements OnInit {
field: FieldConfig;
group: FormGroup;
constructor() {}
ngOnInit() {}
}
