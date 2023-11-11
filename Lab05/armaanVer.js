const fs = require("fs").promises;
const path = require("path");
const os = require("os");
const db = path.join(__dirname, "db.txt")
const blogDir = path.join(__dirname, "blogs")

const register = (username, password) => {
    return new Promise((resolve, reject) => {
        fs.readFile(db, "utf8")
            .then(content => {
                if (content.includes(username)) {
                    return reject(`Username "${username}" already exists.`);
                } else {
                    fs.appendFile(db, `${username}: ${password}${os.EOL}`)
                        .then(() => resolve())
                        .catch((err) => reject(err))
                }
            })
            .catch(err => {
                if (err.code === "ENOENT") {
                    fs.writeFile(db, "")
                        .then(() => reject("Database did not exist! Created database for you. Please run again!"))
                        .catch(err => reject(err))
                } else {
                    reject(err);
                }
            })
    })
}

const createABlog = (blogName) => {
    const blogDirName = path.join(blogDir, blogName);
    return new Promise((resolve, reject) => {
        fs.mkdir(blogDirName, { recursive: true })
            .then(() => {
                console.log(`Directory ${blogDirName} created.`)
                resolve();
            })
            .catch(err => {
                if (err.code === "EEXIST") {
                    reject(`Error: Blog with a name of ${blogName} already exists.`)
                } else {
                    reject(err);
                }
            })
    })
}

const createAPost = (postTitle, postContent, blogName) => {
    return new Promise((resolve, reject) => {
        const fileNameWithoutSpaces = postTitle.split(" ").join("_");
        const blogPost = (`${path.join(blogDir, blogName, fileNameWithoutSpaces)}`);
        const postContentToWrite = (`likes: 1${os.EOL}likedby: you${os.EOL}${postContent}`);
        fs.writeFile(`${blogPost}.txt`, postContentToWrite, { flag: "wx" })
            .then(() => {
                console.log("New Post was created")
                resolve();
            })
            .catch(err => {
                if (err.code === "EEXIST") {
                    const modifiedBlogPostTitle = `${blogPost}${parseInt(Date.now() + Math.random())}`;
                    createAPost(modifiedBlogPostTitle, postContent, blogName);
                } else if (err.code === "ENOENT") {
                    reject(`A folder with the name of ${blogName} does not exist. Please create a blog first`);
                } else {
                    reject(err);
                }
            })
    })
}

const likePost = (blogName, postTitle, username) => {
    return new Promise((resolve, reject) => {
        const postToLike = (`${path.join(blogDir, blogName, postTitle)}.txt`);
        fs.readFile(db, "utf8")
            .then(content => {
                if (content.includes(username)) {
                    fs.readFile(postToLike, "utf8")
                        .then(content => {
                            const updatedPostContent = updatePostContent(content, username);
                            fs.writeFile(postToLike, updatedPostContent)
                                .then(() => {
                                    console.log("Your post was liked!");
                                    resolve();
                                })
                                .catch(err => reject(err))
                        })
                } else {
                    reject("You need to be a registered user to like a post")
                }
            })
            .catch(err => reject(err))
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


register("christy", "123")
    .then(() => createABlog("christyBlog"))
    .then(() => createAPost("Post 1", "This is the post content!", "christyBlog"))
    .then(() => likePost("christyBlog", "Post_1", "christy"))
    .catch((err) => { console.log(err) });

// likePost("christyBlog", "Post_1", "mark")
//     .then(() => console.log("liked!"))
//     .catch((err) => console.log(err));

// register("joe", "123")
//     .then(() => createABlog("joeBlog"))
//     .then(() => createAPost("joe post", "This is the post content joe!", "joeBlog"))
//     .then(() => likePost("christyBlog", "Post_1", "joe"))
//     .catch((err) => { console.log(err) });

// register("ss", "123")
//     .then(() => createABlog("joeBlog"))
//     .then(() => createAPost("joe post", "This is the post content joe!", "joeBlog"))
//     .then(() => likePost("christyBlog", "Post_1", "joe"))
//     .catch((err) => { console.log(err) });