IOhandler.unzip(zipFilePath, pathUnzipped)
    .then(() => IOhandler.readDir(pathUnzipped))
    .then((src) => {
        const promises = [];
        src.forEach((fn, i) => promises.push(IOhandler.grayScale(fn, pathProcessed, i)))
        return Promise.all(promises)
    })
    .catch((err) => console.error(err))