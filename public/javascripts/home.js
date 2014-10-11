$(document).ready( function() {
	var edit = function() {
		$('.editButton').each(function () {
			$(this).click( function (e) {
				e.preventDefault();
				var $editButton = $(this);
				var id = $editButton.attr('name');
				$editButton.hide();

				$('.formEdit').each( function () {
					var $form = $(this);
					if ($form.attr('name') == id) {
						$form.children().fadeIn(1000);
					}

					$form.submit( function (e) {
						e.preventDefault();
						var postID = $form.find("input[name='id']").val(),
							author = $form.find("input[name='author']").val(),
							content = $form.find("textarea[name='edit']").val(),
							url = $form.attr('action');

						$('.error').remove();
						if (content.length < 1) {
							$form.append(
								"<p class='error' id='editError' style='color: red; padding-top: .4em'>Please enter freet.</p>"
							)
						}
						else if (content.length > 140) {
							$form.append(
								"<p class='error' id='editError' style='color: red; padding-top: .4em'>Freet must be less than 140 characters.</p>"
							);
						}
						else {
							var data = { author : author, id : postID, freet : content};
							$.ajax({
								url: url,
								method: 'POST',
								data: JSON.stringify(data),
								contentType: 'application/json',
								success: function(data) {
									if (data.failure) {
										$form.append(
											"<p class='error' id='editError' style='color: red; padding-top: .4em'>Server error.  Try again.</p>"
										);
										set();
									}
									else {
										$form.parent().children('.content').empty().append(
											"<span style='font-weight: bold;'>" + author + "</span>: " + data.freet
										);
										$form.hide();
										set();
									}
								}
							})
						}
					});
				});
			});
		});		
	}

	var deleteFreet = function () {
		$('.tweetDelete').each( function() {
			var $form = $(this);

			$form.submit( function (e) {
				e.preventDefault();

				$('.deleteError').remove();

				var url = $form.attr('action'),
					id = $form.find("input[name='delete']").val(),
					author = $form.find("input[name='author']").val();

				var data = { id: id, author : author };
				$.ajax({
					url: url,
					method: 'POST',
					data: JSON.stringify(data),
					contentType: 'application/json',
					success: function(data) {
						if (data.failure) {
							$form.append(
								"<p class='deleteError' id='editError' style='color: red; padding-top: .4em'>Server error.  Try again.</p>"
							);
							set();
						}
						else {
							$form.parent().fadeOut(500);
							set();
						}
					}
				});
			});
		});
	}

	var post = function() {
		$('#tweetSomething').submit( function (e) {
			e.preventDefault();
			$('.error').remove();

			var $form = $(this),
				freet = $form.find("textarea[name='freet']").val(),
				url = $form.attr('action');

			if (freet.length < 1) {
				$('#tweetForm').append(
					"<p class='error' id='postError' style='color: red; padding-top: .4em'>Please enter freet.</p>"
				);			
			}
			else if (freet.length > 140) {
				$('#tweetForm').append(
					"<p class='error' id='lengthError' style='color: red; padding-top: .4em'>Freet must be less than 140 characters.</p>"
				);
			}
			else {
				var data = { freet : freet };
				$.ajax({
					url: url,
					method: 'POST',
					data: JSON.stringify(data),
					contentType: 'application/json',
					success: function(data) {
						if (data.failure) {
							$form.append(
								"<p class='error' id='serverError' style='color: red; padding-top: .4em'>Server error.  Try again.</p>"
							);
							set();
						}
						else {
							// var appendString = '<div class="tweet" id="' + data.id + '">
							// 	                	<div class="content">
							// 		                  <span style="font-weight: bold;">' + data.author + '</span>: ' + data.freet + '
							// 		                </div>	
							// 	                    <form role="form" id="tweetDelete" action="/delete" method="post">
							// 	                      <input type="hidden" name="delete" value="' + data.id + '">
							// 	                      <input type="hidden" name="author" value="' + data.author + '">
							// 	                      <button type="submit" class="btn btn-default" style="margin-top: .5em;">Delete<span class="glyphicon glyphicon-remove" style="padding-left: .4em;"></span></button>
							// 	                      <a href="/edit"><button class="btn btn-default editButton" id="editButton" name="' + data.id + '" style="margin-top: .5em;">Edit<span class="glyphicon glyphicon-pencil" style="padding-left: .4em;"></span></button></a>
							// 	                    </form>
								                    
							// 	                    <form role="form" action="/edit" method="post" class="formEdit" name="' + data.id + '">
							// 	                      <div class="editForm" name="' + data.id + '">
							// 	                        <div class="form-group">
							// 	                          <input type="hidden" name="id" value="' + data.id + '">
							// 	                          <input type="hidden" name="author" value="' + data.author + '">
							// 	                          <textarea rows="3" class="form-control" name="edit">' + data.freet + '</textarea>
							// 	                        </div>
							// 	                        <button type="submit" class="btn btn-default post">Submit</button>
							// 	                      </div>
							// 	                    </form>
							// 		            </div>'
							var appendString = '<div class="tweet" id="' + data.id + '"><div class="content"><span style="font-weight: bold;">' + data.author + '</span>: ' + data.freet + '</div><form role="form" class="tweetDelete" action="/delete" method="post"><input type="hidden" name="delete" value="' + data.id + '"><input type="hidden" name="author" value="' + data.author + '"><button type="submit" class="btn btn-default" style="margin-top: .5em;">Delete<span class="glyphicon glyphicon-remove" style="padding-left: .4em;"></span></button><a href="/edit"><button class="btn btn-default editButton" id="editButton" name="' + data.id + '" style="margin-top: .5em;">Edit<span class="glyphicon glyphicon-pencil" style="padding-left: .4em;"></span></button></a></form><form role="form" action="/edit" method="post" class="formEdit" name="' + data.id + '"><div class="editForm" name="' + data.id + '"><div class="form-group"><input type="hidden" name="id" value="' + data.id + '"><input type="hidden" name="author" value="' + data.author + '"><textarea rows="3" class="form-control" name="edit">' + data.freet + '</textarea></div><button type="submit" class="btn btn-default post">Submit</button></div></form></div>';
							var idString = "#" + data.id;
							$(idString).hide().fadeIn(1000);
							$('#tweets').prepend(appendString);
							console.log("set called from post");
							set();
						}
					}
				});
			}
			$form.find("textarea[name='freet']").val('');
			$('.error').hide().fadeIn(1000);
		});
	}

	var refreet = function () {
		$('.refreet').each( function() {
			var $form = $(this);
			console.log("refreet is reset");

			$form.submit( function (e) {
				e.preventDefault();
				var user = $form.find("input[name='user']").val(),
					refreet = $form.find("input[name='post']").val(),
					postId = $form.find("input[name='postId']").val(),
					url = $form.attr('action');

				var data = { user : user, refreet : refreet, postId : postId };

				$.ajax({
					url: url,
					method: 'POST',
					data: JSON.stringify(data),
					contentType: 'application/json',
					success: function(data) {
						if (data.failure) {
							$form.append(
								'<p class=\'error\' style=\'color:red; padding-top: .4em;\'>Server error.  Try again.</p>'
							);
							set();
						}
						else {
							var appendString = '<div class="tweet" id="' + data.id + '"><div class="content"><span style="font-weight: bold;">' + data.author + '</span>: ' + data.refreet + '</div><form role="form" class="tweetDelete" action="/delete" method="post"><input type="hidden" name="delete" value="' + data.id + '"><input type="hidden" name="author" value="' + data.author + '"><button type="submit" class="btn btn-default" style="margin-top: .5em;">Delete<span class="glyphicon glyphicon-remove" style="padding-left: .4em;"></span></button><a href="/edit"><button class="btn btn-default editButton" id="editButton" name="' + data.id + '" style="margin-top: .5em;">Edit<span class="glyphicon glyphicon-pencil" style="padding-left: .4em;"></span></button></a></form><form role="form" action="/edit" method="post" class="formEdit" name="' + data.id + '"><div class="editForm" name="' + data.id + '"><div class="form-group"><input type="hidden" name="id" value="' + data.id + '"><input type="hidden" name="author" value="' + data.author + '"><textarea rows="3" class="form-control" name="edit">' + data.refreet + '</textarea></div><button type="submit" class="btn btn-default post">Submit</button></div></form></div>';
							$('#tweets').prepend(appendString);
							set();
						}
					}
				});
			});
		});
	}

	var set = function () {
		console.log("set");
		deleteFreet();
		edit();
		post();
		$('.error').remove();
	}

	refreet();
	set();
});








