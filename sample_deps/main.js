var a = document.createElement('a');
a.href = location.href;

var easing = null;
if (a.hash) {
    easing = EasingFunctions[a.hash.replace('#', '')] || null;
}

CarouselInit('.carousel-main-container', {
    directions: [
        'left',
        'down',
        'right',
        'down'
    ],
    easing: easing,
    time: 500
});

hljs.highlightBlock(document.getElementById('js_sample'));
hljs.highlightBlock(document.getElementById('easing'));

function onClick() {
    location.hash = this.hash.replace('#', '');
    location.reload(true);
}

var links = document.getElementsByClassName("easing");
for (var i = 0; i < links.length; i++) {
    if (document.addEventListener) {
        links[i].addEventListener('click', onClick, false);
    } else {
        links[i].attachEvent('click', onClick);
    }
}