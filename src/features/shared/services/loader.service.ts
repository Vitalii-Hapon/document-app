import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private loader = signal(0);
  public isLoading = computed(() => this.loader() > 0);
  private navigationIsStarted: boolean = false;

  public startLoading(): void {
    this.loader.update(value => value + 1);
  }

  public endLoading(): void {
    if (this.isLoading()) {
      this.loader.update(value => value - 1);
    } else {
      this.loader.set(0);
    }
  }

  public startNavigationLoader(): void {
    if (!this.navigationIsStarted) {
      this.navigationIsStarted = !this.navigationIsStarted;
      this.startLoading();
    }
  }

  public endNavigationLoader(): void {
    this.navigationIsStarted = !this.navigationIsStarted;
    this.endLoading();
  }

}
