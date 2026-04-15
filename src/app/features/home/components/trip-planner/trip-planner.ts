import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-trip-planner',
  templateUrl: './trip-planner.html',
  styleUrl: './trip-planner.scss'
})
export class TripPlannerComponent {
  tabs = ['Coastal Relaxation', 'Historical Tours', 'City Explorations', 'Nature Getaways'];
  activeTab = signal(this.tabs[1]);

  destinations = [
    { name: 'Mumbai', distance: '120 km away', image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=500&q=80' },
    { name: 'Aurangabad', distance: '216 km away', image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=500&q=80' },
    { name: 'Hampi', distance: '451 km away', image: 'https://images.unsplash.com/photo-1600011689032-8b628b8a8747?w=500&q=80' },
    { name: 'Hyderabad', distance: '501 km away', image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=500&q=80' },
    { name: 'Jaipur', distance: '955 km away', image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=500&q=80' }
  ];

  selectTab(tab: string): void {
    this.activeTab.set(tab);
  }
}
