import { Post, CreatePostRequest, FetchAllPostsRequest, LikePostRequest, AddCommentRequest } from "../../models/PostModel";

describe("PostModel classes", () => {
  describe("Post", () => {
    it("should set all properties from constructor args", () => {
    const post = new Post({
        id: "123",
        user_id: "user1",
        image_url: "http://example.com/image.jpg",
        identification_id: "ident456",
        description: "A test post",
        share_location: true,
        is_removed: false,
        created_at: "2025-08-18T12:00:00Z",
        likes: 42,
    });

    expect(post.id).toBe("123");
    expect(post.user_id).toBe("user1");
    expect(post.image_url).toBe("http://example.com/image.jpg");
    expect(post.identification_id).toBe("ident456");
    expect(post.description).toBe("A test post");
    expect(post.share_location).toBe(true);
    expect(post.is_removed).toBe(false);
    expect(post.created_at).toBe("2025-08-18T12:00:00Z");
    expect(post.likes).toBe(42);
    });

    it("should have undefined fields if not provided", () => {
    const post = new Post({});
    expect(post.id).toBeUndefined();
    expect(post.user_id).toBeUndefined();
    expect(post.image_url).toBeUndefined();
    expect(post.identification_id).toBeUndefined();
    expect(post.description).toBeUndefined();
    expect(post.share_location).toBeUndefined();
    expect(post.is_removed).toBeUndefined();
    expect(post.created_at).toBeUndefined();
    expect(post.likes).toBeUndefined();
    });
  });

  describe("CreatePostRequest", () => {
    it("should set identification_id, description, and share_location", () => {
    const req = new CreatePostRequest({
        identification_id: "plant123",
        description: "Looks healthy",
        share_location: true,
    });

    expect(req.identification_id).toBe("plant123");
    expect(req.description).toBe("Looks healthy");
    expect(req.share_location).toBe(true);
    });

    it("should have undefined fields if not provided", () => {
    const req = new CreatePostRequest({});
    expect(req.identification_id).toBeUndefined();
    expect(req.description).toBeUndefined();
    expect(req.share_location).toBeUndefined();
    });
  });
  
  //fetchAllPosts request once implemented

  describe("LikePostRequest", () => {
    it("should set postId from constructor args", () => {
    const req = new LikePostRequest({ postId: "post123" });
    expect(req.postId).toBe("post123");
    });

    it("should have undefined postId if not provided", () => {
    const req = new LikePostRequest({});
    expect(req.postId).toBeUndefined();
    });
  });

  describe("AddCommentRequest", () => {
    it("should set postId and comment from constructor args", () => {
    const req = new AddCommentRequest({
        postId: "post123",
        comment: "Nice post!",
    });

    expect(req.postId).toBe("post123");
    expect(req.comment).toBe("Nice post!");
    });

    it("should have undefined fields if not provided", () => {
    const req = new AddCommentRequest({});
    expect(req.postId).toBeUndefined();
    expect(req.comment).toBeUndefined();
    });
  });
});
