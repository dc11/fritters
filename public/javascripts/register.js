$(document).ready( function() {
	
	$('#register').submit( function (e) {
		e.preventDefault();

		$('.error').remove();

		var $form = $(this),
			username = $form.find("input[name='username']").val(),
			password = $form.find("input[name='password']").val(),
			reenter = $form.find("input[name='reenter']").val(),
			url = $form.attr('action');

		if (username.length < 1) {
			$('#usernameForm').append(
				"<p class='error' id='noUsername' style='color:red; padding-top: .4em;'>Please choose a username.</p>"
			);
			$('#noUsername').hide().fadeIn(1000);
		}
		else if (password.length < 1) {
			$('#passwordForm').append(
				"<p class='error' id='noPassword' style='color: red; padding-top: .4em;'>Please choose a password.</p>"
			)
			$('#noPassword').hide.fadeIn(1000);			
		}
		else if (password != reenter) {
			$('#reenterForm').append(
				"<p class='error' id='notMatching' style='color: red; padding-top: .4em'>Passwords do not match.</p>"
			)
			$('#notMatching').hide.fadeIn(1000);
		}
		else {
			var data = {username : username, password : password};

			$.ajax({
				url: url,
				type: 'POST',
				data: JSON.stringify(data),
				contentType: 'application/json',
				success: function(data) {
					if (data.usernameExists) {
						$('#usernameForm').append(
							"<p class='error' id='usernameTaken' style='color:red; padding-top: .4em;'>Username already taken.</p>"
						);
						$('#usernameTaken').hide().fadeIn(1000);
					}
					else {
						window.location.href = data.redirect;
					}
				}
			});			
		}


	})
	
});