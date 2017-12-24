window.onload = function () {
    paper.setup('paperCanvas');
    paper.install(window)

    var sides = 400
    var multiplier = 3

    var background = createBackground()
    var circle = createCircle()
    var dots = createDots()
    var lines = createLines()
 
    function getRadius() {
        return Math.min(view.viewSize.height / 2, view.viewSize.width / 2) - 10;
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
        var dots = []
        for (var i = 0; i < sides; i++) {
            dots.push(
                new Path.Circle({
                    center: [
                        view.center.x + Math.cos(i * getAngleStep()) * getRadius(),
                        view.center.y + Math.sin(i * getAngleStep()) * getRadius()
                    ],
                    radius: 2,
                    fillColor: 'white'
                })
            )
        }
        return dots;
    }

    function createLines() {
        var lines = []
        for (var i = 0; i < sides; i++) {
            var current = dots[i];
            var target = dots[Math.floor((i * multiplier) % sides)]
            lines.push(
                new Path.Line({
                    from: [current.position.x, current.position.y],
                    to: [target.position.x, target.position.y],
                    strokeColor: "hsl("+scaleLengthToHSL(calculateDistance(
                        current.position.x, current.position.y,
                        target.position.x, target.position.y
                    ))+",100%,50%)"
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
        circle.scale(getRadius() / (circle.bounds.width/2))
        for (var i = 0; i < sides; i++) {
            dots[i].position = [
                view.center.x + Math.cos(i * getAngleStep()) * getRadius(),
                view.center.y + Math.sin(i * getAngleStep()) * getRadius()
            ]
        }
    }

    function repositionLines() {
        for (var i = 0; i < sides; i++) {
            var current = dots[i];
            var target = dots[Math.floor((i * multiplier) % sides)]
            lines[i].segments[0].point.x = current.position.x
            lines[i].segments[0].point.y = current.position.y
            lines[i].segments[1].point.x = target.position.x
            lines[i].segments[1].point.y = target.position.y
        }
    }

    function calculateDistance(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x1-x2, 2) + Math.pow(y1-y2,2))
    }

    function scaleLengthToHSL(length) {
        return length*360 / (getRadius()*2)
    }

    view.onResize = function (event) {
        resizeBackground()
        centerCircle()
        repositionLines()
    }

    view.onFrame = function(event) {
        
    }



}
