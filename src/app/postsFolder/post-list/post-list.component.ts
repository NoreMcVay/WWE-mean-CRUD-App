import { Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';


import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { WrestlerDetailsModalComponent } from '../postsModal/wrestler-details-modal/wrestler-details-modal.component';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  private postsSub: Subscription;


  constructor(private router: Router,
              public postsService: PostsService,
              private modalService: NgbModal) { }

  ngOnInit() {
    this.postsService.getPosts();
    this.postsSub = this.postsService.getPostUpdateListener()
      .subscribe((postData: {posts: Post[]}) => { // {posts: Post[]} = Interface
        this.posts = postData.posts; // postData is whole Object.... {posts: objects from db now in an array}
        // postData.posts accesses the ARRAY of objects stored as value from line 38 from posts.service (spread operator)
        console.log(this.posts);
      });
  }

  onDelete(postId: string) {
    this.postsService.deletePost(postId).subscribe(() => {
      this.postsService.getPosts();
    });
  }

  onEdit(postId) {
    this.router.navigate(['/edit', postId]);
  }


  customButtonContainingImage(wrestler) {
    return {
      myCustomMainColor: !!wrestler,
      myCustomColorRed: wrestler.brand === 'Raw',
      myCustomColorBlue: wrestler.brand === 'SmackDown',
      myCustomColorGold: wrestler.brand === 'NXT'
    };
  }

  openModal(wrestler) {
    const modalRef = this.modalService.open(WrestlerDetailsModalComponent);
    modalRef.componentInstance.wrestlerData = wrestler;
  }


  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }

}
