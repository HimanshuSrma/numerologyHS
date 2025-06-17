import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

type FieldKey = 'fullName' | 'dateOfBirth' | 'gender' | 'email' | 'mobile';
type InvalidFields = Record<FieldKey, boolean>;

@Component({
  selector: 'app-input-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './input-form.component.html',
  styleUrls: ['./input-form.component.scss']
})
export class InputFormComponent {
  fullName = '';
  dateOfBirth = '';
  gender = '';
  email = '';
  mobile = '';

  //   fullName = 'Himmanshu sharma';
  // dateOfBirth = '2000-06-05';
  // gender = 'male';
  // email = 'name@domain.com';
  // mobile = '9876543210';

  @Output() calculationDone = new EventEmitter<any>();

  invalidFields: InvalidFields = {
    fullName: false,
    dateOfBirth: false,
    gender: false,
    email: false,
    mobile: false
  };

  submitForm(form: NgForm) {
    if (form.invalid) {
      form.control.markAllAsTouched();

      this.invalidFields.fullName = !this.fullName.trim();
      this.invalidFields.dateOfBirth = !this.dateOfBirth;
      this.invalidFields.gender = !this.gender;
      this.invalidFields.email = !this.email || !this.email.includes('@');
      this.invalidFields.mobile = !this.mobile || !/^\d{10}$/.test(this.mobile);

      setTimeout(() => {
        this.invalidFields = {
          fullName: false,
          dateOfBirth: false,
          gender: false,
          email: false,
          mobile: false
        };
      }, 400);

      return;
    }

    this.calculationDone.emit({
      name: this.fullName.trim(),
      dob: this.dateOfBirth,
      gender: this.gender,
      email: this.email,
      mobile: this.mobile
    });
  }
}
