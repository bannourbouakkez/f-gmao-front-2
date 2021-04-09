import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output
} from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
  ValidationErrors
} from "@angular/forms";
import { FieldConfig, Validator } from "../../field.interface";
import { Observable, Subscription } from 'rxjs';

@Component({
  exportAs: "dynamicForm",
  selector: "dynamic-form",
  template: `

  <form *ngIf="fields.length>0" class="dynamic-form" [formGroup]="form" (submit)="onSubmit($event)">
  <div id="id-div-filter-form-horizontal" class="form-horizontal" role="form" autocomplete="off">
  <ng-container *ngFor="let field of fields;" dynamicField [field]="field" [group]="form">
  </ng-container>
  </div>
  </form>

  `,
  styles: []
})
export class DynamicFormComponent implements OnInit {
//https://stackoverflow.com/questions/44053227/how-to-emit-an-event-from-parent-to-child
private eventsSubscription: Subscription;
@Input() events: Observable<void>;
ngOnDestroy() {
  this.eventsSubscription.unsubscribe();
}

doSomething(res){
  if(res!=null)
  this.form.setValue(res);
}

  @Input() fields: FieldConfig[] = [];

  @Output() submit: EventEmitter<any> = new EventEmitter<any>();
  @Output() isValid: EventEmitter<any> = new EventEmitter<any>();

  form: FormGroup;

  get value() {
    return this.form.value;
  }
  constructor(private fb: FormBuilder) {}

  ngOnInit() {
   
    this.form = this.createControl();
    this.onChanges();
    this.markAllAsDirtyAndTouched();
    this.eventsSubscription = this.events.subscribe((res) =>{ this.doSomething(res); });
    this.submit.emit(this.form.value);
    this.isValid.emit(this.form.valid);
  }

  onSubmit(event: Event) {
   // this.form=this.createControl();
    event.preventDefault();
    event.stopPropagation();
    if (this.form.valid) {
      this.submit.emit(this.form.value);
      this.isValid.emit(this.form.valid);
    } else {
      this.validateAllFormFields(this.form);
    }
  }

  createControl() {
    const group = this.fb.group({});
    this.fields.forEach(field => {
      if (field.type === "button") return;
      const control = this.fb.control(
        field.value,
        this.bindValidations(field.validations || [])
      );
      group.addControl(field.name, control);
    });
    return group;
  }

  bindValidations(validations: any) {
    if (validations.length > 0) {
      const validList = [];
      validations.forEach(valid => {
        if(valid.validator=='Validators.required'){validList.push(Validators.required);}
       // else if(valid.validator=="number"){ validList.push(Validators.pattern("^[0-9]*$"));} 
        else if(valid.validator=="number"){ validList.push(Validators.pattern("\\-?\\d*\\.?\\d{1,9}"));}
        else{ validList.push(Validators.pattern(valid.validator)) ; }
        // validList.push(Validators.pattern(valid.validator));
      });
       return Validators.compose(validList);
    }
    return null;
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      control.markAsTouched({ onlySelf: true });
    });
  }


  onChanges(): void {
    this.form.valueChanges.subscribe(val => {
      //this.getFormValidationErrors();
      this.submit.emit(this.form.value);
      this.isValid.emit(this.form.valid);
      if (!this.form.valid) {
        this.validateAllFormFields(this.form);
      }

    });
  }


  getFormValidationErrors() {
    Object.keys(this.form.controls).forEach(key => {
  
    const controlErrors: ValidationErrors = this.form.get(key).errors;
    if (controlErrors != null) {
          Object.keys(controlErrors).forEach(keyError => {
            console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
          });
        }
      });
    }

    markAllAsDirtyAndTouched(){
      Object.keys(this.form.controls).forEach(key => {
        this.form.get(key).markAsDirty();
        this.form.get(key).markAsTouched();
      })

    }

 





}
