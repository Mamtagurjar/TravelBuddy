import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../shared/components/header/header';
import { FooterComponent } from '../../shared/components/footer/footer';

/**
 * MainLayoutComponent
 * -------------------
 * This is the "shell" layout for all public-facing pages.
 *
 * Structure:
 *  ┌──────────────────────────────────────────┐
 *  │           HeaderComponent                │  ← sticky top nav
 *  ├──────────────────────────────────────────┤
 *  │                                          │
 *  │           <router-outlet>                │  ← page content
 *  │           (HomePage, TripsPage, etc.)    │
 *  │                                          │
 *  ├──────────────────────────────────────────┤
 *  │           FooterComponent (future)       │
 *  └──────────────────────────────────────────┘
 *
 * Why a layout component?
 *  - Header appears on ALL pages (except auth pages)
 *  - The router-outlet inside this layout renders page-specific content
 *  - Auth pages (login/register) use a DIFFERENT layout (AuthLayout)
 *  - This avoids duplicating the header in every page component
 */
@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayoutComponent { }
