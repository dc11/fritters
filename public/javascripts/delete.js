$(document).ready( function () {
	$('.tweetDelete').each( function() {

		var $form = $(this);

		$form.submit( function (e) {
			e.preventDefault();

			$('.deleteError').remove();

			var url = $form.attr('action'),
				id = $form.find("input[name='delete']").val();

			var data = {id: id};
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
					}
					else {
						$form.parent().fadeOut(500);
					}
				}
			});
		});
	});
});