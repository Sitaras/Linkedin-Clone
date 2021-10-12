import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { PostService } from 'src/app/shared/post.service';
import { Observable, throwError } from 'rxjs';
import { CreatePostPayload } from './create-post.payload';
import { ToastrService } from 'ngx-toastr';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent implements OnInit {

  createPostForm!: FormGroup;
  postPayload!: CreatePostPayload;

  title = "cloudsSorage";
  selectedFile!: File;
  fb: any;
  downloadURL!: Observable<string>;
  lastUploadedImage: any;
  videoWasUploaded!: boolean;

  constructor(private router: Router, private postService: PostService, private toastr: ToastrService,
    private storage: AngularFireStorage) {
    this.postPayload = {
      postName: '',
      url: '',
      description: '',
      videoUploaded: false
    }
  }

  ngOnInit() {
    this.createPostForm = new FormGroup({
      postName: new FormControl('', Validators.required),
      url: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
    });
    this.videoWasUploaded=false;
  }

  createPost() {
    this.postPayload.postName = this.createPostForm.get('postName')!.value;
    this.postPayload.description = this.createPostForm.get('description')!.value;
    this.postPayload.videoUploaded = this.videoWasUploaded;
    
    if(this.fb==null){
      this.postPayload.url='';
    }else{
      this.postPayload.url = this.fb;
    }
    
    
    this.postService.createPost(this.postPayload).subscribe((data) => {
      this.router.navigateByUrl('/');
    }, error => {
      throwError(error);
    });
  }

  discardPost() {
    this.router.navigateByUrl('/');
  }

  onFileChanged(event: any) {
    this.toastr.warning('Wait for the image to upload before posting!');
    var n = Date.now();
    const file = event.target.files[0];

    var temp = file.name + '';
    var splitted = temp.split('.');
    var extens: string = <string>splitted[splitted.length - 1];
    this.videoWasUploaded = this.isVideo(extens);


    const filePath = `RoomsImages/${n}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(`RoomsImages/${n}`, file);
    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          this.downloadURL = fileRef.getDownloadURL();
          this.downloadURL.subscribe(url => {
            if (url) {
              this.fb = url;
              this.toastr.success('Image was uploaded, ready to post!');
            }
            console.log(this.fb);
          });
        })
      )
      .subscribe(url => {
        if (url) {
          console.log(url);
          this.lastUploadedImage = url;

        }
      });
  }

  private isVideo(ext:string) {
    switch (ext.toLowerCase()) {
      case 'm4v':
      case 'avi':
      case 'mpg':
      case 'mp4':
        // etc
        return true;
    }
    return false;
  }

}
