import {
  ChangeDetectionStrategy,
  Component,
  input,
  InputSignal,
  output,
  OutputEmitterRef,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { IAuthForm } from '../models';
import { IForm } from '@shared';

@Component({
  selector: 'app-auth-form',
  imports: [
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './auth-form.component.html',
  styleUrl: './auth-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthFormComponent {
  public title: InputSignal<string> = input<string>('authentication form');
  public textBtn: InputSignal<string> = input<string>('submit');
  public isLoading: InputSignal<boolean> = input<boolean>(false);
  public onSubmit: OutputEmitterRef<IAuthForm> = output<IAuthForm>();
  public formGroup: FormGroup<IForm<IAuthForm>> = new FormGroup({
    email: new FormControl('',  [Validators.required, Validators.email]),
    password: new FormControl('',[Validators.required, Validators.minLength(6)])
  });

  public submit(): void {
    this.onSubmit.emit(this.formGroup.value as IAuthForm);
  }
}
