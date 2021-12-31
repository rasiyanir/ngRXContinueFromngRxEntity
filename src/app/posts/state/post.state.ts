import { Post } from "src/app/models/posts.model";
import { createEntityAdapter, EntityState } from "@ngrx/entity";

export interface postState extends EntityState<Post> {
  //if additional field need to be added to state it can be added liek this
  count: number;
  // loading: boolean;
}

export function sortByName(a: Post, b: Post): number{
  //decending
  const compare = a.title.localeCompare(b.title);
  if(compare > 0){
    return -1;
  }

  if(compare < 0){
    return 1;
  }

  return compare;

  //ascending
  // return a.title.localeCompare(b.title);
}

export const postAdapter = createEntityAdapter<Post>({
  //can choose select id if there is additionnal PostId in state then directly use postId
  // selectId: (post: Post) => post.id,
  sortComparer: sortByName,
});

export const initialState: postState = postAdapter.getInitialState({
  count: 0,
  // loading: false,
}
);
