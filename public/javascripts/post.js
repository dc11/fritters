$(document).ready( function () {
	
	$('#tweetSomething').submit( function (e) {
		e.preventDefault();
		$('.error').remove();

		var $form = $(this),
			freet = $form.find("textarea[name='freet']").val(),
			url = $form.attr('action');
		console.log(freet);

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
					console.log(data);
					if (data.failure) {
						$form.append(
							"<p class='error' id='serverError' style='color: red; padding-top: .4em'>Server error.  Try again.</p>"
						);
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
						// 	                        <button type="submit" class="btn btn-default">Submit</button>
						// 	                      </div>
						// 	                    </form>
						// 		            </div>'
						var appendString = '<div class="tweet" id="' + data.id + '"><div class="content"><span style="font-weight: bold;">' + data.author + '</span>: ' + data.freet + '</div><form role="form" class="tweetDelete" action="/delete" method="post"><input type="hidden" name="delete" value="' + data.id + '"><input type="hidden" name="author" value="' + data.author + '"><button type="submit" class="btn btn-default" style="margin-top: .5em;">Delete<span class="glyphicon glyphicon-remove" style="padding-left: .4em;"></span></button><a href="/edit"><button class="btn btn-default editButton" id="editButton" name="' + data.id + '" style="margin-top: .5em;">Edit<span class="glyphicon glyphicon-pencil" style="padding-left: .4em;"></span></button></a></form><form role="form" action="/edit" method="post" class="formEdit" name="' + data.id + '"><div class="editForm" name="' + data.id + '"><div class="form-group"><input type="hidden" name="id" value="' + data.id + '"><input type="hidden" name="author" value="' + data.author + '"><textarea rows="3" class="form-control" name="edit">' + data.freet + '</textarea></div><button type="submit" class="btn btn-default">Submit</button></div></form></div>';
						var idString = "#" + data.id;
						$(idString).hide().fadeIn(1000);
						$('#tweets').prepend(appendString);

					}
				}
			});
		}
		$form.find("textarea[name='freet']").val('');
		$('.error').hide().fadeIn(1000);
	});
});