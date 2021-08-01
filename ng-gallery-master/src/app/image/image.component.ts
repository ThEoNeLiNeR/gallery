import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ImageService } from './shared/image.service';


@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.css']
})
export class ImageComponent {

  
  myForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    file: new FormControl('', [Validators.required]),
  });

  FileHolder: any[];
  TitleHolder: string | null;
  DescriptionHolder: string | null;

  constructor(private imageService: ImageService, public router: Router) {}

  get f() {
    return this.myForm.controls;
  }

  onFileChange(event) {
    if(event.target.files.length > 0) {
      const changeFile = event.target.files;
      console.log(event.target.files);
      this.FileHolder = changeFile;
    }
  }
  onTitleChange(event) {
      const title = event.target.value;
      this.TitleHolder = title;
  }
  onDescriptionChange(event) {
      const desc = event.target.value;
      this.DescriptionHolder = desc;
  }

  submit() {
    const formData = new FormData();

    // console.log(this.myForm.get('title').value);
    // console.log(this.myForm.get('description').value);

    // console.log(this.myForm.get('file').value);

    Array.from(this.FileHolder).forEach((item) => {
      formData.append('image-ref', item);
    });

    formData.append('title', this.TitleHolder);
    formData.append('description', this.DescriptionHolder);

    this.imageService.postImage('upload-image', formData).subscribe(data => {
      // console.log(this.myForm.getRawValue());
      // alert('done');
    });
}


}
