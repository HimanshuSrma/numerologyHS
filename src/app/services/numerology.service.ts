import { Injectable } from '@angular/core';
import { LoShuNumber, NumerologyResult } from '../models/numerology.model';
@Injectable({
  providedIn: 'root',
})
export class NumerologyService {
  private chaldeanLetterMap: Record<string, number> = {
    A: 1,
    I: 1,
    J: 1,
    Q: 1,
    Y: 1,
    B: 2,
    K: 2,
    R: 2,
    C: 3,
    G: 3,
    L: 3,
    S: 3,
    D: 4,
    M: 4,
    T: 4,
    E: 5,
    H: 5,
    N: 5,
    X: 5,
    U: 6,
    V: 6,
    W: 6,
    O: 7,
    Z: 7,
    F: 8,
    P: 8,
  };

  // private reduceToSingleDigit(value: number): number {
  //   while (value > 9 && value !== 11 && value !== 22 && value !== 33) {
  //     value = value.toString().split('').reduce((a, b) => a + +b, 0);
  //   }
  //   return value;
  // }

  reduceToSingleDigit(value: number): number {
    value = Math.abs(value);
    if (value < 10) {
      return value;
    }
    while (value >= 10) {
      let sum = 0;
      let tempValue = value; // Use a temporary variable to extract digits
      while (tempValue > 0) {
        sum += tempValue % 10; // Get the last digit and add to sum
        tempValue = Math.floor(tempValue / 10); // Remove the last digit
      }
      value = sum; // Update the value with the sum of its digits
    }

    return value; // The final single-digit result
  }

  // calculateDestinyNumber(name: string): number {
  //   const cleaned = name.replace(/[^a-zA-Z]/g, '').toUpperCase();
  //   const total = cleaned.split('').map(char => char.charCodeAt(0) - 64) // A=1, B=2, ..., Z=26
  //     .reduce((sum, val) => sum + val, 0);
  //   return this.reduceToSingleDigit(total);
  // }

  calculateDestinyNumber(dob: string): number {
    // const [year, month, day] = dob.split('-');
    // const digits = (year + month + day).split('').map(Number).filter(n => !isNaN(n)); // Ensure only valid digits
    // const total = digits.reduce((sum, d) => sum + d, 0);
    // return this.reduceToSingleDigit(total);

    const digits = dob.replace(/[^0-9]/g, '').split('').map(Number);
    const total = digits.reduce((sum, val) => sum + val, 0);
    return this.reduceToSingleDigit(total);
  }

  calculateLifePathNumber(dob: string): number {
    const day = parseInt(dob.split('-')[2], 10); // Get "05" → 5
    return this.reduceToSingleDigit(day);
  }

  calculateKuaNumber(dob: string, gender: string): number {
    const year = +dob.split('-')[0];
    let sum = year.toString().split('').reduce((a, b) => a + +b, 0);
    sum = this.reduceToSingleDigit(sum);

    if (gender.toLowerCase() === 'male') {
      const kua = 11 - sum;
      return kua === 5 ? 2 : this.reduceToSingleDigit(kua);
    } else {
      const kua = sum + 4;
      return kua === 5 ? 8 : this.reduceToSingleDigit(kua);
    }
  }

  calculatePersonalYear(dob: string): number {
    const [yearStr, monthStr, dayStr] = dob.split('-');
    const now = new Date();
    const currentYear = now.getFullYear();
    const total = [...dayStr, ...monthStr, ...currentYear.toString()].map(Number).reduce((sum, digit) => sum + digit, 0);
    return this.reduceToSingleDigit(total);
  }

  calculatePersonalMonth(dob: string): number {
    const personalYear = this.calculatePersonalYear(dob);
    const currentMonth = new Date().getMonth() + 1; // Months are 0-based
    return this.reduceToSingleDigit(personalYear + currentMonth);
  }

  calculatePersonalDay(dob: string): number {
    const personalMonth = this.calculatePersonalMonth(dob);
    const currentDay = new Date().getDate();
    return this.reduceToSingleDigit(personalMonth + currentDay);
  }

  calculateNameNumber(name: string, totalSum = false): number {
    const clean = name.toUpperCase().replace(/[^A-Z]/g, '');
    const total = [...clean].reduce((sum, ch) => sum + (this.chaldeanLetterMap[ch] || 0),0);
    if (totalSum) {
      return total;
    } else {
      return this.reduceToSingleDigit(total);
    }
  }

  calculateMobileSum(num: number): number {
    return num.toString().split('').map(Number).reduce((acc, digit) => acc + digit, 0);
  }

  generateLoShuGrid(dob: string,destiny: number,lifePath: number,kua: number): Record<LoShuNumber, number> {
    const digits = dob.replace(/[^0-9]/g, '').split('').map(Number);
    const grid: Record<LoShuNumber, number> = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      7: 0,
      8: 0,
      9: 0,
    };

    digits.forEach((d) => {
      if (d >= 0 && d <= 9) {
        grid[d as LoShuNumber]++;
      }
    });

    // Check day part of DOB
    const day = parseInt(dob.split('-')[2], 10); // assumes dob = YYYY-MM-DD

    if (destiny >= 0 && destiny <= 9) grid[destiny as LoShuNumber]++;
    if (day > 10) {
      if (lifePath >= 0 && lifePath <= 9) grid[lifePath as LoShuNumber]++;
    }
    if (kua >= 0 && kua <= 9) grid[kua as LoShuNumber]++;
    return grid;
  }

  getLoShuOrder(): LoShuNumber[] {
    // Traditional Lo Shu Grid layout order (0 is not part of the grid)
    return [4, 9, 2, 3, 5, 7, 8, 1, 6];
  }

  getMissingNumbers(grid: Record<LoShuNumber, number>): LoShuNumber[] {
    return Object.keys(grid).map(Number).filter((n) => grid[n as LoShuNumber] === 0) as LoShuNumber[];
  }

  getExcessNumbers(grid: Record<LoShuNumber, number>): LoShuNumber[] {
    return Object.keys(grid).map(Number).filter((n) => grid[n as LoShuNumber] >= 3) as LoShuNumber[];
  }

  convertToPairs(number: number, pairSize: number): number[] {
    const numberString = number.toString();
    const pairs: number[] = [];
    for (let i = 0; i <= numberString.length - pairSize; i++) {
      const pair = numberString.substring(i, i + pairSize);
      pairs.push(parseInt(pair, 10));
    }
    return pairs;
  }

  // convertToPairs(number:number) {
  //   let numberString = number.toString();
  //   let pairs = [];
  //   for (let i = 0; i < numberString.length - 1; i++) {
  //     let pair = numberString.substring(i, i + 2);
  //     pairs.push(parseInt(pair));
  //   }
  //   return pairs;
  // }

  calculateAll(name: string, dob: string, gender: string, mobile: number): NumerologyResult {
    const lifePath = this.calculateLifePathNumber(dob);
    const destiny = this.calculateDestinyNumber(dob);
    const kua = this.calculateKuaNumber(dob, gender);
    const loShuGrid = this.generateLoShuGrid(dob, destiny, lifePath, kua);
    const missingNumbers = this.getMissingNumbers(loShuGrid);
    const excessNumbers = this.getExcessNumbers(loShuGrid);
    const loShuOrder = this.getLoShuOrder();
    const personalYear = this.calculatePersonalYear(dob);
    const personalMonth = this.calculatePersonalMonth(dob);
    const personalDay = this.calculatePersonalDay(dob);
    const nameTotalSum = this.calculateNameNumber(name, true);
    const nameNumber = this.calculateNameNumber(name);
    const pairofTwo = this.convertToPairs(mobile, 2);
    const pairofThree = this.convertToPairs(mobile, 3);
    const pairofFour = this.convertToPairs(mobile, 4);
    const pairofFive = this.convertToPairs(mobile, 5);
    const mobileNumberPairs = [...pairofTwo,...pairofThree,...pairofFour,...pairofFive];
    const mobileNumber = mobile;
    return {
      name,
      destiny,
      lifePath,
      kua,
      loShuGrid,
      missingNumbers,
      excessNumbers,
      loShuOrder,
      personalYear,
      personalMonth,
      personalDay,
      nameTotalSum,
      nameNumber,
      mobileNumber,
      mobileNumberPairs,
    };
  }
}
