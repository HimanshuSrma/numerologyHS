import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NumerologyResult, LoShuNumber } from '../../models/numerology.model';
// import { driverConductordata, numbersRemedy, personalYearData, personalMonthData, personalDayData, nameNumberCharacteristics, englishMobilePairsMeaningArr, repetitionOfNumbers, nameLettersData} from '../../../assets/data/data';
import {mustExcludePairs,} from '../../../assets/data/data';
import { NumerologyService } from '../../services/numerology.service';
import { FirestoreService } from '../../services/firestore.service';

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
  personalYear: any;
  personalMonth: any;
  personalDay: any;
  nameData: any;
  mobileData: any = [];
  mobileNumberTotal: number | null = null;
  mobileCompound: number | null = null;
  missingRemediesMap: any;
  excessRemediesMap: any = [];
  repeatedNumbers: any = [];
  nameLettersData: any;
  nameLettersArr: string[] = [];
  readingGuide = [
    {
      effect: 'Good Combination',
      type: 1,
    },
    {
      effect: 'Bad Combination',
      type: 0,
    },
    {
      effect: 'Neutral Combination',
      type: 2,
    },
  ];
  constructor(private numerologyService: NumerologyService,private firestoreService: FirestoreService) {}

  async ngOnInit(): Promise<void> {}
  
  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }
  
  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if (this.result) {
      console.log('result', this.result);
      this.setCombination();
    }
    
    this.missingRemediesMap = await Promise.all(
      this.result.missingNumbers.map(async (num) => {
        const data = await this.getDataForNumber(num, 'missing') || {};
        return {
          number: num,
          title: data.title,
          effect: data.effect,
          missingRemedies: data.missingRemedies,
          excessRemedies: data.excessRemedies,
        };
      })
    );

    this.excessRemediesMap = await Promise.all(
      this.result.excessNumbers.map(async (num) => {
        const data = await this.getDataForNumber(num, 'excess') || {};
        return {
          number: num,
          title: data.title,
          effect: data.effect,
          missingRemedies: data.missingRemedies,
          excessRemedies: data.excessRemedies,
        };
      })
    );

    // this.missingRemediesMap = this.result.missingNumbers.map((num) => {
    //   const data = this.getDataForNumber(num);
    //   return {
    //     number: num,
    //     title: data?.title,
    //     effect: data?.effect,
    //     remedies: data?.remedies,
    //   };
    // });

    // this.excessRemediesMap = this.result.excessNumbers.map((num) => {
    //   const data = this.getDataForNumber(num);
    //   return {
    //     number: num,
    //     title: data?.title,
    //     effect: data?.effect,
    //     remedies: data?.remedies,
    //   };
    // });
    
    // this.missingRemediesMap = this.result.missingNumbers.map((num) => ({
    //   number: num,
    //   title: this.getDataForNumber(num, 'title'),
    //   effect: this.getDataForNumber(num, 'effect'),
    //   remedies: this.getDataForNumber(num, 'missing'),
    // }));

    // this.excessRemediesMap = this.result.excessNumbers.map((num) => ({
    //   number: num,
    //   title: this.getDataForNumber(num, 'title'),
    //   effect: this.getDataForNumber(num, 'effect'),
    //   remedies: this.getDataForNumber(num, 'excess'),
    // }));
  }

  private async setCombination(): Promise<void> {
    const lifePath = String(this.result?.lifePath);
    const destiny = String(this.result?.destiny);
    this.repeatedNumbers = await this.processLoShuGridForRepeatedNumbers();
    this.combinationData = await this.fetchDriverConductorData(lifePath, destiny);
    const findLuckyNameNo = [...this.combinationData.luckyNameNumbers,...this.combinationData.luckyNumbers];
    this.nameIsLucky = this.result.nameNumber == 5 ? true : findLuckyNameNo.includes(Number(this.result.nameNumber));
    // this.nameIsLucky = this.result.nameNumber == 5 ? true : findLuckyNameNo.includes(Number(this.result.nameTotalSum));
    this.personalYear = this.firestoreService.personalYearData[this.result?.personalYear];
    this.personalMonth = this.firestoreService.personalMonthData[this.result?.personalMonth];
    this.personalDay = this.firestoreService.personalDayData[this.result?.personalDay];
    const fetchNameNumData = this.result.nameTotalSum <= 108 ? this.result.nameTotalSum : this.result.nameNumber;
    this.nameData = this.firestoreService.nameNumberCharacteristics[fetchNameNumData];
    this.mobileData = this.setMobileData(this.result.mobileNumberPairs);
    this.mobileNumberTotal = this.numerologyService.calculateMobileSum(this.result.mobileNumber);
    this.mobileCompound = this.numerologyService.reduceToSingleDigit(this.result.mobileNumber);
    this.mobileIsLucky = mustExcludePairs.data.every((excluded: any) => !this.result.mobileNumberPairs.includes(Number(excluded)) );
    this.nameLettersArr = this.result.name.replace(/\s/g, '').toUpperCase().split('')
    this.nameLettersData = this.firestoreService.nameLettersData;
    // this.fetchNameLettersData(this.nameLettersArr);
    
  }
  
  async getDataForNumber(number: number, type:string): Promise<{title: string[];effect: string[];missingRemedies: string[];excessRemedies: string[];}> {
  const numKey = number.toString();
  const data = this.firestoreService.numbersData[numKey] || {};
  return {
    title: data.title || [],
    effect: data.missingEffect || [],
    missingRemedies: data.missingRemedy || [],
    excessRemedies: data.excessRemedy || [],
  };
}


  setMobileData(mobileNoPairs: any[]) {
    let arr: (
      | { combo: number; effect: string; type: number }
    )[] = [];
    mobileNoPairs.forEach(async (element) => {
      // const matched = this.firestoreService.englishMobilePairsMeaningArr?.find((item:any) => item.combo === element);
      const matched = this.firestoreService.englishMobilePairsMeaningArr?.[element?.toString()];
      if (matched) {
        arr.push(matched);
      }
    });
    return arr;
  }

  async processLoShuGridForRepeatedNumbers() {
    let arr = [];
    for (const digitStr in this.result.loShuGrid) {
      const digitKey = digitStr as unknown as keyof typeof this.result.loShuGrid;
      if(this.result.loShuGrid[digitKey] >= 2){
        let key = digitKey+'_'+this.result.loShuGrid[digitKey]
        let data = this.firestoreService.repetitionOfNumbers[key];
        arr.push(data);
      }
    }
    return arr;
  }

  get hasCombinationData(): boolean {
    return !!this.combinationData;
  }

  get loShuDisplayOrder(): LoShuNumber[] {
    return [4, 9, 2, 3, 5, 7, 8, 1, 6];
  }

  // Store open index per accordion group
  openIndices: { [key: string]: number | null } = {};

  toggle(group: string, index: number): void {
    this.openIndices[group] = this.openIndices[group] === index ? null : index;
  }

  isOpen(group: string, index: number): boolean {
    return this.openIndices[group] === index;
  }

  async fetchDriverConductorData(lifePath: string, destiny: string) {
    const doc = await this.firestoreService.getDriverConductorData(lifePath);
    const result = doc?.[destiny];
    // console.log(`Match for LifePath ${lifePath} and Destiny ${destiny}:`, result);
    return result;
  }

  async fetchData(json: string, key?:any) {
    const result = await this.firestoreService.getData(json, key);
    // console.log(`Match data for ${json} -> ${key}:`, result);
    return result;
  }
  
}
