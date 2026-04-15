import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/**
 * App Root Component
 * -----------------
 * This is the entry point of the entire application.
 * It does NOTHING except render <router-outlet>.
 *
 * The router-outlet acts as a placeholder where Angular
 * injects the matched route's component (e.g., MainLayout).
 */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
