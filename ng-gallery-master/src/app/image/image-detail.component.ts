import { Component } from '@angular/core';
import { ImageService } from './shared/image.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  templateUrl: './image-detail.component.html',
  styleUrls: ['./image-detail.component.css']
})
export class ImageDetailComponent {
  imageIMG:any;
  title:string;
  description:string;


  constructor(private imageService: ImageService,
    private route: ActivatedRoute, private router: Router) {
      
    }


  ngOnInit() {
    const imgObj = this.route.snapshot.params['id'];
    this.imageService.getImageObj(imgObj).subscribe((jsonObj: any) => {
      if(jsonObj === null) {
        this.router.navigate(['/gallery']);
      }
      else { this.title = jsonObj.title;
      this.description = jsonObj.description; }
    });
    
    this.imageIMG = encodeURI(`http://localhost:3000/${this.route.snapshot.params['id']}/image`);
  }

  onDelete() {
    const imgObj = this.route.snapshot.params['id'];
    this.imageService.deleteImage(imgObj).subscribe((randomtxt: any) => {
    });
    
  }
}
