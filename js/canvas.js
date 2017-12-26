window.onload = function () {

    var linesSlider = $("#linesInput");
    var multiplierSlider = $("#multiplierInput");
    var speedSlider = $("#speedInput");
    var animationToggle = $("#animationInput");
    var colorRadios = $("input[name=colorOptions]");

    var linesSliderLabel = $("#linesInputLabel");
    var multiplierSliderLabel = $("#multiplierInputLabel");
    var speedSliderLabel = $("#speedInputLabel");

    paper.setup('paperCanvas');
    paper.install(window)

    var sides = 100
    var multiplier = 2
    var speed = 0.005
    var animation = false
    var colorMode = 1 // 1 = Plain, 2 = Length to Color, 3 = Length to Opacity

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
                    strokeColor: getColor(calculateLength(
                        current.position.x, current.position.y,
                        target.position.x, target.position.y))
                })
            )
        }
        return lines;
    }

    function getColor(length) {
        switch(colorMode) {
            case 1:
                return 'white'
                break
            case 2:
                return 'hsl('+scaleLengthToHSL(length)+', 100%, 50%)'
                break
            case 3:
                return new Color(1,1,1,1-scaleLengthToOpacity(length))
                break
        }
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

    function recolorLines() {
        for (var i = 0; i< sides; i++) {
            lines.children[i].strokeColor = getColor(calculateLength(
                lines.children[i].segments[0].point.x,
                lines.children[i].segments[0].point.y,
                lines.children[i].segments[1].point.x,
                lines.children[i].segments[1].point.y
            ))
        }
    }

    function calculateLength(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))
    }

    function scaleLengthToHSL(length) {
        return length * 360 / (getRadius() * 2)
    }
    function scaleLengthToOpacity(length) {
        return length / (getRadius() * 2)
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
        multiplierSlider[0].MaterialSlider.change(multiplier)
        multiplierSliderLabel.html("Multiplier: " + multiplier.toFixed(3));
        repositionLines()
    }

    function loadNewDots(event) {
        dots.remove()
        lines.remove()
        dots = createDots()
        lines = createLines()
    }

    linesSlider.change(function () {
        sides = Math.floor(parseFloat(this.value))
        multiplierSlider[0].max = sides
        multiplierSlider[0].MaterialSlider.change(multiplier)
        linesSliderLabel.html("Lines: " + sides)
        loadNewDots()
    })
    multiplierSlider.change(function () {
        multiplier = Math.floor(parseFloat(this.value))
        multiplierSliderLabel.html("Multiplier: " + multiplier);
        loadNewDots()
    })

    speedSlider.change(function () {
        speed = parseFloat(this.value)
        speedSliderLabel.html("Speed: " + speed) 
    })

    animationToggle.change(function() {
        animation = this.checked
    })

    colorRadios.change(function() {
        colorMode = parseInt(this.value)
        recolorLines()
    })

}
