import { Post } from "src/app/models/posts.model";
import { createEntityAdapter, EntityState } from "@ngrx/entity";

export interface postState extends EntityState<Post> {}

export const postAdapter = createEntityAdapter<Post>();

export const initialState: postState = postAdapter.getInitialState();
