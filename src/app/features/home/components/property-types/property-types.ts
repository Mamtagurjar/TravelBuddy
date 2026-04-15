import { Component } from '@angular/core';

@Component({
  selector: 'app-property-types',
  templateUrl: './property-types.html',
  styleUrl: './property-types.scss'
})
export class PropertyTypesComponent {
  properties = [
    { name: 'Hotels', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&q=80' },
    { name: 'Apartments', image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500&q=80' },
    { name: 'Resorts', image: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=500&q=80' },
    { name: 'Villas', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500&q=80' },
    { name: 'Hotels', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&q=80' },
    { name: 'Apartments', image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500&q=80' },
    { name: 'Cabins', image: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=500&q=80' }
  ];
}
