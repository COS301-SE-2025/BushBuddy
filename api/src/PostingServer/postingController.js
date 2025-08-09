import {postingService} from './postingService.js'

async function createPost(req, res) {
	try {
		if (!req.file) {
			return res.status(400).json({ success: false, message: 'No image uploaded' });
		}

		const image = req.file.buffer;
		const details = { 
			user_id: req.body.user_id, 
			identification_id: req.body.identification_id,
			image_url: req.body.image_url,
			description: req.body.description, 
			share_location: req.body.sharLocation, 
		}

		result = await postingService.createPost(image, details);

		if(!result){
			return res.status(400).json({ 
				success: false, 
				message: 'Failed to create post' 
			});
		}

		return res.status(201).json({
			success: true,
			message: 'Post created successfully',
			data: result,
		});
	} catch (error) {
		console.error('Error creating new post: ', error);
		res.status(500).json({
			success: false,
			error: 'Internal server error',
		}); 
	}
}

async function fetchPost(req, res) {
	try {
		if(!req.params.postId)
		{
			return res.status(400).json({ success: false, message: 'Post ID is required' });
		}

		const result = await postingService.fetchPost(req.params.postId);

		if(!result){
			return res.status(400).json({ 
				success: false, 
				message: 'Failed to fetch post' 
			});
		}

		return res.status(201).json({
			success: true,
			message: 'Post fetched successfully',
			data: {
				result,
				postComments
			}
		});
	} catch (error) {
		console.error('Error fetching post: ', error);
		res.status(500).json({
			success: false,
			error: 'Internal server error',
		});
	}
}

async function fetchAllUserPosts(req, res) {
	try {
		const result = await postingService.fetchAllUserPosts(req.body.user_id);

		if(!result){
			return res.status(400).json({
				success: false,
				message: 'Falied to fetch users posts'
			});
		}

		return res.status(200).json({
			succes:true,
			message: 'User posts fetched successfully',
			data: result
		});
		
	} catch (error) {
		console.error('Error fetching all user posts: ', error);
		res.status(500).json({
			success: false,
			error: 'Internal server error',
		});
	}
}

async function fetchAllPosts(req, res) {
	try {
		const result = await postingService.fetchAllPosts();

		if(!result){
			return res.status(400).json({
				success: false,
				message: 'Falied to fetch posts'
			});
		}

		return res.status(200).json({
			succes:true,
			message: 'Posts fetched successfully',
			data: result
		});
		
	} catch (error) {
		console.error('Error fetching all posts: ', error);
		res.status(500).json({
			success: false,
			error: 'Internal server error',
		});
	}
}

async function likePost(req, res) {
	try {
		if(!req.params.postId)
		{
			return res.status(400).json({
				success: false,
				message: 'Post ID is required'
			});
		}

		result = await postingService.likePost(req.params.postId, req.body.user_id);

		if(!result){
			return res.status(400).json({
				success: false,
				message: 'Failed to add like to post'
			});
		}

		return res.satus(200).json({
			success: true,
			message: 'Post like successfully updated'
		});

	} catch (error) {
		console.error('Error updating post likes: ', error);
		res.status(500).json({
			success: false,
			error: 'Internal server error',
		});
	}
}

async function addComment(req, res) {
	try {
		if(!req.params.postId)
		{
			return res.status(400).json({
				success: false,
				message: 'Post ID is required'
			});
		}

		const data = {
			user_id: req.body.user_id,
			post_id: req.params.postId,
			comment: req.body.comment,
		}

		result = await postingService.commentPost(data);

		if(!result){
			return res.status(400).json({
				success: false,
				message: "Failed to add comment to post"
			});
		}

		return res.status(201).json({
			success: true,
			message: 'Comment added to post successfully',
			data: result
		});

	} catch (error) {
		console.error('Error commenting on post: ', error);
		res.status(500).json({
			success: false,
			error: 'Internal server error',
		});
	}
}

export const postingController = {
	createPost,
	fetchPost,
	fetchAllUserPosts,
	fetchAllPosts,
	likePost,
	addComment,
};
