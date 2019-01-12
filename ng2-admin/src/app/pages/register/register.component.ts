import { Component } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { EmailValidator, EqualPasswordsValidator } from '../../theme/validators';
import { AuthService } from '../../providers/auth.service';
import { Router } from '@angular/router';

import 'style-loader!./register.scss';

@Component({
  selector: 'register',
  templateUrl: './register.html',
})
export class Register {

  public form: FormGroup;
  public firstName: AbstractControl;
  public lastName: AbstractControl;
  public email: AbstractControl;
  public password: AbstractControl;
  public repeatPassword: AbstractControl;
  public passwords: FormGroup;

  public submitted: boolean = false;

  constructor(private authService: AuthService,
    private router: Router,
    fb: FormBuilder) {

    this.form = fb.group({
      'firstName': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'lastName': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'email': ['', Validators.compose([Validators.required, EmailValidator.validate])],
      'passwords': fb.group({
        'password': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
        'repeatPassword': ['', Validators.compose([Validators.required, Validators.minLength(4)])]
      }, { validator: EqualPasswordsValidator.validate('password', 'repeatPassword') })
    });

    this.firstName = this.form.controls['firstName'];
    this.lastName = this.form.controls['lastName'];
    this.email = this.form.controls['email'];
    this.passwords = <FormGroup>this.form.controls['passwords'];
    this.password = this.passwords.controls['password'];
    this.repeatPassword = this.passwords.controls['repeatPassword'];
  }

  public onSubmit(values: Object): void {
    this.submitted = true;
    if (this.form.valid) {
      console.log(values);

      this.authService.register(values.email, values.passwords.password).then(user => {
        this.authService.registerUserInDatabase(user.uid, values.firstName, values.lastName, values.email).then(result => {
          this.router.navigate(['/pages/dashboard']);
        }).catch(error => {
          console.log('Something went wrong:', error.message);
        });
      }).catch(err => {
        console.log('Something went wrong:', err.message);
      });

    }
  }

  public registerWithFacebook(){
    alert("This functionality is not working yet");
    console.log('Still need to add functionality');
  }

  public registerWithGoogle(){
    alert("This functionality is not working yet");
    console.log('Still need to add functionality');
  }

}
