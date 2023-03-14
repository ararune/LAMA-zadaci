import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms'

interface User {
  id?: number;
  name: string;
  email: string;
  posts?: Post[];
}

interface Post {
  id?: number;
  user_id: number;
  title: string;
  body: string;
  last_update?: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  users: User[] = [];
  posts: Post[] = [];
  newUser: User = {
    name: '',
    email: ''
  };
  newPost: Post = {
    user_id: 0,
    title: '',
    body: ''
  };
  
  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<User[]>('http://localhost:3000/users').subscribe(users => {
      this.users = users;
      this.loadPosts();
    });
  }

  loadPosts() {
    this.http.get<Post[]>('http://localhost:3000/posts').subscribe(posts => {
      this.posts = posts;
      for (let user of this.users) {
        user.posts = this.posts.filter(post => {
          return post.user_id === user.id;
        });
      }
    });
  }
  onSubmitUser(form: NgForm) {
    // Create the new user object
    const newUser: User = {
      name: form.value.name,
      email: form.value.email
    };
  
    // Send a POST request to create the new user
    this.http.post<User>('http://localhost:3000/users', newUser).subscribe(createdUser => {
      // Add the created user to the local list
      this.users.push(createdUser);
  
      // Reset the form
      form.reset();
    });
  }
  onSubmitPost(form: NgForm) {
    // Create the new post object
    const newPost: Post = {
      user_id: form.value.user_id,
      title: form.value.title,
      body: form.value.body
    };
  
    // Send a POST request to create the new post
    this.http.post<Post>('http://localhost:3000/posts', newPost).subscribe(createdPost => {
      // Add the created post to the local list
      this.posts.push(createdPost);
  
      // Update the posts for the user who created the new post
      const user = this.users.find(user => user.id === newPost.user_id);
      if (user) {
        if (!user.posts) {
          user.posts = [];
        }
        user.posts.push(createdPost);
      }
  
      // Reset the form
      form.resetForm();
    });
  }
  
  
}
