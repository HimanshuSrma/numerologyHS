import { Component, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
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
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  numerologyResult: NumerologyResult | null = null;
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private numerologyService: NumerologyService
  ) {}

  // ngOnInit(): void {
  //   if (isPlatformBrowser(this.platformId)) {
  //     window.addEventListener('beforeunload', this.beforeUnloadListener);
  //   }
  // }

  // ngOnDestroy(): void {
  //   if (isPlatformBrowser(this.platformId)) {
  //     window.removeEventListener('beforeunload', this.beforeUnloadListener);
  //   }
  // }

  // beforeUnloadListener = (event: BeforeUnloadEvent) => {
  //   event.preventDefault();
  //   event.returnValue = ''; // Required for Chrome to show the prompt
  //   return '';
  // };

  handleCalculation(data: NumerologyInput) {
    console.log('app', data);

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

  // // Disable Right-click (context menu)
  // @HostListener('document:contextmenu', ['$event'])
  // onRightClick(event: MouseEvent): void {
  //   event.preventDefault(); // Prevent the context menu from showing
  //   console.log('Right-click is disabled');
  // }

  // // Disable the Ctrl key and specific combinations like Ctrl+C, Ctrl+V
  // @HostListener('document:keydown', ['$event'])
  // onKeydown(event: KeyboardEvent): void {
  //   // Block Ctrl key (any key with Ctrl pressed)
  //   if (event.ctrlKey) {
  //     event.preventDefault();
  //     event.stopPropagation();
  //     console.log('Ctrl key press is disabled');
  //   }

  //   // Block Ctrl+C (Copy)
  //   if (event.ctrlKey && event.key === 'c') {
  //     event.preventDefault();
  //     console.log('Ctrl+C (Copy) is disabled');
  //   }

  //   // Block Ctrl+V (Paste)
  //   if (event.ctrlKey && event.key === 'v') {
  //     event.preventDefault();
  //     console.log('Ctrl+V (Paste) is disabled');
  //   }

  //   // Block Ctrl+A (Select All)
  //   if (event.ctrlKey && event.key === 'a') {
  //     event.preventDefault();
  //     console.log('Ctrl+A (Select All) is disabled');
  //   }
  // }
}
