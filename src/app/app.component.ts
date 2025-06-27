import { Component, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { InputFormComponent } from './components/input-form/input-form.component';
import { ResultDisplayComponent } from './components/result-display/result-display.component';
import { NumerologyInput } from './models/numerology.model';
import { NumerologyService } from './services/numerology.service';
import { NumerologyResult } from './models/numerology.model';
import { FirestoreService } from './services/firestore.service';
// import { driverConductordata, numbersRemedy, personalYearData, personalMonthData, personalDayData, nameNumberCharacteristics, englishMobilePairsMeaningArr, hindiMobilePairsMeaningArr, mustExcludePairs, repetitionOfNumbers, nameLettersData} from '../assets/data/data';
import { trigger, transition, style, animate } from '@angular/animations';
import { LoaderComponent } from "./components/loader/loader.component";
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, InputFormComponent, ResultDisplayComponent, LoaderComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})

export class AppComponent {
  loader: boolean = true;
  numerologyResult: NumerologyResult | null = null;
  constructor(private fs:FirestoreService,@Inject(PLATFORM_ID) private platformId: Object,private numerologyService: NumerologyService) {}

  ngOnInit(): void {
    // if (isPlatformBrowser(this.platformId)) {
    //   window.addEventListener('beforeunload', this.beforeUnloadListener);
    // }
    setTimeout(() => {
      this.uploadAll();
      this.fetchAllData();
    }, 0);
  }
  
  ngOnDestroy(): void {
    // if (isPlatformBrowser(this.platformId)) {
    //   window.removeEventListener('beforeunload', this.beforeUnloadListener);
    // }
  }
  
  async uploadAll() {
    // await this.fs.uploadData(driverConductordata,'driverConductordata');
    // await this.fs.uploadData(nameLettersData,'nameLettersData');
    // await this.fs.uploadData(nameNumberCharacteristics,'nameNumberCharacteristics');
    // await this.fs.uploadData(numbersRemedy,'numbersRemedy');
    // await this.fs.uploadData(personalDayData,'personalDayData');
    // await this.fs.uploadData(personalMonthData,'personalMonthData');
    // await this.fs.uploadData(personalYearData,'personalYearData');
    // await this.fs.uploadData(repetitionOfNumbers,'repetitionOfNumbers');
    // await this.fs.uploadData(englishMobilePairsMeaningArr,'englishMobilePairsMeaningArr');
    // await this.fs.uploadData(hindiMobilePairsMeaningArr,'hindiMobilePairsMeaningArr');
    // await this.fs.uploadData(mustExcludePairs,'mustExcludePairs');
    // console.group('All data sets uploaded!');
  }


  async fetchAllData(){
    this.fs.numbersData = await this.fs.getData('numbersRemedy');
    this.fs.personalYearData = await this.fs.getData('personalYearData');
    this.fs.personalMonthData = await this.fs.getData('personalMonthData');
    this.fs.personalDayData = await this.fs.getData('personalDayData');
    this.fs.nameNumberCharacteristics = await this.fs.getData('nameNumberCharacteristics');
    this.fs.englishMobilePairsMeaningArr = await this.fs.getData('englishMobilePairsMeaningArr');
    // this.fs.hindiMobilePairsMeaningArr = await this.fs.getData('hindiMobilePairsMeaningArr');
    this.fs.repetitionOfNumbers = await this.fs.getData('repetitionOfNumbers');
    this.fs.nameLettersData = await this.fs.getData('nameLettersData'); 
    console.group('All data fetched!');
    this.loader = false;
  };
  

  handleCalculation(data: NumerologyInput) {
    this.numerologyResult = this.numerologyService.calculateAll(
      data.name,
      data.dob,
      data.gender,
      data.mobile
    );
  }

  reset() {
    this.numerologyResult = null;
  }

  beforeUnloadListener = (event: BeforeUnloadEvent) => {
    event.preventDefault();
    event.returnValue = ''; // Required for Chrome to show the prompt
    return '';
  };

  // Disable Right-click (context menu)
  // @HostListener('document:contextmenu', ['$event'])
  // onRightClick(event: MouseEvent): void {
  //   event.preventDefault(); // Prevent the context menu from showing
  //   console.log('Right-click is disabled');
  // }

  // Disable the Ctrl key and specific combinations like Ctrl+C, Ctrl+V
  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    // Block Ctrl key (any key with Ctrl pressed)
    // if (event.ctrlKey) {
    //   event.preventDefault();
    //   event.stopPropagation();
    //   console.log('Ctrl key press is disabled');
    // }

    // Block Ctrl+C (Copy)
    if (event.ctrlKey && event.key === 'c') {
      event.preventDefault();
      console.log('Ctrl+C (Copy) is disabled');
    }

    // // Block Ctrl+V (Paste)
    // if (event.ctrlKey && event.key === 'v') {
    //   event.preventDefault();
    //   console.log('Ctrl+V (Paste) is disabled');
    // }

    // // Block Ctrl+A (Select All)
    // if (event.ctrlKey && event.key === 'a') {
    //   event.preventDefault();
    //   console.log('Ctrl+A (Select All) is disabled');
    // }

  }
  
}
