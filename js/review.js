//Initialize the Parse app and extend Parse object
Parse.initialize("NYoDvM4GAw2fj20aki2zhbP4Zsir2QgSIxyStVpb", "kbxV5xkbd7oqJwxohnQiQ4naEEwQwABdhNQRHbe6");

var productReview = Parse.Object.extend('productReview');

var review = new productReview();

// Click event when form is submitted

$('#rating').raty({ 
	path: 'images',
	score: 3
		
});

$('form').submit( function() {
	var rating = $('#rating').raty('score');
	var username = $('#review_username').val();
	var title = $('#review_title').val();
	var body = $('#review_body').val();
	review.set('review_rating', rating);		
	review.set('review_username', username)
	review.set('review_title', title);
	review.set('review_body', body);
	review.set('review_like', 0);
	review.set('review_dislike', 0);		


	//Calls getData() if save to Parse succeeded
	review.save(null, {
		success:getData
	}).then(function(){
			$('#rating').raty('set', {
				option:3
			});
			$('review_username').val('');
			$('#review_title').val('');
			$('#review_body').val('');
		})

	return false;
});