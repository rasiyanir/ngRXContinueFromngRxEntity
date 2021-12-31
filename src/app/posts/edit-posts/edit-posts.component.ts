import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Post } from 'src/app/models/posts.model';
import { AppState } from 'src/app/store/app.state';
import { updatePost } from '../state/post.actions';
import { getPostById } from '../state/post.selector';

@Component({
  selector: 'app-edit-posts',
  templateUrl: './edit-posts.component.html',
  styleUrls: ['./edit-posts.component.scss']
})
export class EditPostsComponent implements OnInit, OnDestroy {

  post!: Post | undefined | null;
  postForm!: FormGroup;
  postSubscription!: Subscription;

  constructor(private route: ActivatedRoute, private store: Store<AppState>, private router: Router) { }

  ngOnInit(): void {
    this.createForm();
    this.store.select(getPostById).subscribe((post) => {
      if(post){
        this.post = post;
        this.postForm.patchValue({
          title: post?.title,
          description: post?.description
        })
      }
    });
    // this.route.paramMap.subscribe( (params) => {
    //   console.log(params.get('id'));
    //   const id = params.get('id');
    //   this.postSubscription = this.store.select(getPostById, { id }).subscribe( (data) => {
    //       this.post = data;
    //       this.createForm();
    //   })
    // })
  }

  createForm(){
    this.postForm = new FormGroup({
      title: new FormControl(null, [
        Validators.required,
        Validators.minLength(6),
      ]),
      description: new FormControl(null, [
        Validators.required,
        Validators.minLength(10),
      ])
    });
  }

  get title(){
    return this.postForm.controls['title'];
  }

  get descriptionForm(){
    return this.postForm.controls['description'];
  }

  showDescriptionErrors(){
    // const descriptionForm = this.postForm.get('description');
    if(this.descriptionForm?.touched && this.descriptionForm?.invalid){
      if(this.descriptionForm.errors?.required){
        return 'Description is required';
      }
      if(this.descriptionForm.errors?.minlength){
        return 'Description should be of minimum 10 characters length';
      }
    }
    return '';
  }

  ngOnDestroy(): void {
      if(this.postSubscription){
        this.postSubscription.unsubscribe();
      }
  }

  onUpdatePost(){
    if(this.postForm.invalid){
      return;
    }

    const title = this.postForm.value.title;
    const description = this.postForm.value.description;

    const post: Post = {
      id: this.post?.id,
      title,
      description
    }

    this.store.dispatch(updatePost({ post }));
    // this.router.navigate(['posts']);
  }

}
