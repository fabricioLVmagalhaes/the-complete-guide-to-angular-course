import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import { AuthInterceptorService } from './auth/auth.interceptor.service';
import { HeaderComponent } from './header/header.component';
import { RecipesModule } from './recipes/recipes.module';
import { AlertComponet } from './shared/alert/alert.component';
import { DropdownDirective } from './shared/dropdown.directive';
import { LoaddingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';
import { PlaceholderDirective } from './shared/placeholder/placeholder.directive';
import { ShoppingListModule } from './shopping-list/shopping-list.module';

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    HeaderComponent,
    LoaddingSpinnerComponent,
    DropdownDirective,
    AlertComponet,
    PlaceholderDirective,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    RecipesModule,
    ShoppingListModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
  entryComponents: [AlertComponet],
})
export class AppModule {}
