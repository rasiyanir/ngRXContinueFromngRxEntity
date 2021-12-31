import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Update } from "@ngrx/entity";
import { RouterNavigatedAction, ROUTER_NAVIGATION } from "@ngrx/router-store";
import { Store } from "@ngrx/store";
import { of } from "rxjs";
import { filter, map, mergeMap, switchMap, tap, withLatestFrom } from "rxjs/operators";
import { Post } from "src/app/models/posts.model";
import { PostService } from "src/app/services/post.service";
import { AppState } from "src/app/store/app.state";
import { addPost, addPostSuccess, deletePost, deletePostSuccess, dummyAction, loadPosts, loadPostsSuccess, updatePost, updatePostSuccess } from "./post.actions";
import { getPosts } from "./post.selector";

@Injectable()
export class PostsEffects {
  constructor(private actions$: Actions, private postService: PostService, private router: Router, private store: Store<AppState>){}

  loadPosts$ = createEffect(() => {
    return this.actions$.pipe(
    ofType(loadPosts),
    withLatestFrom(this.store.select(getPosts)),
    mergeMap(([action, posts]) => {
      if(!posts.length || posts.length === 1){
        return this.postService.getPosts().pipe(
          map((posts) => {
            return loadPostsSuccess({posts});
          })
        )
      }
      return of(dummyAction());
    }))
  });

  addPost$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(addPost),
      mergeMap((action) => {
        return this.postService.addPost(action.post).pipe(
          map((data) => {
            const post = {...action.post, id: data.name};
            return addPostSuccess({ post });
          })
        );
      })
    );
  });

  postsRedirect$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(...[addPostSuccess, updatePostSuccess]),
      tap((action) => {
          this.router.navigate(['posts']);
      })
    )
  }, {dispatch: false});

  updatePost$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(updatePost),
      switchMap((action) => {
      return this.postService.updatePost(action.post).pipe(
        map((data) => {
          const updatedPost: Update<Post> = {
            id: action.post.id,
            changes: {
              ...action.post,
            }
          }
        return updatePostSuccess({post: updatedPost});
      })
      );
    })
    );
  });

  deletePost$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(deletePost),
      switchMap((action) => {
      return this.postService.deletePost(action.id).pipe(
        map((data) => {
        return deletePostSuccess({id: action.id});
      })
      );
    })
    );
  });

  getSinglePost$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ROUTER_NAVIGATION),
      filter((r: RouterNavigatedAction) => {
        return r.payload.routerState.url.startsWith('/posts/details');
      }),
      map((r: RouterNavigatedAction) => {
        return r.payload.routerState.root.params['id'];
      }),
      withLatestFrom(this.store.select(getPosts)),
      switchMap(([id, posts]) => {
        if(!posts.length){
          return this.postService.getPostById(id).pipe(map((post) => {
            const postData = [{...post, id}];
            return loadPostsSuccess({ posts: postData});
          }))
        }
        return of(dummyAction());
      })
    )
  })
}
