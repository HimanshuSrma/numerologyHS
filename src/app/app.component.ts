import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputFormComponent } from './components/input-form/input-form.component';
import { ResultDisplayComponent } from './components/result-display/result-display.component';
import { NumerologyInput } from './models/numerology.model';
import { NumerologyService } from './services/numerology.service';
import { NumerologyResult } from './models/numerology.model';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, InputFormComponent, ResultDisplayComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  numerologyResult: NumerologyResult | null = null;
  constructor(private numerologyService:NumerologyService){}

  handleCalculation(data: NumerologyInput) {
    this.numerologyResult = this.numerologyService.calculateAll(
      data.name,
      data.dob,
      data.gender
    );
  }

  

  reset() {
    this.numerologyResult = null;
  }

}
