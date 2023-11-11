// Your code goes here

const fs = require("fs");
const os = require("os");
const path = require("path");

const dbPath = path.join(__dirname, "database.txt");
const bPath = path.join(__dirname, "blogs");

// promises version of fs functions
const readFileP = (fn) => {
    return new Promise((resolve, reject) => {
        fs.readFile(fn, "utf8", (err, data) => {
            if (err) return reject(err);
            resolve(data);
        })
    })
}

const writeFileP = (fn, data) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(fn, data, (err) => {
            if (err) return reject(err);
            resolve();
        })
    })
}

const appendFileP = (fn, data) => {
    return new Promise((resolve, reject) => {
        fs.appendFile(fn, data, (err) => {
            if (err) return reject(err);
            resolve();
        })
    })
}

const mkdirP = (fn) => {
    return new Promise((resolve, reject) => {
        fs.mkdir(fn, (err) => {
            if (err) return reject(err);
            resolve();
        })
    })
}

const mkdirPRecursive = (fn) => {
    return new Promise((resolve, reject) => {
        fs.mkdir(fn,{recursive: true}, (err) => {
            if (err) return reject(err);
            resolve();
        })
    })
}

// Register function
const register = (username, password) => {
    const userID = JSON.stringify({ username, password }) + os.EOL;
    return checkUser(username).then(() => appendFile(dbPath, username, userID))
}

const checkUser = (username) => {
    return readFileP(dbPath)
        .then((data) => {
            const users = data.split(os.EOL);
            const exists = users.some((user) => user.match(`"username":"${username}"`));
            if (exists) {
                throw (`Sorry, username "${username}" already exists.`);
            } else {
                console.log("Username available");
            }
        })
        .catch((err) => {
            if (err.code === "ENOENT") {
                return writeFileP(dbPath, "")
                    .then(() => console.log("Database does not exist. Created one for you!"))
            } else {
                throw (err);
            }
        })
}

const appendFile = (fn, username, userID) => {
    return appendFileP(fn, userID)
        .then(() => console.log(`User "${username}" created`));
}

// Create A Blog
const createABlog = (blogName) => {
    const blogPath = path.join(bPath, blogName);
    return mkdirP(blogPath)
        .then(() => console.log(`${blogName} blog created successfully!`))
        .catch((err) => {
            if (err.code === "ENOENT") {
                return mkdirPRecursive(blogPath)
                    .then(() => console.log(`${blogName} blog created successfully!`))
            } else if (err.code === "EEXIST") {
                throw (`${blogName} already exists, please choose a blog with another name!`)
            } else {
                throw (err);
            }
        })
}

// Create a Post
const createAPost = (postTitle, postContent, blogName) => {
    const fixedPostTitle = postTitleCheck(postTitle);
    const postPath = path.join(bPath, blogName, fixedPostTitle);
    const postContentToWrite = (`likes: 1${os.EOL}likedby: you${os.EOL}${postContent}`);
    return writeFileP(`${postPath}.txt`, postContentToWrite)
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
const likePost = (blogName, postTitle, username) => {
    const postToLike = (`${path.join(bPath, blogName, postTitleCheck(postTitle))}.txt`);

    return checkReg(username)
        .then(() => readFileP(postToLike))
        .then((content) => {
            const updatedPostC = updatePostContent(content, username);
            writeFileP(postToLike, updatedPostC)
                .then(() => console.log("You liked a post!"))
        })
}

const checkReg = (username) => {
    return readFileP(dbPath).then((data) => {
        const users = data.split(os.EOL);
        const exists = users.some((user) => user.match(`"username":"${username}"`));
        if (exists) {
            return (data);
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

//! Test cases:
//* Initial register for christy
// register("christy", "123")
//     .then(() => createABlog("christyBlog"))
//     .then(() => createAPost("Post 1", "This is the post content!", "christyBlog"))
//     .then(() => likePost("christyBlog", "Post_1", "christy"))
//     .catch((err) => console.log(err))

//* Like a post with invalid user
// likePost("christyBlog", "Post_1", "kacey", "123")
//     .catch((err) => console.log(err))

//* register john and like a post from christy
// register("john", "123")
//     .then(() => createABlog("johnBlog"))
//     .then(() => createAPost("Post 1", "This is the post content!", "johnBlog"))
//     .then(() => likePost("christyBlog", "Post_1", "john"))
//     .catch((err) => console.log(err))

//* like john's post as christy
// likePost("johnBlog", "Post_1", "christy")
//     .catch((err) => console.log(err))

//* New register but same blog name
// register("hana", "123")
//     .then(() => createABlog("christyBlog"))
//     .then(() => createAPost("Post 3", "This is the post content!", "christyBlog"))
//     .then(() => likePost("christyBlog", "Post_1", "hana"))
//     .catch((err) => console.log(err))
