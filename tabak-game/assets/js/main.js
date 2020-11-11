$.ube = {
	host: "https://ube-test.pmsm.org.ru",
	toggleLoader: function (visible) {
		/*Можно стилизовать отображение загрузки*/
		visible ? $(".js-loader").fadeIn() : $(".js-loader").fadeOut();
	},
	showPopup: function (message) {
		showCustomPopup(message);
	},
	showRules: function (event) {
		$(".privacy").addClass("active");
	},
	hideRules: function (event) {
		$(".privacy").removeClass("active");
	},
};

$(document).ready(function () {
	//Global Variables
	var imageArr = []; //insert all images in this array to preload
	var timerArray = [80, 110, 90];
	var mouseDown_timer;
	var percentageToWin = 99;
	var maxLeaf = 108;
	var currentLeaf = 0;
	var imagesPath = "assets/img/";
	var percentageHeal = 0;
	/*var hammertime;
  var myElement = document.getElementsByClassName('tutorial-screen');*/

	//to delete
	$(".wrapper").hide();

	//loading images
	var Progress = {
		bar: null,
		index: 0,
		imgList: [],
		init: function () {
			var box = document.getElementById("progressBox");
			var prog = document.createElement("progress");
			box.appendChild(prog);
			// console.log('-',prog)
			this.bar = prog;
		},

		loadImages: function (paths) {
			var self = this,
				i,
				length = paths.length;
			// this.bar.max = length;
			for (i = 0; i < length; i++) {
				var img = new Image();
				img.onload = function () {
					self.increase();
					if (self.index >= length) {
						self.done();
					}
				};
				img.src = paths[i];
				this.imgList.push(img);
			}
		},

		increase: function () {
			this.index++;
			var preloaderNUmb = parseInt((100 / imageArr.length) * this.index);
			$(".num").text(preloaderNUmb + "%");
			$(".loading-page hr").css("width", preloaderNUmb + "%");
		},

		done: function () {
			// console.log("I am done loading");
			$(".wrapper-preloader").hide();
			initGame();
		},
	};

	getAllImages();
	Progress.loadImages(imageArr);

	// Function to generate random number
	function randomNumber(min, max) {
		return parseInt(Math.random() * (max - min) + min);
	}

	function getAllImages() {
		for (var i = 0; i <= maxLeaf; i++) {
			imageArr.push(imagesPath + "gold-images/leaf_" + i + ".jpg");
		}
	}

	function initGame() {
		document.querySelectorAll(".auth-tel").forEach((item) => {
			let telMask = IMask(item, {
				mask: "+{7}(000)000-00-00",
			});
		});

		$(".wrapper").fadeIn();
		$(".begin-game").click(function () {
			$(".screen-1").hide();
			$(".screen-2").fadeIn();
			addEventListeners();

			$(".wrapper").on("mouseleave", function () {
				resetTimer();
			});

			$(".screen-photo .btn").click(function () {});

			$(".try-again").click(function () {
				currentLeaf = 0;
				resetTimer();
				changeLeaf();
				$(".game-fail").hide();
				$(".txt-to-hide").show();
				$(".game-start").fadeIn();
				$(".container").hide();
				$(".game-after").hide();
				addEventListeners();
			});

			$(".try-again--secondary").click(function () {
				currentLeaf = 0;
				resetTimer();
				changeLeaf();
				$(".game-fail").hide();
				$(".txt-to-hide").show();
				$(".game-start").fadeIn();
				$(".game-win").hide();
				$(".container").show();
				$(".game-after").hide();
				addEventListeners();
			});
		});
	}

	function addEventListeners() {
		$(".screen-2").bind("mousedown touchstart", function (e) {
			e.preventDefault();
			var tempnum = randomNumber(0, timerArray.length);
			$(".txt-to-hide").fadeOut();
			$(".container").fadeIn();
			resetTimer();
			mouseDown_timer = setInterval(changeLeaf, timerArray[tempnum]);
			removeEventListeners();
			$(".screen-2").bind("mouseup touchend", function () {
				resetTimer();
				showPercentageHeal();
			});
		});
	}

	function removeEventListeners() {
		$(".screen-2").unbind();
	}

	function resetTimer() {
		clearInterval(mouseDown_timer);
	}

	function calculatePercentageHeal() {
		percentageHeal = parseInt((100 / maxLeaf) * currentLeaf);
	}

	function showPercentageHeal() {
		$(".game-start").hide();
		removeEventListeners();
		if (percentageHeal > percentageToWin) {
			$(".game-win").fadeIn();
			$(".container").hide();
			setTimeout(() => {
				$(".game-win").hide();
				$(".game-after").fadeIn();
			}, 3000);
		} else {
			$(".calculated-percentage").html(percentageHeal);
			$(".game-fail").fadeIn();
		}
	}

	function changeLeaf() {
		$(".bg-image img").attr("src", imageArr[currentLeaf]);
		if (currentLeaf < maxLeaf) {
			currentLeaf++;
		}
		calculatePercentageHeal();
		$(".progress-bar").css("width", percentageHeal + "%");
	}
});

$(document).on("click", ".screen-photo .btn", function () {
	$("#scanface").addClass("active");
	$("#scanface").ubeScanpackFace("scanpack-casual-reg", function () {
		$("#scanface").removeClass("active");
		$(".screen-photo").removeClass("active");
		$(".screen-tel").addClass("active");
		$(".screen-tel__form").ubeScanpackLogin("scanpack-casual-reg", function () {});
	});
});

$(document).on("click", ".privacy__close", function () {
	$.ube.hideRules();
});

$(document).ready(function () {
	$(".screen-tel__form").ubeScanpackLogin("scanpack-casual-reg", function (result) {
		if (result === "loginSuccess") {
			console.log(1);
			$(".screen-tel").removeClass("active");
			$(".screen-denied").addClass("active");
		} else if (result === "registered") {
			console.log(2);
			$(".screen-tel").removeClass("active");
			$(".screen-success").addClass("active");
		}
	});
});
