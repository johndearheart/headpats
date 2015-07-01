function loadImages(subreddit, container, timeout) {
    "use strict";
    //Load some hot posts from the specified subreddit
    reddit.hot(subreddit).limit(100).fetch(function (res) {
        //Once we've got the list of posts, initialize our post index
        var i = -1;
        //console.log("POST COUNT:" + res.data.children.length);
        //Returns the link to the thumbnail image for the post at the specified index
        function getThumbnailLink(i) {
            return res.data.children[i].data.thumbnail;
        }

        //Returns the link to the post at the specified index
        function getPostLink(i) {
            if (i < res.data.children.length) {
                return res.data.children[i].data.url;
            } else {
                return "";
            }
        }

        //Returns true if the post at the specified index is a jpg, png, or gif
        function isImageIndex(i) {
            var link = getPostLink(i);
            var imageRegex = /.+\.(jpg|png|gif)/;
            return imageRegex.test(link);
        }

        //Loads the image from the post at the specified index into browser memory
        function preloadImageAtIndex(index) {
            var image = new Image();
            image.src = getPostLink(i);
            //console.log("Preloading Image " + i);
        }

        //Loads the image at the specified link into the global display container
        function displayImage(link) {
            container.css("background-image", 'url(' + link + ')');
            //console.log("Loading Image At " + link);
        }

        //Returns the index of the next image post after the given index
        function nextImageIndexAfter(i) {
            i += 1;
            while (!isImageIndex(i)) {
                i += 1;
                //If we've gone over the maximum number of images, go back to the start
                if (i > res.data.children.length) {
                    i = 0;
                    //console.log("---- Rolling Over To Start ----");
                }
            }
            //console.log("Next Post At " + i);
            return i;
        }

        //Load the first image
        i = nextImageIndexAfter(i);
        displayImage(getPostLink(i));

        //Preload the next image
        i = nextImageIndexAfter(i);
        preloadImageAtIndex(i);
        //Load all subsequent images
        window.setInterval(function () {
            //Load the current image
            displayImage(getThumbnailLink(i));
            displayImage(getPostLink(i));
            //Preload the next image
            i = nextImageIndexAfter(i);
            preloadImageAtIndex(i);
        }, timeout);
    });
}