import { beforeEach, describe, expect, jest, test } from '@jest/globals';

const POSTING_URL = '../../src/PostingServer/';

// 🔹 Mock postingService
jest.unstable_mockModule(`${POSTING_URL}postingService.js`, () => ({
  __esModule: true,
  postingService: {
    createPost: jest.fn(),
    fetchAllPosts: jest.fn(),
    fetchAllUserPosts: jest.fn(),
    fetchPost: jest.fn(),
    likePost: jest.fn(),
    addComment: jest.fn(),
  },
}));

// 🔹 Mock jsonwebtoken so token verification always succeeds by default
jest.unstable_mockModule('jsonwebtoken', () => ({
  __esModule: true,
  default: {
    verify: jest.fn(() => ({ id: 1 })), // fake decoded user
  },
}));

const { postingService } = await import(`${POSTING_URL}postingService.js`);
const { postingController } = await import(`${POSTING_URL}postingController.js`);
import jwt from 'jsonwebtoken';

describe('postingController', () => {
    let res;

    beforeEach(() => {
        jest.clearAllMocks();
        res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        };
    });

    describe('createPost function', () => {
        test('should return 201 on success', async () => {
            postingService.createPost.mockResolvedValue({ id: 1 });

            const req = {
                cookies: { token: 'mock' },
                body: { identification_id: 1, description: 'test', shareLocation: true },
            };

            await postingController.createPost(req, res);
            expect(res.status).toHaveBeenCalledWith(201);
        });

        test('should return 400 if service returns null', async () => {
            postingService.createPost.mockResolvedValue(null);

            const req = { cookies: { token: 'mock' }, body: { identification_id: 1 } };
            await postingController.createPost(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
        });

        test('should return 500 on error', async () => {
            postingService.createPost.mockRejectedValue(new Error('fail'));

            const req = { cookies: { token: 'mock' }, body: { identification_id: 1 } };
            await postingController.createPost(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('fetchAllPosts function', () => {
        test('should return 200 with posts', async () => {
            postingService.fetchAllPosts.mockResolvedValue([{ id: 1 }]);

            await postingController.fetchAllPosts({}, res);
            expect(res.status).toHaveBeenCalledWith(200);
        });

        test('should return 400 if null', async () => {
            postingService.fetchAllPosts.mockResolvedValue(null);

            await postingController.fetchAllPosts({}, res);
            expect(res.status).toHaveBeenCalledWith(400);
        });

        test('should return 204 if empty', async () => {
            postingService.fetchAllPosts.mockResolvedValue({ rows: 0 });

            await postingController.fetchAllPosts({}, res);
            expect(res.status).toHaveBeenCalledWith(204);
        });

        test('should return 500 on error', async () => {
            postingService.fetchAllPosts.mockRejectedValue(new Error('fail'));

            await postingController.fetchAllPosts({}, res);
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('fetchAllUserPosts function', () => {
        test('should return 200', async () => {
            postingService.fetchAllUserPosts.mockResolvedValue([{ id: 1 }]);
            const req = { cookies: { token: 'mock' } };

            await postingController.fetchAllUserPosts(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
        });

        test('should return 400 if null', async () => {
            postingService.fetchAllUserPosts.mockResolvedValue(null);
            const req = { cookies: { token: 'mock' } };

            await postingController.fetchAllUserPosts(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
        });

        test('should return 204 if empty', async () => {
            postingService.fetchAllUserPosts.mockResolvedValue({ rows: 0 });
            const req = { cookies: { token: 'mock' } };

            await postingController.fetchAllUserPosts(req, res);
            expect(res.status).toHaveBeenCalledWith(204);
        });

        test('should return 500 on error', async () => {
            postingService.fetchAllUserPosts.mockRejectedValue(new Error('fail'));
            const req = { cookies: { token: 'mock' } };

            await postingController.fetchAllUserPosts(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('fetchPost function', () => {
        test('should return 400 if no postId', async () => {
            await postingController.fetchPost({ params: {} }, res);
            expect(res.status).toHaveBeenCalledWith(400);
        });

        test('should return 201 on success', async () => {
            postingService.fetchPost.mockResolvedValue({ post: { id: 1 }, comments: [] });
            const req = { params: { postId: 1 } };

            await postingController.fetchPost(req, res);
            expect(res.status).toHaveBeenCalledWith(201);
        });

        test('should return 500 on error', async () => {
            postingService.fetchPost.mockRejectedValue(new Error('fail'));
            const req = { params: { postId: 1 } };

            await postingController.fetchPost(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('likePost function', () => {
        test('should return 400 if no postId', async () => {
            await postingController.likePost({ params: {} }, res);
            expect(res.status).toHaveBeenCalledWith(400);
        });

        test('should return 200 on success', async () => {
            postingService.likePost.mockResolvedValue(true);
            const req = { params: { postId: 1 }, cookies: { token: 'mock' } };

            await postingController.likePost(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
        });

        test('should return 400 if service returns null', async () => {
            postingService.likePost.mockResolvedValue(null);
            const req = { params: { postId: 1 }, cookies: { token: 'mock' } };

            await postingController.likePost(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
        });

        test('should return 500 on error', async () => {
            postingService.likePost.mockRejectedValue(new Error('fail'));
            const req = { params: { postId: 1 }, cookies: { token: 'mock' } };

            await postingController.likePost(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('addComment function', () => {
        test('should return 400 if no postId', async () => {
            await postingController.addComment({ params: {} }, res);
            expect(res.status).toHaveBeenCalledWith(400);
        });

        test('should return 201 on success', async () => {
            postingService.addComment.mockResolvedValue([{ id: 1 }]);
            const req = { params: { postId: 1 }, cookies: { token: 'mock' }, body: { comment: 'hi' } };

            await postingController.addComment(req, res);
            expect(res.status).toHaveBeenCalledWith(201);
        });

        test('should return 400 if service returns null', async () => {
            postingService.addComment.mockResolvedValue(null);
            const req = { params: { postId: 1 }, cookies: { token: 'mock' }, body: { comment: 'hi' } };

            await postingController.addComment(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
        });

        test('should return 500 on error', async () => {
            postingService.addComment.mockRejectedValue(new Error('fail'));
            const req = { params: { postId: 1 }, cookies: { token: 'mock' }, body: { comment: 'hi' } };

            await postingController.addComment(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });
});
