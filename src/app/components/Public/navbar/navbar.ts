import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmNavigationMenuImports } from '@spartan-ng/helm/navigation-menu';
import { ThemeService } from '../../spartan/shared/themes';
import { inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
	lucideCircle,
	lucideCheck,
	lucideInfo,
	lucideSun,
	lucideMoon,
	lucideMenu,
	lucideX
} from '@ng-icons/lucide';

@Component({
  imports: [RouterLink, HlmButtonImports, HlmNavigationMenuImports, AsyncPipe, NgIcon],
  providers: [provideIcons({
		lucideCircle,
		lucideCheck,
		lucideInfo,
		lucideSun,
		lucideMoon,
		lucideMenu,
		lucideX
	  })],
  selector: 'app-navbar',
  styleUrl: './navbar.css',
  templateUrl: './navbar.html',
})
export class Navbar {
	themeService = inject(ThemeService);
	public toggleTheme(): void {
		this.themeService.toggleDarkMode();
	}
  protected readonly _components = [
		{
			title: 'Alert Dialog',
			description: 'A modal dialog that interrupts the user with important content and expects a response.',
			href: '/components/alert-dialog',
		},
		{
			title: 'Hover Card',
			description: 'For sighted users to preview content available behind a link.',
			href: '/components/hover-card',
		},
		{
			title: 'Progress',
			description: 'Displays an indicator showing the completion progress of a task.',
			href: '/components/progress',
		},
		{
			title: 'Scroll Area',
			description: 'Visually or semantically separates content.',
			href: '/components/scroll-area',
		},
		{
			title: 'Tabs',
			description: 'A set of layered content panels displayed one at a time.',
			href: '/components/tabs',
		},
		{
			title: 'Tooltip',
			description: 'A popup that displays information on hover or focus.',
			href: '/components/tooltip',
		},
	];
}
