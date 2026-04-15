import { Component, Input, signal, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { LowerCasePipe } from '@angular/common';

@Component({
  selector: 'app-feature-placeholder',
  imports: [MatIconModule, LowerCasePipe],
  template: `
    <div class="placeholder-container">
      <div class="placeholder-card">
        <mat-icon class="placeholder-icon">{{ icon() }}</mat-icon>
        <h1>{{ title() }}</h1>
        <p>This feature is coming soon! Our team is currently working hard to bring you the best experience for {{ title() | lowercase }}.</p>
        <button class="btn-primary" (click)="goHome()">Back to Home</button>
      </div>
    </div>
  `,
  styles: [`
    @use 'variables' as *;
    @use 'mixins' as *;

    .placeholder-container {
      @include flex-center;
      min-height: 60vh;
      padding: $space-8;
    }

    .placeholder-card {
      @include card;
      text-align: center;
      max-width: 500px;
      padding: $space-10;

      h1 {
        @include heading($font-size-3xl);
        margin-bottom: $space-4;
      }

      p {
        @include body-text;
        color: $color-text-secondary;
        margin-bottom: $space-8;
      }
    }

    .placeholder-icon {
      font-size: 80px;
      width: 80px;
      height: 80px;
      color: $color-primary-light;
      margin-bottom: $space-6;
    }

    .btn-primary {
      @include btn-primary;
    }
  `]
})
export class FeaturePlaceholderComponent implements OnInit {
  private router = inject(Router);
  title = signal('Feature');
  icon = signal('construction');

  ngOnInit() {
    // Determine title/icon based on route
    const path = this.router.url;
    if (path.includes('flights')) { this.title.set('Flights'); this.icon.set('flight'); }
    else if (path.includes('packages')) { this.title.set('Flight + Hotel'); this.icon.set('card_travel'); }
    else if (path.includes('car-rental')) { this.title.set('Car Rental'); this.icon.set('directions_car'); }
    else if (path.includes('attractions')) { this.title.set('Attractions'); this.icon.set('attractions'); }
    else if (path.includes('taxis')) { this.title.set('Airport Taxis'); this.icon.set('local_taxi'); }
  }

  goHome() {
    this.router.navigate(['/']);
  }
}
