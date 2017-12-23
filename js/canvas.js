window.onload = function () {
    paper.setup('paperCanvas');
    paper.install(window)


    var sides = 50
    var radius = view.viewSize.height/2 -10;
    var angleStep = Math.PI*2 / sides
    var center = new Point(view.center.x, view.center.y)
    var dots = []

    var rect = new Path.Rectangle({
        x:0,
        y:0,
        width:view.viewSize.width,
        height:view.viewSize.height,
        fillColor: 'black'
    });

    var circle = new Path.Circle({
        center: view.center,
        radius: radius,
        strokeColor: "hsl(100,100%,50%)"
    })

    
    for(var i = 0; i<sides; i++) {
        dots.push(
            new Path.Circle({
                center:[
                    center.x + Math.cos(i * angleStep) * radius,
                    center.y + Math.sin(i * angleStep) * radius
                ],
                radius: 2,
                fillColor: 'white'
            })
        )
    }

   



    view.onResize = function (event) {
        circle.position = view.center;
    }



}
