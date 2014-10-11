$(document).ready(function () {
	$('.follow').each( function() {
		var $form = $(this);

		$form.submit( function (e) {
			e.preventDefault();
			var user = $form.find("input[name='user']").val(),
				toFollow = $form.find("input[name='toFollow']").val(),
				url = $form.attr('action');

			var data = { user : user, toFollow : toFollow };
			$('.error').remove();
			$('.p').remove();

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
					}
					else {
						$form.append(
							'<p class=\'p\' style=\'padding-top: .4em;\'>Following</p>'
						);
					}
				}
			});
		});
	});
});