<h1 style="font-weight: bold;">carousel</h1>

<h2>This is a simple util to make you langing pages more beautiful.</h2>

<h3>Usage sample:</h3>
```javascript
CarouselInit(selector, {
  directions: [
    'left',
    'down',
    'right',
    'down'
  ],
  easing: Math.sin,
  circle: true,
  time: 500
 });
 // selector - your html block element
 // direction[optional] - array with directions for animation(by default will produced array with 'down' options)
 // easing[optional] - function that return value in [0, 1] interval
 // tile[optional] - time for animation(change slides)
 // circle[option] - allow to move slides in circle(default is false)
```

<h3>Change Log:</h3>

<ul>
  <li>
    version 1.1.0 (18.02.17)
    <br />
    <ul>
      <li>allow to move slides in circle</li>
    </ul>
  </li>
  <li>
    version 1.0.0 (13.02.17)
    <br />
    <ul>
      <li>add main functionality</li>
    </ul>
  </li>
</ul>
