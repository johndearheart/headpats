function loadImages(subreddit, container, timeout) {
	//Load some hot posts from the specified subreddit
	reddit.hot(subreddit).fetch(function(res) {
	    console.log(res.data);
		
		var max = res.data.children.length;
		var i = 0;
		//Update the container with each post
		window.setInterval( function() {
				//store the post in a variable
				var post = res.data.children[i].data;
				var link = post.url;
			
				var imageRegex = /.+\.(jpg|png|gif)/;
				//if there's an image, load it into the container
				if (imageRegex.test(link)) {
					container.css('background-image', 'url(' + link + ')');
					console.log(link);
					console.log(i);
				}
				
				i++;
				if (i > max) {
					i = 0;
				}
				console.log(i);
			}, timeout);
		}
	);
}