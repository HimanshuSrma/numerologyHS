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
  nameNumberCharacteristics,
  englishMobilePairsMeaningArr,
  mustExcludePairs
} from '../../../assets/data/data';
import { NumerologyService } from '../../services/numerology.service';

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
  mobileIsLucky: boolean = false;
  personalYearData: any = null;
  personalMonthData: any = null;
  personalDayData: any = null;
  nameNumberCharacteristicsData:any = null
  personalYear: any;
  personalMonth: any;
  personalDay: any;
  nameData:any;
  mobileData :any = []
  mobileNumberTotal:number | null = null
  mobileCompound:number | null = null;
  readingGuide = [
    {
      effect:
        'Good Combination',
      type: 1,
    },
    {
    effect:
      'Bad Combination',
    type: 0,
  },
  {
    effect:
      'Neutral Combination',
    type: 2,
  },
  ]
  constructor(private numerologyService:NumerologyService,private http: HttpClient) {
    this.driverConductordata = driverConductordata;
    this.numbersRemedy = numbersRemedy;
    this.personalYearData = personalYearData;
    this.personalMonthData = personalMonthData;
    this.personalDayData = personalDayData;
    this.nameNumberCharacteristicsData = nameNumberCharacteristics;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (driverConductordata && this.result) {
      this.setCombination();
    }

    this.missingRemediesMap = this.result.missingNumbers.map((num) => ({
      number: num,
      title: this.getDataForNumber(num, 'title'),
      effect: this.getDataForNumber(num, 'effect'),
      remedies: this.getDataForNumber(num, 'missing'),
    }));

    this.excessRemediesMap = this.result.excessNumbers.map((num) => ({
      number: num,
      title: this.getDataForNumber(num, 'title'),
      effect: this.getDataForNumber(num, 'effect'),
      remedies: this.getDataForNumber(num, 'excess'),
    }));
  }

  private setCombination(): void {
    const lifePath = String(this.result?.lifePath);
    const destiny = String(this.result?.destiny);
    this.combinationData = this.driverConductordata?.[lifePath]?.[destiny] || null;
    const findLuckyNameNo = [...this.combinationData.luckyNameNumbers, ...this.combinationData.luckyNumbers]
    this.nameIsLucky = this.result.nameNumber == 5 ? true : findLuckyNameNo.includes(this.result.nameTotalSum);
    // console.log(this.combinationData, this.driverConductordata, this.result);
    this.personalYear = this.personalYearData[this.result?.personalYear];
    this.personalMonth = this.personalMonthData[this.result?.personalMonth];
    this.personalDay = this.personalDayData[this.result?.personalDay];
    const fetchNameNumData = this.result.nameTotalSum <= 108 ? this.result.nameTotalSum : this.result.nameNumber;
    this.nameData = this.nameNumberCharacteristicsData[fetchNameNumData]
    this.mobileData = this.setMobileData(this.result.mobileNumberPairs);
    this.mobileNumberTotal = this.numerologyService.calculateMobileSum(this.result.mobileNumber);
    this.mobileCompound  = this.numerologyService.reduceToSingleDigit(this.result.mobileNumber);
    this.mobileIsLucky = mustExcludePairs.every(excluded => !this.result.mobileNumberPairs.includes(excluded));
  }

  missingRemediesMap: any;
  excessRemediesMap: any;

  getDataForNumber(number: number, type: string): string[] {
    const numKey = number.toString();
    const data = this.numbersRemedy[numKey];
    if (!data) return [];
    
    if(type == 'missing' || type == 'excess'){
      return type === 'missing' ? data.missingRemedy : data.excessRemedy;
    }
    if(type == 'title'){
      return  data.title;
    }
    if(type == 'effect'){
      return data.missingEffect;
    }
    return [''];
  }

  setMobileData(mobileNoPairs:any[]){
    let arr: ({ combo: number; effect: string; type: number; } | { combo: string; effect: string; type: number; })[] = [];
    mobileNoPairs.forEach(element => {
      const matched = englishMobilePairsMeaningArr.find(item => item.combo === element);
      if (matched) {
        arr.push(matched);
      }
    });
    return arr;
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
