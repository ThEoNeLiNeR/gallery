import { Injectable } from '@angular/core'
import { Observable } from 'rxjs';
import { WebRequestService } from './web-request.service';

@Injectable()
export class ImageService{

    constructor(private webRequestService: WebRequestService) {}

    getImages() {
        // i get all the image objects as json files containing title, description and img
        return this.webRequestService.get('all-images/image-objects');
    }

    getImage(id: string){
        console.log(id);
        return this.webRequestService.getOneImage(id);
    }

    getImageObj(id: string) {
        return this.webRequestService.getImageObject(id);
    }

    postImage(id: string, payload) {
        return this.webRequestService.postImageForm(id, payload);
    }

    deleteImage(id: string) {
        console.log(id);
        return this.webRequestService.deleteImage(id);
    }
}