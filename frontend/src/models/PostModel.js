export class Post {
    // add what will be returned for fetching posts
    constructor({ id, user_id, image_url, identification_id, description, share_location, is_removed, created_at, likes, comments }) {
        this.id = id;
        this.user_id = user_id;
        this.image_url = image_url;
        this.identification_id = identification_id;
        this.description = description;
        this.share_location = share_location;
        this.is_removed = is_removed;
        this.created_at = created_at;
        this.likes = likes;
        this.comments = comments;
    }
}

export class CreatePostRequest {
    constructor({ image_url, identification_id, description, share_location }) {
        this.image_url = image_url;
        this.identification_id = identification_id;
        this.description = description;
        this.share_location = share_location;
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