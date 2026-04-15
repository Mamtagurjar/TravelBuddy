import { Component, signal } from '@angular/core';
import { LanguageModalComponent } from '../language-modal/language-modal';

@Component({
  selector: 'app-footer',
  imports: [LanguageModalComponent],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
  isLanguageModalOpen = signal(false);

  openLanguageModal(): void {
    this.isLanguageModalOpen.set(true);
  }

  
  closeLanguageModal(): void {
    this.isLanguageModalOpen.set(false);
  }
}
