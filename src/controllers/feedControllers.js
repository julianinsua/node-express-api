exports.getPosts = (req, res, next) => {
    res.status(200).json({posts:[{title: 'First Post', content: 'This is the firstPost'}]})
}

exports.createPost = (req, res, next) => {
    const {title, content} = req.body

    // Create a post in the database

    return res.status(201).json({message: 'post created successfully', post: {id: new Date().toISOString(), title, content}})
}