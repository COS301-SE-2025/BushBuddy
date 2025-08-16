export class Post {
    // add what will be returned for fetching posts
    constructor({ }) {
        
    }
}

export class CreatePostRequest {
    constructor({ identificationId, description, shareLocation, image }) {
        this.identificationId = identificationId;
        this.description = description;
        this.shareLocation = shareLocation;
        this.image = image;
    }
}

//insert parameters and filters
export class FetchAllPostsRequest {
    constructor({ }) {

    }
}

export class LikePostRequest {
    constructor({ postId }) {
        this.postId = postId;
    }
}

export class AddCommentRequest {
    constructor({ postId, comment }) {
        this.postId = postId;
        this.comment = comment;
    }
}