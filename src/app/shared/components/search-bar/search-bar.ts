import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-search-bar',
  imports: [FormsModule, MatIconModule],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.scss',
})
export class SearchBarComponent {
  /** Form state — each input field has its own signal */
  destination = signal('');
  checkIn = signal('');
  checkOut = signal('');
  guests = signal('2 adults · 0 children · 1 room');

  /** Called when user clicks Search */
  onSearch(): void {
    console.log('Searching:', {
      destination: this.destination(),
      checkIn: this.checkIn(),
      checkOut: this.checkOut(),
      guests: this.guests(),
    });
    // TODO: Navigate to search results page with query params
  }
}
