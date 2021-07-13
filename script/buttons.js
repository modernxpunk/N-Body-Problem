document.querySelector('.timePlus').addEventListener('click', () => {
	randomGalaxy.setTime(randomGalaxy.getTime() + 1e5)
})


document.querySelector('.timeMinus').addEventListener('click', () => {
	randomGalaxy.setTime(randomGalaxy.getTime() - 1e5)
})


let lastTime = null
let pause = true
const buttonPause = document.querySelector('.pause')
const imageInButtonPause = buttonPause.querySelector('img')

buttonPause.addEventListener('click', () => {
	if (pause) {
		lastTime = randomGalaxy.getTime()
		randomGalaxy.setTime(0)
		imageInButtonPause.src = "img/resume.svg"
	} else {
		randomGalaxy.setTime(lastTime)
		imageInButtonPause.src = "img/pause.svg"
	}
	pause = !pause
})


let canvas = true
let cont = true
document.querySelector('.createCanvas').addEventListener('click', () => {
	if (canvas) {
		let tmp = randomGalaxy.play().canvasInit(create('canvas'), b.offsetWidth, b.offsetHeight).canvasPosition()
		if (cont) {
			cont = false
			tmp.canvasGenerate(150).canvasAnimate(10)
		} else {
			tmp.canvasPosition().canvasAnimate(10)
		}
	} else {
		randomGalaxy.play().position(create('div', 'wrapper')).generate(50).animate(55)
	}
	canvas = !canvas
})