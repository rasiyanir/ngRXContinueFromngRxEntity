import { createFeatureSelector, createSelector } from "@ngrx/store";
import { RouterStateUrl } from "src/app/store/router/custom-serializer";
import { getCurrentRoute } from "src/app/store/router/router.selector";
import { postAdapter, postState } from "./post.state";

export const POST_STATE_NAME = 'posts';

const getPostState = createFeatureSelector<postState>(POST_STATE_NAME);

export const postSelector = postAdapter.getSelectors();

export const getPosts = createSelector(getPostState, postSelector.selectAll);

export const getPostEntities = createSelector(getPostState, postSelector.selectEntities);

export const getPostById = createSelector(
  getPostEntities, getCurrentRoute, (posts, route: RouterStateUrl) => {
  return posts ? posts[route.params['id']] : null;
})
