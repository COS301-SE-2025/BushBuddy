import {postingService} from './postingService.js'

async function createPost(req, res) {
	try {
        if (!req.user || !req.user.userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized: User not authenticated' });
        }

		const details = {
			user_id: req.user.id,
			identification_id: req.body.identification_id,
			description: req.body.description,
			share_location: req.body.shareLocation,
		}

        const result = await postingService.createPost(details);

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

async function fetchAllPosts(req, res) {
	try {
		const result = await postingService.fetchAllPosts();

		if(!result){
			return res.status(400).json({
				success: false,
				message: 'Failed to fetch posts'
			});
		}

		if(result.rows==0){
			return res.status(204).json({ 
				success: true, 
				message: 'No post found with specified filters' 
			});
		}

		return res.status(200).json({
			success:true,
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

async function fetchAllUserPosts(req, res) {
	try {
		const result = await postingService.fetchAllUserPosts(req.user.id);

		if(!result){
			return res.status(400).json({
				success: false,
				message: 'Failed to fetch users posts'
			});
		}

		if(result.rows==0){
			return res.status(204).json({
				success: true,
				message: 'User has no posts'
			});
		}

		return res.status(200).json({
			success:true,
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

async function fetchPost(req, res) {
	try {
		if(!req.params.postId)
		{
			return res.status(400).json({ success: false, message: 'Post ID is required' })
		}

		const postId = parseInt(req.params.postId, 10);

		const result = await postingService.fetchPost(postId);

		if(!result){
			return res.status(400).json({ 
				success: false, 
				message: 'Failed to fetch post' 
			});
		}

		if(result.rows==0){
			return res.status(204).json({ 
				success: true, 
				message: 'No post found with specified id' 
			});
		}
		
		return res.status(201).json({
			success: true,
			message: 'Post fetched successfully',
			data: result
		});
	} catch (error) {
		console.error('Error fetching post: ', error);
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

		const result = await postingService.likePost(req.params.postId, req.user.id);

		if(!result){
			return res.status(400).json({
				success: false,
				message: 'Failed to add like to post'
			});
		}

		return res.status(200).json({
			success: true,
			message: 'Post liked successfully'
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
			user_id: req.user.id,
			post_id: req.params.postId,
			comment_text: req.body.comment,
		}

		const result = await postingService.addComment(data);

		if(!result){
			return res.status(400).json({
				success: false,
				message: "Failed to add comment to post"
			});
		}

		return res.status(201).json({
			success: true,
			message: 'Comment added to post successfully'
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
