import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

export const NOTIFICATION_DURATION: number = 6;

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private snackBar: MatSnackBar = inject(MatSnackBar);

  public open(message: string): void {
    this.snackBar.open(message, 'close', {duration: NOTIFICATION_DURATION * 1000});
  }
}
