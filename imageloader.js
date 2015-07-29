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
        function getImageLink(i) {
            if (i < res.data.children.length) {
                return res.data.children[i].data.url;
            } else {
                return "";
            }
        }

        //Returns true if the post at the specified index is a jpg, png, or gif
        function isImageIndex(i) {
            var link = getImageLink(i);
            var imageRegex = /.+\.(jpg|png|gif)/;
            return imageRegex.test(link);
        }

        //Loads the image from the post at the specified index into browser memory
        function preloadImage(i) {
            var thumbnail = new Image();
            thumbnail.src = getThumbnailLink(i);
			var image = new Image();
            image.src = getImageLink(i);
			console.log("Preloaded image " + i);
        }

        //Renders the image at the specified link into the global display container
        function renderImage(link) {
            container.css("background-image", 'url(' + link + ')');
            //console.log("Loading Image At " + link);
        }
		
		//Progressively displays the image at the given index
		function loadImage(i) {
			//Find the full link
            var image = new Image();
			var imageLink = getImageLink(i);
			//Remember to display it once it's fully loaded
			image.onload = function () {
				console.log("Fully loaded image " + i);
				renderImage(imageLink);
			};
			//Start loading the image
            image.src = imageLink;
			window.setTimeout(function () {
				image.src = "";
				image = null;
			}, timeout);
			if (!image.complete) {
				//Render the thumbnail no matter what
				renderImage(getThumbnailLink(i));
				console.log("Showed thumbnail for image " + i);
			}
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

        //Find the first image
        i = nextImageIndexAfter(i);
		loadImage(i);
        i = nextImageIndexAfter(i);
        preloadImage(i);
        //Load all images
        window.setInterval(function () {
            //Load the current image
            loadImage(i);
            //Preload the next image
            i = nextImageIndexAfter(i);
            preloadImage(i);
        }, timeout);
    });
}