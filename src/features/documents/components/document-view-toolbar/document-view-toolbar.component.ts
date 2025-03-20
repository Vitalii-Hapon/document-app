import {
  ChangeDetectionStrategy,
  Component,
  Input,
  input,
  InputSignal,
  output, OutputEmitterRef,
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTooltipModule } from "@angular/material/tooltip";

import { DocumentAction, IDocument } from "../../index";


@Component({
  selector: 'app-document-view-toolbar',
  imports: [
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatToolbarModule,
    MatTooltipModule,
    ReactiveFormsModule,
  ],
  templateUrl: './document-view-toolbar.component.html',
  styleUrl: './document-view-toolbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentViewToolbarComponent {
  protected readonly documentAction = DocumentAction;

  public back:OutputEmitterRef<void> = output<void>();
  public revertNameChanges:OutputEmitterRef<void> = output<void>();
  public updateName:OutputEmitterRef<void> = output<void>();
  public sendToReview:OutputEmitterRef<void> = output<void>();
  public revoke:OutputEmitterRef<void> = output<void>();
  public changeStatus:OutputEmitterRef<DocumentAction> = output<DocumentAction>();
  public delete:OutputEmitterRef<void> = output<void>();

  public isReviewer: InputSignal<boolean> = input<boolean>(false);
  public document: InputSignal<IDocument> = input.required<IDocument>();
  public isNameChanged: InputSignal<boolean> = input<boolean>(false);

  @Input() documentNameControl!: FormControl<string | null>;
  @Input({required: true}) isActionAllowed!: (action: DocumentAction) => boolean;
}
