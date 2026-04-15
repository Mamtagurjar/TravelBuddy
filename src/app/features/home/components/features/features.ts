import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-features',
  imports: [MatIconModule],
  templateUrl: './features.html',
  styleUrl: './features.scss'
})
export class FeaturesComponent {
  features = [
    { 
      icon: 'event_available', 
      title: 'Book now, pay at the property', 
      desc: 'FREE cancellation on most rooms',
      color: '#10B981' // Success Green
    },
    { 
      icon: 'reviews', 
      title: '300M+ reviews from fellow travelers', 
      desc: 'Get trusted information from guests like you',
      color: '#F97316' // Accent Coral
    },
    { 
      icon: 'public', 
      title: '2+ million properties worldwide', 
      desc: 'Hotels, guest houses, apartments, and more...',
      color: '#D97706' // Warm Amber
    },
    { 
      icon: 'support_agent', 
      title: 'Trusted 24/7 customer service', 
      desc: 'We\'re always here to help',
      color: '#0F766E' // Primary Teal
    }
  ];
}
