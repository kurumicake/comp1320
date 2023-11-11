const fs = require("fs");
const os = require("os");
const path = require("path");

/**This function should save their username and password into a text file called "database.txt" if the user does not already exist in that text file. If they already exist, you should generate an error letting them know that a user with that name already exists.  */

const checkUserNameExists = (username, password) => {
    return new Promise((resolve, reject) => {
        fs.readFile("database.txt", "utf8", (err, data) => {
            if (err) {
                reject(err);
            } else {
                const existingUsers = data.split(`: ${password}${os.EOL}`).map((line) => line.trim());
                if (existingUsers.match(username)) {
                    reject(`Name already exists.`);
                } else {
                    resolve();
                }
            }
        })
    })
}


const register = (username, password) => {
    return checkUserNameExists(username, password)
        .then(() => {
            return new Promise((resolve, reject) => {
                const userData = (`${username}: ${password}${os.EOL}`);
                fs.appendFile("database.txt", userData, (err, userInfo) => {
                    if (err) {
                        reject(err);
                    } else {
                        console.log(`User "${username} created`);
                        resolve(userInfo);
                    }
                })
            })
        })
}

/**This function should create a directory called "blogName". It should print a message when the directory has been created successfully. If a blog with the same name exists, it should print an error saying to choose a blog with another name.  */

const createABlog = (blogName) => {
    const blogPath = path.join(__dirname, blogName);
    return new Promise((resolve, reject) => {
        fs.mkdir(blogPath, (err, data) => {
            if (err) {
                if (err.code === "EEXIST") {
                    console.log(`Please choose a blog with another name.`);
                    return reject(err);
                }
                return reject(err);
            } else {
                console.log(`Created successfully.`);
                return resolve(data);
            }
        })
    })
};


const createPost = (postTitle, postContent, blogName) => {
    const postTitleFixed = postTitle.replace(" ", "_");
    const postPath = path.join(__dirname, blogName, postTitleFixed)
    return new Promise((resolve,reject) => {
        fs.writeFile(postPath, postContent, (err, post) => {
            if (err) {
                if (err.code === "EEXIST") {
                    reject( )
                }
                reject(err);
            } else {
                resolve(post);
            }
        })
    }) 
}




register("Christy", "QWERTY123")
    .then(() => createABlog("ChristyBlog"))
    .then((blogName) => createPost("Post 1", "Post content 11111", blogName))
    .catch((err) => console.log(err));

createABlog("ChristyBlog");
