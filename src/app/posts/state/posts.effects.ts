import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { RouterNavigatedAction, ROUTER_NAVIGATION } from "@ngrx/router-store";
import { filter, map, mergeMap, switchMap, tap } from "rxjs/operators";
import { PostService } from "src/app/services/post.service";
import { addPost, addPostSuccess, deletePost, deletePostSuccess, loadPosts, loadPostsSuccess, updatePost, updatePostSuccess } from "./post.actions";

@Injectable()
export class PostsEffects {
  constructor(private actions$: Actions, private postService: PostService, private router: Router){}

  loadPosts$ = createEffect(() => {
    return this.actions$.pipe(ofType(loadPosts),
    mergeMap((action) => {
      return this.postService.getPosts().pipe(
        map((posts) => {
          return loadPostsSuccess({posts});
        })
      )
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
        return updatePostSuccess({post: action.post});
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
      switchMap((id) => {
        return this.postService.getPostById(id).pipe(map((post) => {
          const postData = [{...post, id}];
          return loadPostsSuccess({ posts: postData});
        }))
      })
    )
  })
}
