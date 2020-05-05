import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
// origin3 for update github

import { AppComponent } from './app.component';
import { PostCreateComponent } from './postsFolder/post-create/post-create.component';
import { PostListComponent } from './postsFolder/post-list/post-list.component';
import { AppRoutingModule } from './app-routing.module';
import { NavbarComponent } from './navbar/navbar.component';
import { WrestlerDetailsModalComponent } from './postsFolder/postsModal/wrestler-details-modal/wrestler-details-modal.component';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    AppComponent,
    PostCreateComponent,
    PostListComponent,
    NavbarComponent,
    WrestlerDetailsModalComponent
  ],
  entryComponents: [
    WrestlerDetailsModalComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    NgbModule
  ],
  providers: [
    NgbActiveModal
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
