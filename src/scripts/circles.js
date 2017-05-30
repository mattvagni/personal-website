(function() {

    var doc = document;
    var body = document.body;

    var isShowingCircles = false;

    var heroEl = doc.querySelector('.hero');
    var contactLinkEl = doc.querySelector('.contact');

    var circleOneEl = doc.querySelector('.hero__circle--one');
    var circleTwoEl = doc.querySelector('.hero__circle--two');
    var circleThreeEl = doc.querySelector('.hero__circle--three');
    var circleFourEl = doc.querySelector('.hero__circle--four');

    var bodySizes = body.getBoundingClientRect();
    var contactButtonSizes = contactLinkEl.getBoundingClientRect();

    // Debounce (kindly stolen from https://remysharp.com/2010/07/21/throttling-function-calls)
    function debounce(fn, delay) {
        var timer = null;

        return function () {
            var context = this;
            var args = arguments;
            clearTimeout(timer);
            timer = setTimeout(function () {fn.apply(context, args)}, delay);
        };
    }

    // Update sizes
    function updateSizes() {
        bodySizes = body.getBoundingClientRect();
        contactButtonSizes = contactLinkEl.getBoundingClientRect();
    }

    // Position a circle based on mouse position
    function positionCircleMouseDevices(el, x, y, xFactor, yFactor) {
        // This makes it so that hover over the contact button 'eclipses' the circles.
        var xOffset = Math.round(contactButtonSizes.left + (contactButtonSizes.width / 2));
        var yOffset = Math.round(contactButtonSizes.top + (contactButtonSizes.height / 2));

        var relX = (x - xOffset) * xFactor;
        var relY = (y - yOffset) * yFactor;
        el.style.transform = 'translate3d(' + relX + 'px,' + relY + 'px, 0px)';
    }

    // Position a circle based on device orientation
    function positionCircleMobileDevices(el, x, y, xFactor, yFactor) {
        var relX = x * xFactor;
        var relY = y * yFactor;
        el.style.transform = 'translate3d(' + relX + 'px,' + relY + 'px, 0px)';
    }

    // Shows the circles
    function showCircles() {
        requestAnimationFrame(function() {
            heroEl.classList.add('hero--show-circles');
        });
        isShowingCircles = true;
    }

    // Hide the circles
    function hideCircles() {
        requestAnimationFrame(function() {
            heroEl.classList.remove('hero--show-circles')
        });
        isShowingCircles = false;
    }

    // Mouse move handler
    function onMouseMove(event) {
        var x = event.clientX;
        var y = event.clientY;

        requestAnimationFrame(function() {
            positionCircleMouseDevices(circleOneEl, x, y, -0.3, 0.2);
            positionCircleMouseDevices(circleTwoEl, x, y, -0.9, 0.5);
            positionCircleMouseDevices(circleThreeEl, x, y, 0.2, -0.4);
            positionCircleMouseDevices(circleFourEl, x, y, 1, 2);
        });

        if (!isShowingCircles) {
            showCircles();
        }
    }

    // Device motion event handler
    function onDeviceMotion(event) {
        var y = Math.floor(event.beta);
        var x = Math.floor(event.gamma);

        requestAnimationFrame(function() {
            positionCircleMobileDevices(circleOneEl, x, y, 1, 4);
            positionCircleMobileDevices(circleTwoEl, y, x, 1.5, 1);
            positionCircleMobileDevices(circleThreeEl, x, y, 5, 2.5);
        });
    }

    if (window.DeviceOrientationEvent && 'ontouchstart' in window) {
        showCircles();
        window.addEventListener('deviceorientation', onDeviceMotion);
    } else {
        // Removes linear css transitions to better work with
        // mouse movement vs device orientation.
        doc.querySelector('.hero').classList.remove('hero--device-orientation');

        body.addEventListener('mousemove', onMouseMove);
        body.addEventListener('mouseleave', hideCircles);
        window.addEventListener('resize', debounce(updateSizes, 100));
    }
})();
