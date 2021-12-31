import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Post } from 'src/app/models/posts.model';
import { AppState } from 'src/app/store/app.state';
import { addPost } from '../state/post.actions';

@Component({
  selector: 'app-add-posts',
  templateUrl: './add-posts.component.html',
  styleUrls: ['./add-posts.component.scss']
})
export class AddPostsComponent implements OnInit {

  postForm!: FormGroup;

  constructor(private store: Store<AppState>) { }

  ngOnInit(): void {
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

  onAddPost(){
    if(this.postForm.invalid){
      return;
    }
    const post: Post = {
      title: this.postForm.value.title,
      description: this.postForm.value.description,
    }

    this.store.dispatch(addPost({post}));
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
}
