import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';


import { Post } from './post.model';

@Injectable({providedIn: 'root'})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{posts: Post[]}>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts() {
    this.http
      .get<{ posts: any }>('http://localhost:3000/api/posts')
      .pipe( // postData is an Observable/object containing = {posts: fetchedPosts}
        map(postData => { // postData is WHOLE object: {posts: fetchedPosts[]}
          return { // postData refers to line 77/78 in posts.js file sent back by api
            posts: postData.posts.map(post => { // mapping thru all of wrestler objects posted inside array...
              // we are transforming that Observable object into a new object to also include an id property (created by mongo)
              return {
                name: post.name,
                brand: post.brand,
                finisher: post.finisher,
                id: post._id,
                imagePath: post.imagePath
              };
            }),
          };
        })
      )
      .subscribe(transformedPostData => { // transformedPostData is WHOLE OBJECT containing array of posts {posts: transformed posts}
        this.posts = transformedPostData.posts; //  all the wrestler objects inside an array
        this.postsUpdated.next({posts: [...this.posts]}); // copying the objects with the spread operator and placing them into an array
      });
   }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    return this.http.get<{ _id: string; name: string; brand: string, finisher: string, imagePath: string }>(
      'http://localhost:3000/api/posts/' + id // + id becomes part of path(parameterised route)
    );
  }

  addPost(name: string, brand: string, image: File, finisher: string) {
    const postData = new FormData();
    postData.append('name', name);
    postData.append('brand', brand);
    postData.append('image', image, name);
    postData.append('finisher', finisher);
    this.http
    .post('http://localhost:3000/api/posts/', postData)
    .subscribe(responseData => {
      this.router.navigate(['/']);
    });
  }

  updatePost(id: string, name: string, brand: string, image: File | string, finisher: string) {
    let postData: Post| FormData;
    if (typeof image === 'object') { // object == File. If we wanna replace image, overwrite previous imagepath from mongodb with FormData!
     postData = new FormData();
     postData.append('id', id);
     postData.append('name', name);
     postData.append('brand', brand);
     postData.append('image', image, name);
     postData.append('finisher', finisher);
    } else { // aka else if (typeof image === 'string') because its using the imagePath from mongodb
      postData = { id, name, brand, imagePath: image, finisher };
      // line 75 above; if we aren't replacing the image, create imagePath key & pass the image value(image path, string)
    }
    this.http
    .put('http://localhost:3000/api/posts/' + id, postData) // + id becomes part of path(parameterised route)
    .subscribe(response => {
      this.router.navigate(['/']);
    });
  }

  deletePost(postId: string) {
    return this.http
      .delete('http://localhost:3000/api/posts/' + postId);

  }

}