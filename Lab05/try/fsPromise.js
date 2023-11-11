const fs = require("fs/promises");
const os = require("os");
const path = require("path");

const dbPath = path.join(__dirname, "database.txt");
const bPath = path.join(__dirname, "blogs");

// Register function
const register = (username, password) => {
    const userID = `${username}: ${password}${os.EOL}`;
    return checkUser(username, password).then(() => appendFile(dbPath, username, userID))
}

const checkUser = (username, password) => {
    return fs.readFile(dbPath, "utf8").then((data) => {
        const eachUser = data.split(`: ${password}${os.EOL}`).map((line) => line.trim());
        if (eachUser.includes(username)) {
            throw (`Sorry, username "${username}" already exists.`);
        } else {
            console.log("Username available");
        }
    })
        .catch((err) => {
            if (err.code === "ENOENT") {
                return fs.writeFile(dbPath, "")
                    .then(() => console.log("Database does not exist. Created one for you!"))
            } else {
                throw (err);
            }
        })
}

const appendFile = (fn, username, userID) => {
    return fs.appendFile(fn, userID)
        .then(() => console.log(`User "${username}" created`));
}

// Create A Blog
const createABlog = (blogName) => {
    const blogPath = path.join(bPath, blogName);
    return fs.mkdir(blogPath, { recursive: true })
        .then(() => console.log(`${blogName} blog created successfully!`))
        .catch((err) => {
            if (err.code === "EEXIST") {
                return (`${blogName} already exists, please choose a blog with another name!`)
            } else {
                return (err);
            }
        })
}

// Create a Post
const createAPost = (postTitle, postContent, blogName) => {
    const fixedPostTitle = postTitleCheck(postTitle);
    const postPath = path.join(bPath, blogName, fixedPostTitle);
    const postContentToWrite = (`likes: 1${os.EOL}likedby: you${os.EOL}${postContent}`);
    console.log(postContentToWrite);
    return fs.writeFile(`${postPath}.txt`, postContentToWrite, { flag: "wx" })
        .then(() => console.log(`Post "${fixedPostTitle}" created`))
        .catch((err) => {
            if (err.code === "EEXIST") {
                const modifiedBlogPostTitle = `${blogPost}${parseInt(Date.now() + Math.random())}`;
                createAPost(modifiedBlogPostTitle, postContent, blogName);
            } else if (err.code === "ENOENT") {
                throw (`A folder with the name of ${blogName} does not exist. Please create a blog first`);
            } else {
                throw (err);
            }
        })
}

const postTitleCheck = (postTitle) => {
    const fixedPostTitle = postTitle.replace(" ", "_");
    return fixedPostTitle;
}

// Like a post
const likePost = (blogName, postTitle, username, password) => {
    const postToLike = (`${path.join(bPath, blogName, postTitleCheck(postTitle))}.txt`);

    return checkReg(username, password)
        .then(() => fs.readFile(postToLike, "utf8"))
        .then((content) => {
            const updatedPostC = updatePostContent(content, username);
            fs.writeFile(postToLike, updatedPostC)
                .then(() => console.log("Your post was liked!"))
        })
}

const checkReg = (username, password) => {
    return fs.readFile(dbPath, "utf8").then((data) => {
        const eachUser = data.split(`: ${password}${os.EOL}`).map((line) => line.trim());
        const userPass = data.split(`${os.EOL}${username}:`)
        if (eachUser.includes(username)) {
            console.log("Valid user");
            return (data);
        } else if (eachUser.includes(username) === false && userPass.includes(password) === false) {
            throw ("Incorrect username or password! Please try again!")
        } else {
            throw ("You must be a registered user to like a post.")
        }
    })
}

const updatePostContent = (content, username) => {
    const updatedContent = content.split(os.EOL);
    const likesLine = updatedContent[0];
    const updatedFinalDigitInLine = parseInt(likesLine[likesLine.length - 1]) + 1;
    updatedContent[0] = `likes:${updatedFinalDigitInLine}`;
    updatedContent[1] = `${updatedContent[1]}, ${username}`;
    return updatedContent.join(os.EOL);
}

//Test cases:
register("christy", "123")
    .then(() => createABlog("christyBlog"))
    .then(() => createAPost("Post 1", "This is the post content!", "christyBlog"))
    .then(() => likePost("christyBlog", "Post_1", "christy", "123"))
    .catch((err) => console.log(err))

likePost("christyBlog", "Post_1", "christy", "123")
    .catch((err) => console.log(err))

register("john", "123")
    .then(() => createABlog("johnBlog"))
    .then(() => createAPost("Post 1", "This is the post content!", "johnBlog"))
    .then(() => likePost("christyBlog", "Post_1", "john", "123"))
    .catch((err) => console.log(err))

likePost("christyBlog", "Post_1", "john", "44444")
    .catch((err) => console.log(err))

likePost("johnBlog", "Post_1", "christy", "123")
    .catch((err) => console.log(err))