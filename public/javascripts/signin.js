$(document).ready( function() {
	$('#signin').submit( function (e) {
		$('.error').remove();
		e.preventDefault();
		var $form = $(this),
			username = $form.find("input[name='username']").val(),
			password = $form.find("input[name='password']").val(),
			url = $form.attr('action');

		var data = { username : username, password : password };

		$.ajax({
			url: url,
			type: 'POST',
			data: JSON.stringify(data),
			contentType: 'application/json',
			success: function(data) {
				if (data.failure) {
					$('#passwordInput').append(
						'<p class=\'error\' style=\'color:red; padding-top: .4em;\'>Username and password do not match.</p>'
					);
					$('.error').hide().fadeIn(1000);
				}
				else {
					console.log(data.redirect);
					// window.location.replace("http://google.com");
					window.location.replace("http://mymongo-dc11.rhcloud.com" + data.redirect);
				}
			}
		});
	});
});