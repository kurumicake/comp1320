const fs = require("fs");
const path = require("path");
const os = require("os");
const dbPath = path.join(__dirname, "database.txt")
const blogPath = path.join(__dirname, "blogs")


// PROMISE VERSION OF ALL FS FUNCTIONS
const readFileP = (fn) => {
    return new Promise((resolve, reject) => {
        fs.readFile(fn, "utf8", (err, data) => {
            if (err) return reject(err);
            resolve(data);
        });
    })
}

const appendFileP = (fn, data) => {
    return new Promise((resolve, reject) => {
        fs.readFile(fn, data, (err) => {
            if (err) return reject();
            resolve();
        });
    });
};

const writeFileP = (fn, data) => {
    return new Promise((resolve, reject) => {
        fs.readFile(fn, data, (err) => {
            if (err) return reject();
            resolve();
        });
    });
};

const mkdirP = (fn) => {
    return new Promise((resolve, reject) => {
        fs.mkdir(fn, { recursive: true }, (err) => {
            if (err) return reject();
            resolve();
        })
    })
}

// REGISTER FUNCTION 
const register = (username, password) => {
    const userData = (`${username}: ${password}${os.EOL}`);
    return readFileP(dbPath)
        .then((data) => checkUserNameExists(data, username, password))
        .then(() => appendFileP(dbPath, userData))
}

const checkUserNameExists = (data, username, password) => {
    console.log(data);
    const existingUsers = data.split(`: ${password}${os.EOL}`).map((line) => line.trim());
    if (existingUsers.match(username)) {
        throw (`Name already exists.`);
    } else {
        return;
    }
}

// CREATE A BLOG FUNCTION
const createABlog = (blogName) => {
    const blogDirName = path.join(blogPath, blogName);
    return mkdirP(blogDirName)
        .then(() => console.log(`Directory ${blogDirName} created.`))
        .catch((err) => {
            if (err.code === "EEXIST") {
                throw (`Error: Blog with a name of ${blogName} already exists.`)
            } else {
                throw (err);
            }
        })
}

// CREATE A POST
const createAPost = (postTitle, postContent, blogName) => {
    const fileNameWithoutSpaces = postTitle.split(" ").join("_");
    const blogPost = (`${path.join(blogPath, blogName, fileNameWithoutSpaces)}`);
    const postContentToWrite = (`likes: 1${os.EOL}likedby: you${os.EOL}${postContent}`);
    writeFileP(`${blogPost}.txt`, postContentToWrite, { flag: "wx" })
        .then(() => console.log("New Post was created"))
        .catch(err => {
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

// LIKE POST
const likePost = (blogName, postTitle, username) => {
    const postToLike = (`${path.join(blogPath, blogName, postTitle)}.txt`);
    readFileP(dbPath)
        .then((content) => likePostUserCheck(content))
        .then(content => {
            const updatedPostContent = updatePostContent(content, username);
            writeFileP(postToLike, updatedPostContent)
        })
        .then(() => console.log("Your post was liked!"))
}


const likePostUserCheck = (content) => {
    if (content.includes(username)) return readFileP(postToLike);
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