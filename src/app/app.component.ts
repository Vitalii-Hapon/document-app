import { ChangeDetectionStrategy, Component, inject, Signal } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NavigationEnd, NavigationStart, Router, RouterOutlet } from '@angular/router';
import { distinctUntilChanged } from 'rxjs';

import { LoaderService } from '@shared';

@Component({
  selector: 'app-root',
  imports: [
    MatProgressSpinnerModule,
    MatSnackBarModule,
    RouterOutlet,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  public title = 'Documents App';
  private loader: LoaderService = inject(LoaderService);
  public isLoading: Signal<boolean> = this.loader.isLoading;
  private router: Router = inject(Router);

  constructor() {
    this.router.events
      .pipe(distinctUntilChanged())
      .subscribe(event => {
        if (event instanceof NavigationStart) {
          this.loader.startNavigationLoader();
        }
        if (event instanceof NavigationEnd) {
          this.loader.endNavigationLoader();
        }
      });
  }
}
