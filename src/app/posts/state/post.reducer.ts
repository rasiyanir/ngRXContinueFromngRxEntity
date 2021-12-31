import { createReducer, on } from "@ngrx/store";
import { addPostSuccess, deletePost, deletePostSuccess, loadPostsSuccess, updatePost, updatePostSuccess } from "./post.actions";
import { initialState } from "./post.state";

const _postReducer = createReducer(
  initialState,
  on(addPostSuccess, (state, action) => {
    let post = { ...action.post};
    return {
      ...state,
      posts: [...state.posts, post]
    }
  }),
  on(updatePostSuccess, (state, action) => {
    const updatedPosts = state.posts.map((post) => {
      return action.post.id === post.id ? action.post : post
    });
    return {
      ...state,
      posts: updatedPosts,
    }
  }),
  on(deletePostSuccess, (state, action) => {
    const updatedPosts = state.posts.filter( (post) => {
      return post.id !== action.id;
    })
    return {
      ...state,
      posts: updatedPosts,
    }
  }),
  on(loadPostsSuccess, (state, action) => {
    return {
      ...state,
      posts: action.posts,
    }
  }))

export function PostReducer(state: any, action: any) {
  return _postReducer(state, action);
}
