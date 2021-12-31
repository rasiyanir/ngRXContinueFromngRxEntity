import { Post } from "src/app/models/posts.model";

export interface postState {
  posts: Post[]
}

export const initialState: postState = {
  posts: [],
}
