import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css'],
})
export class AlertComponet {
  @Input() message: string;
  @Output('close') close = new EventEmitter<void>();

  onClose(){
    this.close.emit();
  }
}
