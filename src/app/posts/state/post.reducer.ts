import { createReducer, on } from "@ngrx/store";
import { addPostSuccess, deletePost, deletePostSuccess, loadPostsSuccess, updatePost, updatePostSuccess } from "./post.actions";
import { initialState, postAdapter } from "./post.state";

const _postReducer = createReducer(
  initialState,
  on(addPostSuccess, (state, action) => {
    return postAdapter.addOne(action.post, state);
  }),
  on(updatePostSuccess, (state, action) => {
    return postAdapter.updateOne(action.post, state);
  }),
  on(deletePostSuccess, (state, { id }) => {
    return postAdapter.removeOne(id, state);
  }),
  on(loadPostsSuccess, (state, action) => {
    return postAdapter.setAll(action.posts, state);
  }))

export function PostReducer(state: any, action: any) {
  return _postReducer(state, action);
}
