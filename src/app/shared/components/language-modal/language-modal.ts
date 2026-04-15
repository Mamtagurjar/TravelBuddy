import { Component, Output, EventEmitter } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-language-modal',
  imports: [MatIconModule],
  templateUrl: './language-modal.html',
  styleUrl: './language-modal.scss'
})
export class LanguageModalComponent {
  @Output() close = new EventEmitter<void>();

  selectedLang = 'English (US)';

  // Top suggestions
  suggestedLanguages = [
    { name: 'English (UK)', flag: 'gb' },
    { name: 'हिन्दी', flag: 'in' },
    { name: 'Français', flag: 'fr' },
    { name: '简体中文', flag: 'cn' },
    { name: 'Deutsch', flag: 'de' },
  ];

  // Full grid of languages
  allLanguages = [
    { name: 'English (US)', flag: 'us' },
    { name: 'English (UK)', flag: 'gb' },
    { name: 'Deutsch', flag: 'de' },
    { name: 'Nederlands', flag: 'nl' },
    { name: 'Français', flag: 'fr' },
    { name: 'Español', flag: 'es' },
    { name: 'Español (AR)', flag: 'ar' },
    { name: 'Español (MX)', flag: 'mx' },
    { name: 'Català', flag: 'es-ct' },
    { name: 'Italiano', flag: 'it' },
    { name: 'Português (PT)', flag: 'pt' },
    { name: 'Português (BR)', flag: 'br' },
    { name: 'Norsk', flag: 'no' },
    { name: 'Suomi', flag: 'fi' },
    { name: 'Svenska', flag: 'se' },
    { name: 'Dansk', flag: 'dk' },
    { name: 'Čeština', flag: 'cz' },
    { name: 'Magyar', flag: 'hu' },
    { name: 'Română', flag: 'ro' },
    { name: '日本語', flag: 'jp' },
    { name: '简体中文', flag: 'cn' },
    { name: '繁體中文', flag: 'tw' },
    { name: 'Polski', flag: 'pl' },
    { name: 'Ελληνικά', flag: 'gr' },
    { name: 'Русский', flag: 'ru' },
    { name: 'Türkçe', flag: 'tr' },
    { name: 'Български', flag: 'bg' },
    { name: 'العربية', flag: 'sa' },
  ];

  onClose(): void {
    this.close.emit();
  }

  selectLanguage(langName: string): void {
    this.selectedLang = langName;
  }
}
