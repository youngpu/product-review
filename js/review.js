//Initialize the Parse app and extend Parse object
Parse.initialize("QIUUyx7UgT7Bcyr0PHiBqGGxaPFUyWc2g9B2JfI9", "Ac06MhzpoBCP2KUxjc3IuW21mSoZeOBIAo5WOjjB");
//created instance outside of other functions in order to prevent spamming of reviews
var Review = Parse.Object.extend('Review');
var review = new Review();		
//initializes total number of reviews and ratings
var ratingTotal;
var reviewsNumber;

//initialize the aray data for the review section
$('form').submit(function() {
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
	review.save(null, {
		success:getData
	}).then(function(){
		$('#rating').raty('set', {
			option:3
		});
		$('#review_username').val('');
		$('#review_title').val('');
		$('#review_body').val('');
	})
	return false
})

//initializes the use of stars with set location, and default to 0 stars
$('#rating').raty({ 
	path: 'img',
	score: 0
});

//getting the data from the database
var getData = function() {
	//empties out the info each time, so it may be updated
	$('#averageRating').empty();
	$('#reviewRatings').empty();
	//reset the total and reviews to 0
	ratingTotal = 0;
	reviewsNumber = 0;
	//make an instance to look through data
	var query = new Parse.Query(Review)
	//if data found, start building the list
	query.find({
		success: function(results) {
			buildList(results);
			$('#averageRating').raty({
				path: 'img',
				readOnly: true,
				score: Math.round((ratingTotal/reviewsNumber)*2)/2
			})
		} 
	})
}

//build up lists of reviews
var buildList = function(data) {
	//empty out the review list section
	$('section').empty();
	var total = 0;
	//loop through each data in the database to add total rating values
	data.forEach(function(d) {
		total += addItem(d);
	})
	//find the average rating
	var avg = total/data.length;
	$('average').raty({
		path: 'img',
		readOnly: true,
		score: avg
	})
}

//add each reviews 
var addItem = function(item) {
	//intializes each elements to be added in the reviews
	var dateOfReview = item.get('createdAt');
	var user = item.get('review_username');
	var title = item.get('review_title');
	var body = item.get('review_body');
	var voteUp = item.get('review_like');
	var voteDown = item.get('review_dislike');
	var rating = item.get('review_rating');
	var button = $('<button class="btn-danger btn-xs"><span class="glyphicon glyphicon-remove"></span></button>');
	
	//a div for area where users review the products
	var userArea = $('<div class="reviewSpace"></div>');
	//Creates a div are where users use stars to rate
	var divRateStar = $('<div class="Rating"></div>').raty({
		half: true,
		score: rating,
		readOnly: true
	});

	//++ on reviews and add it to total rating
	reviewsNumber++;
	ratingTotal = ratingTotal + rating;

	//Title and delete button initalized to rows in Customer Review
	var titleOfReview = $('<h3 class="titleOfReivew"></h3>').text(' '+ title);
	var delChoice = $('<p class="delChoice"><span class="delTxt"></span> </p>').append(button);

	userArea.append(delChoice);
	userArea.append(divRateStar);
	userArea.append(titleOfReview);

	//customer review:user and date
	var dateReviewed = $('<p class="Date"></p>');
	var arryDate = dateOfReview.toString().split(' '); 
	var toStringD = arryDate[1] + ' ' + arryDate[2] + ', ' + arryDate[3];
	dateReviewed.text('By '+ user +' on '+ toStringD);
	userArea.append(dateReviewed);	

	//customer review: total helpful count and review
	var userTextReview = $('<p class="userTextReview"></p>').text(body);
	userArea.append(userTextReview);
	var helpfulCount = $('<p class="helpfulCount">'+ voteUp + ' out of ' + 
		(voteUp + voteDown) + ' users found this review helpful</p>');	
	userArea.append(helpfulCount);

	//customer review: helpful? if so thumb up or down
	var helpQuest = $('<p class="helpful">Was this review helpful? </p>');
	var thumbUp = $("<button class='btn btn-success'><span class='vote'><i class='fa fa-thumbs-o-up fa-1x'></i></span>Yes</button>");
	var thumbDown = $("<button class='btn btn-danger'><span class='vote'><i class='fa fa-thumbs-o-down fa-1x'></i></span>No</button>");
	helpQuest.append(thumbUp).append(thumbDown)
	userArea.append(helpQuest);

	//destroys a review if delete button is clicked
	button.click(function() {
		item.destroy({
			success:getData
		})
		return false;
	});
	
	//increment either like count or dislike count depending on which thumb is clicked.
	thumbUp.click(function(){
		item.increment('review_like');
		item.save(null, {
			success:getData
		});
		return false;
	});
	thumbDown.click(function(){
		item.increment('review_dislike');
		item.save(null, {
			success:getData
		});
		return false;
	});

	//Places at the top of Customer Reviews space, the last review submitted
	$('#reviewArea').prepend(userArea);

	//return the rating value to sum up
	return rating;
}

//finally get data to build lists when page is ready
$(document).ready(function(){
	getData();
});
