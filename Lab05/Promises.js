const fs = require("fs");
const os = require("os");
const path = require("path");

const dbPath = path.join(__dirname, "database.txt");
const blogPath = path.join(__dirname, "blogs");


const register = (username, password) => {
    const userData = (`${username}: ${password}${os.EOL}`);
    return new Promise((resolve, reject) => {
        fs.readFile(dbPath, "utf8")
            .then((content) => checkUserNameExists(content))
            .then(() => fs.appendFile(dbPath, userData))
            .then(() => resolve())
            .catch((err) => reject(errHandle(err)))
    })
}

const errHandle = (err) => {
    if (err.code === "ENOENT") {
        fs.writeFile(dbPath, "")
            .then(() => new Error("Database did not exist! Created database for you. Please run again!"))
            .catch(err => new Error(err))
    } else {
        throw (err);
    }
}

const checkUserNameExists = (content) => {
    const existingUsers = content.split(`: ${password}${os.EOL}`).map((line) => line.trim());
    if (existingUsers.match(username)) {
        throw (`Username "${username}" already exists.`);
    } else {
        return content;
    }
}


const createABlog = (blogName) => {
    return new Promise((resolve, reject) => {
        fs.mkdir(blogPath, { recursive: true })
            .then(() => resolve(`Directory named: ${blogPath} created`))
            .catch((err) =>
                err = err.code === "EEXIST" ? reject(`Error: Blog with a name of ${blogName} already exists.`) : reject(err)
            )
    })
}

// const likePost = (blogName, postTitle, username) => {
//     const postToLike = (`${path.join(blogPath, blogName, postTitle)}.txt`);
//     return new Promise((resolve, reject) => {
//         fs.readFile(dbPath, "utf8")
//             .then(content => existingUser(content, username))
//             .then(() => fs.readFile(postToLike, "utf8"))
//             .then((content) => resolve(writeFile(content, updatedPostContent)))
//             .catch((err) => reject(err))
//     })
// }

// const updatePostContent = (content, username) => {
//     const updatedContent = content.split(os.EOL);
//     const likesLine = updatedContent[0];
//     const updatedFinalDigitInLine = parseInt(likesLine[likesLine.length - 1]) + 1;
//     updatedContent[0] = `likes:${updatedFinalDigitInLine}`;
//     updatedContent[1] = `${updatedContent[1]}, ${username}`;
//     return updatedContent.join(os.EOL);
// }

// const existingUser = (content, username) => {
//     const existingUsers = content.split(`: ${password}${os.EOL}`).map((line) => line.trim());
//     if (existingUsers.match(username)) {
//         return content;
//     } else {
//         throw (`You need to be a registered user to like a post`);
//     }
// }

// const writeFile = (postToLike, updatedPostContent) => {
//     fs.writeFile(postToLike, updatedPostContent)
//         .then(() => console.log("Your post was liked!"))
//         .catch(err => new Error(err));
// }

register("christy", "123")
    .then(() => createABlog("christyBlog"))
    .then(() => createAPost("Post 1", "This is the post content!", "christyBlog"))
    // .then(() => likePost("christyBlog", "Post_1", "christy"))
    .catch((err) => console.log(err));