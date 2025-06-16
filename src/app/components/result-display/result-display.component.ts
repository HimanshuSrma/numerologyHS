import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NumerologyResult, LoShuNumber } from '../../models/numerology.model';
import {
  driverConductordata,
  numbersRemedy,
  personalYearData,
  personalMonthData,
  personalDayData,
} from '../../../assets/data/data';

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
  personalYearData: any = null;
  personalMonthData: any = null;
  personalDayData: any = null;
  personalYear: any;
  personalMonth: any;
  personalDay: any;
  constructor(private http: HttpClient) {
    this.driverConductordata = driverConductordata;
    this.numbersRemedy = numbersRemedy;
    this.personalYearData = personalYearData;
    this.personalMonthData = personalMonthData;
    this.personalDayData = personalDayData;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (driverConductordata && this.result) {
      this.setCombination();
    }
    this.missingRemediesMap = this.result.missingNumbers.map((num) => ({
      number: num,
      remedies: this.getRemediesForNumber(num, 'missing'),
    }));

    this.excessRemediesMap = this.result.excessNumbers.map((num) => ({
      number: num,
      remedies: this.getRemediesForNumber(num, 'excess'),
    }));
  }

  private setCombination(): void {
    // debugger
    const lifePath = String(this.result?.lifePath);
    const destiny = String(this.result?.destiny);
    this.combinationData =
      this.driverConductordata?.[lifePath]?.[destiny] || null;
    this.nameIsLucky = this.combinationData.luckyNameNumbers.includes(
      this.result.nameNumber
    );
    // console.log(this.combinationData, this.driverConductordata, this.result);
    this.personalYear = this.personalYearData[this.result?.personalYear];
    this.personalMonth = this.personalMonthData[this.result?.personalMonth];
    this.personalDay = this.personalDayData[this.result?.personalDay];
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

  // openIndex: number | null = null;

  // toggle(index: number) {
  //   this.openIndex = this.openIndex === index ? null : index;
  // }

  // isOpen(index: number): boolean {
  //   return this.openIndex === index;
  // }

  // Store open index per accordion group
  openIndices: { [key: string]: number | null } = {};

  toggle(group: string, index: number): void {
    this.openIndices[group] = this.openIndices[group] === index ? null : index;
  }

  isOpen(group: string, index: number): boolean {
    return this.openIndices[group] === index;
  }
}
