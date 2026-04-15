import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { LanguageModalComponent } from '../language-modal/language-modal';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, MatIconModule, LanguageModalComponent],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class HeaderComponent {
  isMobileMenuOpen = signal(false);
  isLanguageModalOpen = signal(false);

  navTabs = signal([
    { icon: 'hotel', label: 'Stays', route: '/', exact: true },
    { icon: 'flight', label: 'Flights', route: '/flights', exact: false },
    { icon: 'card_travel', label: 'Flight + Hotel', route: '/packages', exact: false },
    { icon: 'directions_car', label: 'Car Rental', route: '/car-rental', exact: false },
    { icon: 'attractions', label: 'Attractions', route: '/attractions', exact: false },
    { icon: 'local_taxi', label: 'Airport Taxis', route: '/taxis', exact: false },
  ]);

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update((v) => !v);
  }

  openLanguageModal(): void {
    this.isLanguageModalOpen.set(true);
  }

  closeLanguageModal(): void {
    this.isLanguageModalOpen.set(false);
  }
}
