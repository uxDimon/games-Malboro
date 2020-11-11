let pathTabakGame = "../tabak-game/index.html";

window.addEventListener("DOMContentLoaded", function () {
	if (localStorage.getItem("isGameComplete") != "true") {
		$(".screen-photo").addClass("active");
	} else {
		window.location = pathTabakGame;
	}
});

$.ube = {
	host: "https://ube-test.pmsm.org.ru",
	toggleLoader: function (visible) {
		/*Можно стилизовать отображение загрузки*/
		visible ? $(".js-loader").fadeIn() : $(".js-loader").fadeOut();
	},
	showPopup: function (message) {
		showCustomPopup(message);
	},
	hidePopup: function () {
		hideCustomPopup();
	},
	showRules: function (event) {
		$(".privacy").addClass("active");
	},
	hideRules: function (event) {
		$(".privacy").removeClass("active");
	},
};

function showCustomPopup(message) {
	if (message.indexOf("молод") > -1) {
		$(".popup .text").text(
			"Кажется, ты выглядишь слишком молодо. Возможно, ты не выполнил одно из условий. В любом случае стоит попробовать еще раз, чтобы изображение получилось более чётким, не засвеченным и не слишком затемненным."
		);
	} else {
		$(".popup .text").text(message);
	}
	$(".popup").fadeIn();
	$(".overlay").fadeIn();
}

function hideCustomPopup() {
	$(".popup").fadeOut();
	$(".overlay").fadeOut();
}

$(document).on("click", ".screen-photo .btn", function () {
	$("#scanface").addClass("active");
	$("#scanface").ubeScanpackFace("scanpack-casual-reg", function (result) {
		console.log(result);
		if (result) {
			$("#scanface").removeClass("active");
			$(".screen-photo").removeClass("active");
			$(".screen-tel").addClass("active");
			$(".screen-tel__form").ubeScanpackLogin("scanpack-casual-reg", function (result) {
				if (result === "loginSuccess") {
					$(".screen-tel").removeClass("active");
					$(".screen-denied").addClass("active");
				} else if (result === "registered") {
					$(".screen-tel").removeClass("active");
					$(".screen-success").addClass("active");
				}
			});
		}
	});
});

$(document).on("click", ".privacy__close", function () {
	$.ube.hideRules();
});
$(document).on("click", ".screen-denied .btn", function () {
	window.location = pathTabakGame;
});
