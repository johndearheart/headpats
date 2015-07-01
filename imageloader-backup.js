function loadImages(subreddit, container, timeout) {

    //Load some hot posts from the specified subreddit
    reddit.hot(subreddit).limit(100).fetch(function (res) {
        //Post count starts at 0 and goes to the length of the post array
        var i = 0;
        var max = res.data.children.length;

        i = nextImage(res, i, container) + 1;

        //Update the container with each post
        window.setInterval(function () {
            i = nextImage(res, i, container);
            //Increment image counter.  If we're out, go back to the start.
            i++;
            if (i >= max) {
                res = reddit.hot(subreddit).after(res.data.children[i - 1].id).fetch(function (res) {
                    return res;
                });
                i = 0;
            }
        }, timeout);
    });
}

function nextImage(res, i, container) {
    console.log("i is: " + i);
    //Skip to the next link
    var link = loadImageLink(res, i);

    //Keep skipping posts until you find an image link
    while (!isImageLink(link)) {
        i++;
        link = loadImageLink(res, i);
    }
    //Load the image link into the container
    var image = new Image();
    image.src = link;
    loadImageIntoContainer(loadImageThumbnail(res, i), container);
    loadImageIntoContainer(link, container);
    return i;
}

function loadImageLink(res, i) {
    return res.data.children[i].data.url;
}

function loadImageThumbnail(res, i) {
    var link = res.data.children[i].data.thumbnail;
    return link;
}

function loadImageIntoContainer(link, container) {
    //Load the image into the container as a background image
    container.css("background-image", 'url(' + link + ')');
    console.log("LOADED IMAGE:" + link);
}

function isImageLink(link) {
    var imageRegex = /.+\.(jpg|png|gif)/;
    return imageRegex.test(link);
}