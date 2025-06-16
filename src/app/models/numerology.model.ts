// Types
// export type LoShuNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type LoShuNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type Gender = 'male' | 'female';

// Input from user
export interface NumerologyInput {
  name: string;
  dob: string;     // Format: yyyy-mm-dd
  gender: Gender;
}

// Result from calculations
export interface NumerologyResult {
  name : string,
  destiny: number;
  lifePath: number;
  kua: number;
  loShuGrid: Record<LoShuNumber, number>;
  loShuOrder: LoShuNumber[];
  missingNumbers: LoShuNumber[];
  excessNumbers: LoShuNumber[];
  personalYear: number;
  personalMonth: number;
  personalDay: number;
  nameTotalSum:number
  nameNumber: number;
}


// Remedy suggestions (optional)
export interface NumerologyRemedy {
  number: LoShuNumber;
  type: 'missing' | 'excess';
  suggestion: string;
}
