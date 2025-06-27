import { animate, style, transition, trigger } from '@angular/animations';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.scss',
  animations: [
      trigger('fade', [
        transition(':enter', [
          style({ opacity: 0 }),
          animate('1000ms ease-in', style({ opacity: 1 }))
        ]),
        transition(':leave', [
          animate('1000ms ease-out', style({ opacity: 0 }))
        ])
      ])
    ]
})
export class LoaderComponent {
@Input() isLoading: boolean = true; // Default to true, can be set from parent component
}
