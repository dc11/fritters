$(document).ready(function () {
	$('.refreet').each( function() {
		var $form = $(this);

		$form.submit( function (e) {
			e.preventDefault();
			var user = $form.find("input[name='user']").val(),
				refreet = $form.find("input[name='post']").val(),
				postId = $form.find("input[name='postId']").val(),
				url = $form.attr('action');

			var data = { user : user, refreet : refreet, postId : postId };

			console.log(data);

			$.ajax({
				url: url,
				method: 'POST',
				data: JSON.stringify(data),
				contentType: 'application/json',
				success: function(data) {
					console.log(data);
					if (data.failure) {
						console.log("failing");
						$form.append(
							'<p class=\'error\' style=\'color:red; padding-top: .4em;\'>Server error.  Try again.</p>'
						);
					}
					else {
						console.log("should now append");
						var appendString = '<div class="tweet" id="' + data.id + '"><div class="content"><span style="font-weight: bold;">' + data.author + '</span>: ' + data.refreet + '</div><form role="form" id="tweetDelete" action="/delete" method="post"><input type="hidden" name="delete" value="' + data.id + '"><input type="hidden" name="author" value="' + data.author + '"><button type="submit" class="btn btn-default" style="margin-top: .5em;">Delete<span class="glyphicon glyphicon-remove" style="padding-left: .4em;"></span></button><a href="/edit"><button class="btn btn-default editButton" id="editButton" name="' + data.id + '" style="margin-top: .5em;">Edit<span class="glyphicon glyphicon-pencil" style="padding-left: .4em;"></span></button></a></form><form role="form" action="/edit" method="post" class="formEdit" name="' + data.id + '"><div class="editForm" name="' + data.id + '"><div class="form-group"><input type="hidden" name="id" value="' + data.id + '"><input type="hidden" name="author" value="' + data.author + '"><textarea rows="3" class="form-control" name="edit">' + data.refreet + '</textarea></div><button type="submit" class="btn btn-default">Submit</button></div></form></div>';
						$('#tweets').prepend(appendString);
					}
				}
			});
		});
	});
});