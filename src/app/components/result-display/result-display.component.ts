import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NumerologyResult, LoShuNumber } from '../../models/numerology.model';
import { driverConductordata, numbersRemedy } from '../../../assets/data/data';

@Component({
  selector: 'app-result-display',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './result-display.component.html',
  styleUrls: ['./result-display.component.scss'],
})
export class ResultDisplayComponent implements OnChanges {
  @Input() result!: NumerologyResult;
  combinationData: any = null;
  driverConductordata: any = null;
  numbersRemedy: any = null;
  nameIsLucky: boolean = false;
  constructor(private http: HttpClient) {
    this.driverConductordata = driverConductordata;
    this.numbersRemedy = numbersRemedy
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (driverConductordata && this.result) {
      this.setCombination();
    }
    this.missingRemediesMap = this.result.missingNumbers.map(num => ({
      number: num,
      remedies: this.getRemediesForNumber(num, 'missing')
    }));

    this.excessRemediesMap = this.result.excessNumbers.map(num => ({
      number: num,
      remedies: this.getRemediesForNumber(num, 'excess')
    }));
  }

  private setCombination(): void {
    const lifePath = String(this.result?.lifePath);
    const destiny = String(this.result?.destiny);
    this.combinationData =
      this.driverConductordata?.[lifePath]?.[destiny] || null;
    console.log(this.combinationData, this.driverConductordata);

    this.nameIsLucky = this.combinationData.luckyNameNumbers.includes(
      this.result.nameNumber
    );
  }

  missingRemediesMap: { number: number; remedies: string[] }[] = [];
  excessRemediesMap: { number: number; remedies: string[] }[] = [];

  getRemediesForNumber(number: number, type: 'missing' | 'excess'): string[] {
    const numKey = number.toString();
    const remedies = this.numbersRemedy[numKey];
    if (!remedies) return [];

    return type === 'missing' ? remedies.missingRemedy : remedies.excessRemedy;
  }


  get hasCombinationData(): boolean {
    return !!this.combinationData;
  }

  get loShuDisplayOrder(): LoShuNumber[] {
    return [4, 9, 2, 3, 5, 7, 8, 1, 6];
  }



  accordionItems = [
    { title: 'Section 1', content: 'Content for section 1' },
    { title: 'Section 2', content: 'Content for section 2' },
    { title: 'Section 3', content: 'Content for section 3' },
  ];

  openIndex: number | null = null;

  toggle(index: number) {
    this.openIndex = this.openIndex === index ? null : index;
  }

  isOpen(index: number): boolean {
    return this.openIndex === index;
  }

  
}
