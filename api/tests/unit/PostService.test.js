import { beforeEach, describe, expect, jest, test } from '@jest/globals';

const POSTING_URL = '../../src/PostingServer/';

jest.unstable_mockModule(`${POSTING_URL}postingRepository.js`, () => ({
    __esModule: true,
    postingRepository: {
        createPost: jest.fn(),
        fetchAllPosts: jest.fn(),
        fetchAllUserPosts: jest.fn(),
        fetchPost: jest.fn(),
        likePost: jest.fn(),
        addComment: jest.fn(),
        fetchPostImage: jest.fn(),
        fetchUserName: jest.fn(),
        checkLikedStatus: jest.fn(),
        fetchGeoLocation: jest.fn(),
        deletePost: jest.fn(),  
    },
}));

const { postingRepository } = await import(`${POSTING_URL}postingRepository.js`);
const { postingService } = await import(`${POSTING_URL}postingService.js`);

describe('postingService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('createPost function', () => {
        test('createPost should return new post id', async () => {
            postingRepository.createPost.mockResolvedValue({ id: 123 });
            const details = { user_id: 1, identification_id: 2, description: 'test', share_location: true };

            const result = await postingService.createPost(details);

            expect(postingRepository.createPost).toHaveBeenCalledWith(details);
            expect(result).toEqual({ id: 123 });
        });

        test('createPost should throw on repository failure', async () => {
            postingRepository.createPost.mockRejectedValue(new Error('DB error'));

            await expect(postingService.createPost({})).rejects.toThrow('Failed to create post');
        });
    });
    

    describe('fetchAllPosts function', () => {
        test('fetchAllPosts should return posts', async () => {
            const mockPosts = [
                { id: "9", description: "Beautiful herd of eland antelope..." },
                { id: "8", description: "Two magnificent white rhinos grazing..." },
            ];
            postingRepository.fetchAllPosts.mockResolvedValue(mockPosts);

            const result = await postingService.fetchAllPosts();

            expect(postingRepository.fetchAllPosts).toHaveBeenCalled();
            expect(result).toEqual(mockPosts);
        });

        test('fetchAllPosts should throw on repository failure', async () => {
            postingRepository.fetchAllPosts.mockRejectedValue(new Error('DB error'));

            await expect(postingService.fetchAllPosts()).rejects.toThrow('Failed to fetch all posts');
        });
    });

    describe('fetchAllUserPosts function', () => {
        test('fetchAllUserPosts should return user posts', async () => {
            const mockPosts = [{ id: 1, user_id: 1 }];
            postingRepository.fetchAllUserPosts.mockResolvedValue(mockPosts);

            const result = await postingService.fetchAllUserPosts(1);

            expect(result).toEqual(mockPosts);
        });

        test('fetchAllUserPosts should throw on repository failure', async () => {
            postingRepository.fetchAllUserPosts.mockRejectedValue(new Error('DB error'));

            await expect(postingService.fetchAllUserPosts(1)).rejects.toThrow('Failed to fetch user posts');
        });
    });

    describe('fetchPost function', () => {
        test('fetchPost should return post with comments', async () => {
            const mockPost = {
                post: {
                    id: "6",
                    user_id: "1",
                    identification_id: "id",
                    image_url: "url",
                    description: "I spotted this large Elephant bull ",
                    share_location: false,
                    is_removed: false,
                    created_at: "16 August 2025 19:07",
                    likes: 0,
                },
                comments: [
                    {
                        id: 2,
                        user_id: "1",
                        post_id: "6",
                        comment_text: "Love this so much!",
                        created_at: "2025-08-16T18:56:19.885Z",
                    },
                ],
            };

            postingRepository.fetchPost.mockResolvedValue(mockPost);

            const result = await postingService.fetchPost(6);

            expect(result).toEqual(mockPost);
        });

        test('fetchPost should throw on repository failure', async () => {
            postingRepository.fetchPost.mockRejectedValue(new Error('DB error'));

            await expect(postingService.fetchPost(1)).rejects.toThrow('Failed to fetch post');
        });
    });

    describe('likePost function', () => {
        test('likePost should return success when repo resolves', async () => {
            postingRepository.likePost.mockResolvedValue({ rowCount: 1 });

            const result = await postingService.likePost(1, 2);

            expect(result).toEqual({ rowCount: 1 });
        });

        test('likePost should throw on repository failure', async () => {
            postingRepository.likePost.mockRejectedValue(new Error('DB error'));

            await expect(postingService.likePost(1, 2)).rejects.toThrow('Failed to like post');
        });
    });

    describe('addComment function', () => {
        test('addComment should return result on success', async () => {
            postingRepository.addComment.mockResolvedValue([{ id: 10, comment_text: 'Nice!' }]);

            const result = await postingService.addComment({ user_id: 1, post_id: 1, comment_text: 'Nice!' });

            expect(result).toEqual([{ id: 10, comment_text: 'Nice!' }]);
        });

        test('addComment should throw on repository failure', async () => {
            postingRepository.addComment.mockRejectedValue(new Error('DB error'));

            await expect(postingService.addComment({})).rejects.toThrow('Failed to add comment');
        });
    });
});
