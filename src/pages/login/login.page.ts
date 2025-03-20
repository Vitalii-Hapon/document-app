import { ChangeDetectionStrategy, Component, DestroyRef, inject, Signal } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, filter, of, switchMap, take, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { AuthFormComponent, AuthService, IAuthForm, ILoginResponse, UserService } from '@features/user';
import { LoaderService, RestApiService, SessionStorageService } from '@shared';

@Component({
  selector: 'app-login',
  imports: [
    AuthFormComponent,
  ],
  templateUrl: './login.page.html',
  styleUrl: './login.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPage {
  private authService: AuthService = inject(AuthService);
  private restApi: RestApiService = inject(RestApiService);
  private router: Router = inject(Router);
  private userService: UserService = inject(UserService);
  private loader: LoaderService = inject(LoaderService);
  private storage: SessionStorageService = inject(SessionStorageService);
  private destroyRef: DestroyRef = inject(DestroyRef);

  public isLoading: Signal<boolean> = this.loader.isLoading;

  public login(form: IAuthForm): void {
    this.restApi.login(form)
      .pipe(
        take(1),
        tap(_ => this.storage.clear()),
        tap((res: ILoginResponse) => this.authService.token = res.access_token || ''),
        switchMap(_ => this.restApi.getUser()),
        catchError(err => of(null)),
        filter(userData => !!userData),
        tap(user => this.userService.user = user),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(data => this.router.navigate(['/documents']))
  }
}
