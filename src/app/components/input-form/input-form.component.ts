import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { FirestoreService } from '../../services/firestore.service';
import { create } from 'domain';

type FieldKey = 'fullName' | 'dateOfBirth' | 'gender' | 'email' | 'mobile' | 'userGoal';
type InvalidFields = Record<FieldKey, boolean>;

@Component({
  selector: 'app-input-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './input-form.component.html',
  styleUrls: ['./input-form.component.scss']
})
export class InputFormComponent {
  constructor(private fs: FirestoreService) {}
  // fullName = '';
  // dateOfBirth = '';
  // gender = '';
  // email = '';
  // mobile = '';
  // userGoal = '';

  fullName = 'Himmanshu sharma';
  dateOfBirth = '2000-06-05';
  gender = 'male';
  email = 'name@domain.com';
  mobile = '9876543210';
  userGoal = 'NA NA NA NA NA NA NA NA';

  @Output() calculationDone = new EventEmitter<any>();

  invalidFields: InvalidFields = {
    fullName: false,
    dateOfBirth: false,
    gender: false,
    email: false,
    mobile: false,
    userGoal: false
  };

  async submitForm(form: NgForm) {
    if (form.invalid) {
      form.control.markAllAsTouched();

      this.invalidFields.fullName = !this.fullName.trim();
      this.invalidFields.dateOfBirth = !this.dateOfBirth;
      this.invalidFields.gender = !this.gender;
      this.invalidFields.email = !this.email || !this.email.includes('@');
      this.invalidFields.mobile = !this.mobile || !/^\d{10}$/.test(this.mobile);
      this.invalidFields.userGoal = !this.userGoal.trim();

      setTimeout(() => {
        this.invalidFields = {
          fullName: false,
          dateOfBirth: false,
          gender: false,
          email: false,
          mobile: false,
          userGoal: false
        };
      }, 400);

      return;
    }

    let data = {
      name: this.fullName.trim(),
      dob: this.dateOfBirth,
      gender: this.gender,
      email: this.email,
      mobile: this.mobile,
      userGoal: this.userGoal.trim(),
      createdAt: new Date()
    }

    if(!(this.fullName == "Himmanshu sharma" && this.dateOfBirth == "2000-06-05")){
      await this.fs.addUser(data).then(docRef => {
        console.log('✅ New user added with ID:', docRef.id);
      })
      .catch(error => {
        console.error('❌ Failed to add user:', error);
      });
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
