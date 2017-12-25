window.onload = function () {

    var linesSlider = $("#linesInput")[0];
    var multiplierSlider = $("#multiplierInput")[0];
    var speedSlider = $("#speedInput")[0];
    var animationToggle = $("#animationInput")[0];

    var linesSliderLabel = $("#linesInputLabel")[0];
    var multiplierSliderLabel = $("#multiplierInputLabel")[0];
    var speedSliderLabel = $("#speedInputLabel")[0];
    var animationToggleLabel = $("#animationInputLabel")[0];


    paper.setup('paperCanvas');
    paper.install(window)

    var sides = 100
    var multiplier = 2
    var speed = 0.005
    var animation = false

    var background = createBackground()
    var circle = createCircle()
    var dots = createDots()
    var lines = createLines()

    function getRadius() {
        return Math.min(view.viewSize.height / 2, view.viewSize.width / 2) - 20;
    }

    function getAngleStep() {
        return Math.PI * 2 / sides
    }

    function createBackground() {
        return new Path.Rectangle({
            x: 0,
            y: 0,
            width: view.viewSize.width,
            height: view.viewSize.height,
            fillColor: 'black'
        });
    }

    function createCircle() {
        return new Path.Circle({
            center: view.center,
            radius: getRadius(),
            strokeColor: 'white'
        })
    }

    function createDots() {
        var dots = new Group()
        for (var i = 0; i < sides; i++) {
            dots.addChild(
                new Path.Circle({
                    center: [
                        view.center.x + Math.cos(i * getAngleStep()) * getRadius(),
                        view.center.y + Math.sin(i * getAngleStep()) * getRadius()
                    ],
                    radius: 1,
                    fillColor: 'white'
                })
            )
        }
        return dots;
    }

    function createLines() {
        var lines = new Group()
        for (var i = 0; i < sides; i++) {
            var current = dots.children[i];
            var target = dots.children[Math.floor((i * multiplier) % sides)]
            lines.addChild(
                new Path.Line({
                    from: [current.position.x, current.position.y],
                    to: [target.position.x, target.position.y],
                    strokeColor: "hsl(" + scaleLengthToHSL(calculateDistance(
                        current.position.x, current.position.y,
                        target.position.x, target.position.y
                    )) + ",100%,50%)"
                })
            )
        }
        return lines;
    }

    function resizeBackground() {
        var horScale = view.viewSize.width / background.bounds.width;
        var verScale = view.viewSize.height / background.bounds.height;
        background.scale(horScale, verScale, background.bounds.topLeft)
    }

    function centerCircle() {
        circle.position = view.center;
        circle.scale(getRadius() / (circle.bounds.width / 2))
        for (var i = 0; i < sides; i++) {
            dots.children[i].position = [
                view.center.x + Math.cos(i * getAngleStep()) * getRadius(),
                view.center.y + Math.sin(i * getAngleStep()) * getRadius()
            ]
        }
    }

    function repositionLines() {
        for (var i = 0; i < sides; i++) {
            var current = dots.children[i];
            var target = dots.children[Math.floor((i * multiplier) % sides)]
            lines.children[i].segments[0].point.x = current.position.x
            lines.children[i].segments[0].point.y = current.position.y
            lines.children[i].segments[1].point.x = target.position.x
            lines.children[i].segments[1].point.y = target.position.y
        }
    }

    function calculateDistance(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))
    }

    function scaleLengthToHSL(length) {
        return length * 360 / (getRadius() * 2)
    }

    view.onResize = function (event) {
        resizeBackground()
        centerCircle()
        repositionLines()
    }

    view.onFrame = function (event) {
        animation ? animate(): null
       

    }
    function animate() {
        multiplier = (multiplier + speed)%sides ;
        multiplierSlider.MaterialSlider.change(multiplier)
        repositionLines()
        multiplierSliderLabel.innerHTML = "Multiplier: " + multiplier.toFixed(3);
    }

    function loadNewDots(event) {
        dots.remove()
        lines.remove()
        dots = createDots()
        lines = createLines()
    }

    linesSlider.onchange = function (event) {
        sides = Math.floor(parseFloat(this.value))
        loadNewDots()
        multiplierSlider.max = sides
        multiplierSlider.MaterialSlider.change(multiplier)
        linesSliderLabel.innerHTML = "Lines: " + sides
    }
    multiplierSlider.onchange = function (event) {
        multiplier = Math.floor(parseFloat(this.value))
        loadNewDots()
        multiplierSliderLabel.innerHTML = "Multiplier: " + multiplier;
    }
    speedSlider.onchange = function (event) {
        speed = parseFloat(this.value)
        speedSliderLabel.innerHTML = "Speed: " + speed
    }
    animationToggle.onchange = function (event) {
        animation = animationToggle.checked
    }

}
