import { Component } from '@angular/core';
import { HeroComponent } from './components/hero/hero';
import { SearchBarComponent } from '../../shared/components/search-bar/search-bar';
import { FeaturesComponent } from './components/features/features';
import { OffersComponent } from './components/offers/offers';
import { PropertyTypesComponent } from './components/property-types/property-types';
import { TripPlannerComponent } from './components/trip-planner/trip-planner';


@Component({
  selector: 'app-home',
  imports: [
    HeroComponent, 
    SearchBarComponent, 
    FeaturesComponent, 
    OffersComponent, 
    PropertyTypesComponent, 
    TripPlannerComponent
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomeComponent {}
