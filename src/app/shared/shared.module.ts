import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AlertComponet } from './alert/alert.component';
import { DropdownDirective } from './dropdown.directive';
import { LoaddingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { PlaceholderDirective } from './placeholder/placeholder.directive';

@NgModule({
  declarations: [
    LoaddingSpinnerComponent,
    DropdownDirective,
    AlertComponet,
    PlaceholderDirective,
  ],
  imports: [CommonModule],
  exports: [
    AlertComponet,
    LoaddingSpinnerComponent,
    PlaceholderDirective,
    DropdownDirective,
    CommonModule,
  ],
  entryComponents: [AlertComponet],
})
export class SharedModule {}
