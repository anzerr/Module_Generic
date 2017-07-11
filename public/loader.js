(function() {
	// shim layer with setTimeout fallback
	window.requestAnimFrame = (function(){
		return  window.requestAnimationFrame       ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame    ||
			function(callback) {
				window.setTimeout(callback, 1000 / 60);
			};
	})();
	var ctx = null, canvas = null, close = false, closing = false;
	var now = null, frame = 0, resize = function() {
		canvas.width = canvas.scrollWidth;
		canvas.height = canvas.scrollHeight;
	};

	loader = {
		close: function() {
			closing = true;
			frame = 0;
			setTimeout(function() {
				window.removeEventListener('resize', resize);
				close = true;
			}, 1000);
		}
	};

	var loop = function() {
		if (ctx) {
			if (!now) {
				now = new Date().getTime();
			}
			var time = new Date().getTime(), delta = (time - now) / (1000 / 60), i = frame % 200;
			now = time;
			frame += delta;


			var max = Math.min(canvas.width, canvas.height);
			if (!closing) {
				ctx.globalAlpha = 0.1;

				ctx.fillStyle = 'black';
				ctx.fillRect(0, 0, canvas.width, canvas.height);

				var pi = (i / 50) * Math.PI, size = ((Math.sin(frame / 20) * 0.25) + 0.5) * Math.PI;
				ctx.beginPath();
				ctx.arc(canvas.width / 2, canvas.height / 2, max / 10, pi - size, pi + size);
				ctx.strokeStyle = 'hsl(' + (360 - (Math.sin(frame / 100) * 180)) + ', 100%, 50%)';
				ctx.lineWidth = 3;
				ctx.stroke();
			} else {
				ctx.globalAlpha = 1;
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				ctx.fillStyle = 'rgba(0, 0, 0, ' + (1 - (Math.min(frame, 50) / 50)) + ')';
				ctx.fillRect(0, 0, canvas.width, canvas.height);
			}
		} else {
			canvas = document.getElementById('canvasLoader');
			if (canvas) {
				ctx = canvas.getContext('2d');
				canvas.width = canvas.scrollWidth;
				canvas.height = canvas.scrollHeight;
				window.addEventListener('resize', resize);
			}
		}

		if (!close) {
			requestAnimFrame(loop);
		}
	};
	loop();
})();