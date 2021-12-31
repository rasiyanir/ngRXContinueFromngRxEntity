import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SinglePostComponent } from './posts/single-post/single-post.component';
import { AuthGuard } from './services/auth.guard';

const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {
    path: 'counter',
    loadChildren: () => import('./counter/counter.module').then((m) => m.CounterModule),
  },
  {
    path: 'posts',
    loadChildren: () => import('./posts/posts.module').then((m) => m.PostsModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'posts/details/:id',
    component: SinglePostComponent
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.authModule),
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
