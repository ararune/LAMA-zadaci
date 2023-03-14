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
  last_updated?: string;
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
  
  
}
