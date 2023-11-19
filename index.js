// Global variables
let sun
let planets = []
let stars = []
let orbitTracks = []
let scaleFactor = 1.0 // Initial scale factor
let isScrolling = false // Flag to check if scrolling is happening

// Setup function
function setup() {
  // Set styles to hide scrollbars and set margin
  document.body.style.overflowX = 'hidden'
  document.body.style.overflowY = 'hidden'
  document.body.style.margin = '0'

  // Create a full-window canvas
  createCanvas(windowWidth, windowHeight)
  sun = createVector(width / 2, height / 2)

  // Create planets with adjusted sizes and distances
  planets.push(new Planet(3, 0.006, 25, 'Mercury')) // Mercury
  planets.push(new Planet(6, 0.003, 50, 'Venus')) // Venus
  planets.push(new Planet(8, 0.002, 75, 'Earth')) // Earth
  planets.push(new Planet(4, 0.0015, 100, 'Mars')) // Mars
  planets.push(new Planet(20, 0.0006, 150, 'Jupiter')) // Jupiter
  planets.push(new Planet(16, 0.0003, 200, 'Saturn')) // Saturn
  planets.push(new Planet(14, 0.0002, 250, 'Uranus')) // Uranus
  planets.push(new Planet(12, 0.0001, 300, 'Neptune')) // Neptune
  planets.push(new Planet(6, 0.00005, 350, 'Pluto')) // Pluto

  // Create stars in the background
  for (let i = 0; i < 500; i++) {
    stars.push(createVector(random(width), random(height)))
  }

  // Initialize orbit tracks
  for (let i = 0; i < planets.length; i++) {
    orbitTracks.push([])
  }
}

// Draw function
function draw() {
  background(0)

  // Display stars
  fill(255)
  noStroke()
  for (let star of stars) {
    ellipse(star.x, star.y, 1, 1)
  }

  // Display sun
  fill(255, 255, 0)
  let sunSize = 60 * scaleFactor // Adjusted size of the sun
  ellipse(sun.x, sun.y, sunSize, sunSize)

  // Update and display planets and elliptical orbit tracks
  for (let i = 0; i < planets.length; i++) {
    let planet = planets[i]
    let scaledRadius = planet.radius * (sunSize / 40) // Scale the planet radius
    let scaledDistance = planet.distance * (sunSize / 40) // Scale the planet distance

    // Update planet position
    planet.update(scaledDistance)
    planet.display(scaledRadius)

    // Update and display elliptical orbit track
    if (isScrolling) {
      orbitTracks[i] = [] // Reset the path when scrolling starts
    }

    let trackPosition = createVector(
      sun.x + scaledDistance * cos(planet.angle),
      sun.y + scaledDistance * sin(planet.angle)
    )
    orbitTracks[i].push(trackPosition)

    // Draw elliptical orbit track
    stroke(255, 150) // White with transparency
    noFill()
    beginShape()
    for (let point of orbitTracks[i]) {
      vertex(point.x, point.y)
    }
    endShape()
  }

  // Display UI heading
  fill(255)
  textAlign(CENTER)
  textSize(24)
  text('Cosmic Explorer', width / 2, 30)
}

// Mouse wheel function
function mouseWheel(event) {
  // Adjust the scale factor based on the scroll direction
  scaleFactor += event.delta * 0.001
  // Limit the scale factor to a reasonable range
  scaleFactor = constrain(scaleFactor, 0.5, 2.0)

  // Set the scrolling flag to true
  isScrolling = true

  // Use a setTimeout to reset the scrolling flag after a short delay
  setTimeout(() => {
    isScrolling = false
  }, 100)
}

// Planet class
class Planet {
  constructor(diameter, speed, distance, label) {
    this.radius = diameter / 2
    this.speed = speed
    this.distance = distance
    this.angle = random(TWO_PI)
    this.position = createVector(0, 0)
    this.label = label
  }

  update(scaledDistance) {
    this.angle += this.speed
    this.position.x = sun.x + scaledDistance * cos(this.angle)
    this.position.y = sun.y + scaledDistance * sin(this.angle)
  }

  display(scaledRadius) {
    // Draw planet
    fill(100, 150, 255)
    ellipse(
      this.position.x,
      this.position.y,
      scaledRadius * 2,
      scaledRadius * 2
    )

    // Draw label
    fill(255)
    textAlign(CENTER, CENTER)
    textSize(12)
    text(this.label, this.position.x, this.position.y - scaledRadius - 10)
  }
}

// Resize canvas when the window is resized
function windowResized() {
  resizeCanvas(windowWidth, windowHeight)
}

// Touch-related variables
let touchesStart = []
let touchesMoved = []
let cumulativeScaleFactor = 1.0

// Touch start event
function touchStarted() {
  touchesStart = touches.map((touch) => ({ x: touch.x, y: touch.y }))
  touchesMoved = [...touchesStart]
  return false // Prevent default
}

// Touch move event for pinch-to-zoom
function touchMoved() {
  if (touches.length === 2) {
    // Calculate the initial and current distance between the two touches
    const dStart = dist(
      touchesStart[0].x,
      touchesStart[0].y,
      touchesStart[1].x,
      touchesStart[1].y
    )
    const dMoved = dist(
      touchesMoved[0].x,
      touchesMoved[0].y,
      touchesMoved[1].x,
      touchesMoved[1].y
    )

    // Calculate the scale factor based on the ratio of initial and current distances
    const scaleFactorDelta = dMoved / dStart

    // Update the cumulative scale factor
    cumulativeScaleFactor *= scaleFactorDelta

    // Ensure the scale factor stays within a reasonable range
    cumulativeScaleFactor = constrain(cumulativeScaleFactor, 0.5, 2.0)

    // Set the scrolling flag to true
    isScrolling = true

    // Use a setTimeout to reset the scrolling flag after a short delay
    setTimeout(() => {
      isScrolling = false
    }, 100)

    // Update the initial touch positions for the next iteration
    touchesMoved = touches.map((touch) => ({ x: touch.x, y: touch.y }))

    return false // Prevent default
  }
}
