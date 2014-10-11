$(document).ready( function() {
	var setup = function() {
		$('.editButton').each(function () {
			$(this).click( function (e) {
				e.preventDefault();
				var $editButton = $(this);
				var id = $editButton.attr('name');
				$editButton.hide();
				console.log('edit');

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
										// setup();
									}
									else {
										$form.parent().children('.content').empty().append(
											"<span style='font-weight: bold;'>" + author + "</span>: " + data.freet
										);
										$form.hide();
										// $editButton.show();
										setup();
									}
								}
							})
						}
					});
				});
			});
		});		
	}
	setup();
});