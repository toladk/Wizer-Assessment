import { CategoryComponent } from './components/pages/category/category.component';
import { BookComponent } from './components/pages/book/book.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './components/layout/main/main.component';

const routes: Routes = [
  {
    path : '',
    redirectTo : 'main/book',
    pathMatch : 'full'
  },
  {
    path : 'main',
    component : MainComponent,
    children : [
      {
        path : '',
        redirectTo : 'book',
        pathMatch : 'full'
      },
      {
        path: 'book',
        component : BookComponent,
        // canActivate: [AuthGuard]
      },
      {
        path: 'category',
        component : CategoryComponent,
        // canActivate: [AuthGuard]
      },
      {
        path : '**',
        redirectTo : ''
      }
    ]
  },
  {
    path : '**',
    redirectTo : ''
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
