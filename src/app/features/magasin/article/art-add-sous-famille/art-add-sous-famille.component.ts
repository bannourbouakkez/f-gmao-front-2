import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'src/app/@pages/components/message/message.service';
import { ArticleService } from '../../services/article.service';
@Component({
  selector: 'app-art-add-sous-famille',
  templateUrl: './art-add-sous-famille.component.html',
  styleUrls: ['./art-add-sous-famille.component.scss']
})
export class ArtAddSousFamilleComponent implements OnInit {

  un:number=1;
   //---------- breadcrumb ---------
   autres=[ 
    {url:'gmao/magasin/fs/sousfamilles',title:'Liste sous famille'}
    //,{url:'gmao/preventif/intervention/addoredit',title:'Ajouter Intervention'}
    ];
  breadcrumb = [
    { url: 'gmao', title: 'home' },
    { url: 'gmao/magasin', title: 'magasin' },
    { url: 'gmao/magasin/fs', title: 'Sous Famille' },
    //{ url: '#', title: this.AjouterOuModifier(this.DiID)+' DI' }
    { url: '#', title: 'Ajouter Sous Famille' }
  ];


  LoadingReactBtn1=false;
  AjouterOuModifier(bool){
    if(bool){return 'Modifier';}
    else{ return 'Ajouter';}
  }
  PageLoaded=false;
  //###############################


  public form: FormGroup;
  familles=[];
  
  constructor(
    private fb: FormBuilder,
    private articleService: ArticleService,
    private _currentRoute: ActivatedRoute,
    private _notification: MessageService,
    private _router:Router
  ) {
    this.form = fb.group({
      'famille_id':['', Validators.required],
      'name': ['', Validators.required],
      'SelecttypeField': [''],
      'fields': fb.array([])
    });
  }

  ngOnInit() {
    this.getFamilles();
   }

   
  getFamilles(){
    this.articleService.getFamilles().then(
      res=>{this.familles=res;},
      err=>console.log(err)
    );
  }

  addPhone(userIndex: number, data?: any) {

    let fg = this.fb.group({
      value: ['', Validators.required],
      default: [false]
    });
    (<FormArray>(<FormGroup>(<FormArray>this.form.controls['fields'])
      .controls[userIndex]).controls['phones']).push(fg);
  }


  deletePhone(userIndex: number, index: number) {
    (<FormArray>(<FormGroup>(<FormArray>this.form.controls['fields'])
      .controls[userIndex]).controls['phones']).removeAt(index);
  }


  addUser(typeField?) {
    if (!(typeField != 'text' && typeField != 'select' && typeField != 'checkbox' && typeField != 'radiobutton')) {
      let fg = this.fb.group({
        name: ['', [Validators.required, Validators.pattern('^[a-z]+$')]],
        label: ['', Validators.required],
        typeField: [typeField],
        type: ['string'],
        required: [false],
        vide: [0],
        phones: this.fb.array([])
      });

      (<FormArray>this.form.get('fields')).push(fg);
      let userIndex = (<FormArray>this.form.get('fields')).length - 1;
      this.addPhone(userIndex);

      return fg;
    }

  }

  deleteUser(index: number) { (<FormArray>this.form.get('fields')).removeAt(index); }

  ngOnDestroy(): void { }
  onSubmit(formValue) {

    if (this.ValidateFamilleForm() && !this.LoadingReactBtn1) {
    this.LoadingReactBtn1=true;
     // console.log('valid');
     // this.find_duplicate_name();
      
              this.articleService.setForm(formValue).then(
                res=>{

                  //console.log(res);
                  this.LoadingReactBtn1=true;
                  if(res.success){
                    this.notification('success',res.msg,2000);
                    this.redirection(this.UrlToRedirection+res.FamCaraID);
                    }else{
                    this.notification('danger',res.msg, 5000);
                    }

                  // 
                },
                err=>console.log(err)
              );
      
    } else {
      this.notification('danger','Formulaire pas valide .', 5000);
      
    }
  }

  SelecttypeField(e) { }

  addNewField() {
    this.addUser(this.form.controls['SelecttypeField'].value);
  }


  ValidateFamilleForm() {
    
    if(this.form.controls['fields'].value.length>0){
    let isValid = false;
    if (this.find_duplicate_name() && this.logValidationErrors(this.form)) {
      //  if (this.form.controls['name'].valid && this.form.controls['fields'].value.length > 0) {
        if (this.form.controls['name'].valid && this.form.controls['famille_id'].valid ) {
        isValid = true;
      }
    }
    if (isValid) {
      return true;
    } else {
      return false;
    }

  }else{
    return false;
  }

  }

  logValidationErrors(group: FormGroup | FormArray) {
    let isValid = true;
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);
      if (abstractControl instanceof FormGroup || abstractControl instanceof FormArray) {
        let isValidChild = this.logValidationErrors(abstractControl);
        if (!isValidChild) { isValid = false; }
      } else {
        //if (abstractControl && !abstractControl.valid) {
        if (abstractControl) {

          Object.keys(abstractControl.parent.controls).forEach(keycon => {
            if (keycon == 'typeField') {
              let typeField = abstractControl.parent.get('typeField').value;

              if (!abstractControl.parent.get('name').valid) { isValid = false; }
              if (!abstractControl.parent.get('label').valid) { isValid = false; }

              if (typeField == 'select' || typeField == 'checkbox' || typeField == 'radiobutton') {

                if (!abstractControl.parent.get('phones').valid) { isValid = false; }

                let arrValueDefault = abstractControl.parent.get('phones').value;
                let arrValueDefault2 = new Array();
                arrValueDefault2 = arrValueDefault;
                let arrValue = new Array();
                arrValueDefault2.forEach(element => {
                  arrValue.push(element['value']);
                });

                if (this.find_duplicate_in_array(arrValue).length > 0) { isValid = false; }
              }
            }
          })
        }
      }
    })

    return isValid;
  }

  find_duplicate_name(){

    var names=[];
    var i=0;
    Object.keys(this.form.controls['fields']).forEach((key: string) => {
      if(this.form.get('fields.'+i+'.name')){
        names.push(this.form.get('fields.'+i+'.name').value);
      };
      i=i+1;
    })

    if(this.find_duplicate_in_array(names).length > 0){return false;}
    else{return true;}
  }

  find_duplicate_in_array(arra1) {
    var object = {};
    var result = [];

    arra1.forEach(function (item) {
      if (!object[item])
        object[item] = 0;
      object[item] += 1;
    })

    for (var prop in object) {
      if (object[prop] >= 2) {
        result.push(prop);
      }
    }

    return result;

  }


  // ------ Notification & Redirection  --------------
  UrlToRedirection="/gmao/magasin/fs/sousfamille/";
  redirection(url) {
    this._router.navigate([url]);
  }
  
  notification(type: string, msg: string, duree: number) {
    // type : primary , success , danger 
    this._notification.create(
      type,
      msg,
      {
        Position: "top-right",
        Style: "simple",
        Duration: duree
      }
    );
  }
//###################################################


}