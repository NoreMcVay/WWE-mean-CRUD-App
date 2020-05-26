import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { PostsService } from '../posts.service';
import { Post } from '../post.model';
import { mimeType } from './mime-type.validator';
import { FormGroup, FormControl, Validators } from '@angular/forms';



@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.scss']
})
export class PostCreateComponent implements OnInit {
  post: Post;
  form: FormGroup;
  imagePreview: string;
  imagePreview2: string;
  private mode = 'create';
  private postId: string;

  constructor(public postsService: PostsService,
              public route: ActivatedRoute) { }

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      brand: new FormControl(Validators.required),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      }),
      modalImage: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      }),
      finisher: new FormControl(null, {
        validators: [Validators.required]
      })
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
       this.mode = 'edit';
       this.postId = paramMap.get('postId');
       console.log('POST ID = ' + this.postId);
       this.postsService.getPost(this.postId).subscribe(postData => {
          this.post = {
            id: postData._id,
            name: postData.name,
            brand: postData.brand,
            finisher: postData.finisher,
            imagePath: postData.imagePath,
            modalImagePath: postData.modalImagePath
          };
          this.form.setValue({
            name: this.post.name,
            brand: this.post.brand,
            finisher: this.post.finisher,
            image: this.post.imagePath,
            modalImage: this.post.modalImagePath
          });
       });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    console.log(file);
    this.form.patchValue({ image: file });
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string; // CHANGED FROM this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }

  onModalImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    console.log(file);
    this.form.patchValue({ modalImage: file });
    this.form.get('modalImage').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview2 = reader.result as string; // CHANGED FROM this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }

  onSavePost() {
    if (this.mode === 'create') {
      this.postsService.addPost(
        this.form.value.name,
        this.form.value.brand,
        this.form.value.image,
        this.form.value.modalImage,
        this.form.value.finisher
      );
    } else {
      this.postsService.updatePost(
        this.postId,
        this.form.value.name,
        this.form.value.brand,
        this.form.value.image,
        this.form.value.modalImage,
        this.form.value.finisher
      );
    }
  }

}
