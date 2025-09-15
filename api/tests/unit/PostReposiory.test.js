import { beforeEach, describe, expect, jest, test } from '@jest/globals';

jest.unstable_mockModule('../../src/db/index.js', () => ({
    __esModule: true,
    default: {
    query: jest.fn(),
    },
}));

jest.unstable_mockModule('../../src/db/imageStorage.js', () => ({
    __esModule: true,
    default: {
    fetchImage: jest.fn(),
    },
}));

const db = (await import('../../src/db/index.js')).default;
const s3 = (await import('../../src/db/imageStorage.js')).default;
const { postingRepository } = await import('../../src/PostingServer/postingRepository.js');

describe('Testing postingRepository', () => {
    beforeEach(() => {
        db.query.mockClear();
        s3.fetchImage.mockClear();
    });

    describe('createPost', () => {
        test('should insert a new post and return post id', async () => {
            db.query
                .mockResolvedValueOnce({ rows: [{ image_url: 'http://example.com/test.jpg' }] })
                .mockResolvedValueOnce({ rows: [{ id: 123 }] });

            const details = {
                user_id: 1,
                identification_id: 6,
                description: 'test post',
                share_location: true,
            };

            const result = await postingRepository.createPost(details);

            expect(db.query.mock.calls[0][0]).toMatch(/SELECT/i);
            expect(db.query.mock.calls[1][0]).toMatch(/INSERT/i);
            expect(result).toEqual({ id: 123 });
        });

        test('should throw error if no image_url is found for identification_id', async () => {
            db.query.mockResolvedValueOnce({ rows: [] });

            await expect(
                postingRepository.createPost({
                user_id: 1,
                identification_id: 99,
                description: 'test',
                share_location: true,
                })
            ).rejects.toThrow('Image URL not found for identification ID');
        });


        test('should throw error when DB fails', async () => {
            db.query.mockRejectedValueOnce(new Error('DB Error'));

            await expect(
            postingRepository.createPost({
                user_id: 1,
                identification_id: 'bad',
                description: 'oops',
                share_location: false,
            })
            ).rejects.toThrow('Error adding new post: DB Error');
        });
    });

    describe('fetchAllPosts', () => {
        test('should return list of posts', async () => {
            db.query.mockResolvedValueOnce({ rows: [{ id: 1, description: 'test' }] });

            const result = await postingRepository.fetchAllPosts();

            expect(db.query).toHaveBeenCalledWith('SELECT * FROM posts ORDER BY created_at DESC LIMIT 50;');
            expect(result).toEqual([{ id: 1, description: 'test' }]);
        });

        test('should throw error when DB fails', async () => {
            db.query.mockRejectedValueOnce(new Error('DB Error'));

            await expect(postingRepository.fetchAllPosts()).rejects.toThrow('Error fetching all posts: DB Error');
        });
    });

    describe('fetchAllUserPosts', () => {
        test('should return user posts', async () => {
            db.query.mockResolvedValueOnce({ rows: [{ id: 1, user_id: 99 }] });

            const result = await postingRepository.fetchAllUserPosts(99);

            expect(db.query).toHaveBeenCalledWith(
                'SELECT * FROM posts WHERE user_id = $1 ORDER BY created_at DESC;',
                [99]
            );
            expect(result).toEqual([{ id: 1, user_id: 99 }]);
        });

        test('should throw error when DB fails', async () => {
            db.query.mockRejectedValueOnce(new Error('DB error'));

            await expect(postingRepository.fetchAllUserPosts(1))
                .rejects.toThrow('Error fetching all posts: DB error');
        });
    });

    describe('fetchPost', () => {
        test('should return post and comments', async () => {
            db.query
                .mockResolvedValueOnce({ rows: [{ id: 1, description: 'test post' }] }) // post
                .mockResolvedValueOnce({ rows: [{ id: 1, comment_text: 'test comment' }] }); // comments

            const result = await postingRepository.fetchPost(1);

            expect(result.post).toEqual({ id: 1, description: 'test post' });
            expect(result.comments).toEqual([{ id: 1, comment_text: 'test comment' }]);
        });

        test('should throw error when DB fails', async () => {
            db.query.mockRejectedValueOnce(new Error('DB error'));

            await expect(postingRepository.fetchPost(1))
                .rejects.toThrow('Error fetching post: DB error');
        });
    });

    describe('likePost', () => {
        test('should insert like when not exists', async () => {
            db.query
                .mockResolvedValueOnce({ rowCount: 0 }) // check
                .mockResolvedValueOnce({ rows: [] }); // insert

            const result = await postingRepository.likePost(1, 99);

            expect(db.query.mock.calls[0][0]).toMatch(/SELECT/);
            expect(db.query.mock.calls[1][0]).toMatch(/INSERT/);
            expect(result).toBeDefined();
            });

            test('should return null if like already exists', async () => {
            db.query.mockResolvedValueOnce({ rowCount: 1 });

            const result = await postingRepository.likePost(1, 99);

            expect(result).toBeNull();
        });

        test('should throw error when DB fails', async () => {
            db.query.mockRejectedValueOnce(new Error('DB error'));

            await expect(postingRepository.likePost(1, 1))
                .rejects.toThrow('Error adding like to post: DB error');
        });
    });

    describe('addComment', () => {
        test('should insert comment and return rows', async () => {
            db.query.mockResolvedValueOnce({ rows: [{ id: 1, comment_text: 'hello' }] });

            const result = await postingRepository.addComment({
                user_id: 99,
                post_id: 1,
                comment_text: 'hello',
            });

            expect(db.query.mock.calls[0][0]).toMatch(/INSERT/);
            expect(result).toEqual([{ id: 1, comment_text: 'hello' }]);
        });

        test('should throw error when DB fails', async () => {
            db.query.mockRejectedValueOnce(new Error('DB error'));

            await expect(
                postingRepository.addComment({ user_id: 1, post_id: 1, comment_text: 'fail' })
            ).rejects.toThrow('Error adding comment to post: DB error');
        });
    });

    describe('fetchPostImage', () => {
        test('should return image url from s3', async () => {
            s3.fetchImage.mockResolvedValueOnce('http://image-url');

            const result = await postingRepository.fetchPostImage('key123');

            expect(s3.fetchImage).toHaveBeenCalledWith('key123');
            expect(result).toBe('http://image-url');
        });

        test('fetchPostImage should throw error when s3 fails', async () => {
            s3.fetchImage.mockRejectedValueOnce(new Error('s3 error'));

            await expect(postingRepository.fetchPostImage('bad-key'))
                .rejects.toThrow('Error fetching post image');
        });
    });

    describe('fetchUserName', () => {
        test('should return username', async () => {
            db.query.mockResolvedValueOnce({ rows: [{ username: 'tester' }] });

            const result = await postingRepository.fetchUserName(5);

            expect(db.query).toHaveBeenCalledWith('SELECT username FROM users WHERE id = $1;', [5]);
            expect(result).toBe('tester');
        });
    });
});
