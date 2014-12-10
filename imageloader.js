function loadImages(subreddit, container, timeout) {
	//Load some hot posts from the specified subreddit
	reddit.hot(subreddit).fetch(function(res) {		
		var max = res.data.children.length;
		var i = 0;
		//Update the container with each post
		window.setInterval( function() {
				//Update to the next post
				var post = res.data.children[i].data;
				var link = post.url;
			
				//Skip all posts that aren't images
				while (!isImageLink(link)) {
					i++;
					post = res.data.children[i].data;
					link = post.url;
				}
				
				//Load the images				
				container.css('background-image', 'url(' + link + ')');
				console.log(link);
				console.log(i);
				
				//Increment image counter.  If we're out, go back to the start.
				i++;
				if (i >= max) {
					i = 0;
				}
				
				//Print for debug
				console.log(i);
			}, timeout);
		}
	);
}

function isImageLink(link) {
	var imageRegex = /.+\.(jpg|png|gif)/;
	return imageRegex.test(link);
}