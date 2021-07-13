class Galaxy {
	constructor(params) {
		this.g = params.g
		this.dt = params.dt
		this.softeningConstant = params.softeningConstant
		this.masses = params.masses
	}

	updatePosition() {
		for (let i = 0; i < this.masses.length; i++) {
			const mass = this.masses[i]
			mass.x += mass.vx * this.dt
			mass.y += mass.vy * this.dt
			mass.z += mass.vz * this.dt
		}
		return this
	}

	updateVelocity() {
		for (let i = 0; i < this.masses.length; i++) {
			const mass = this.masses[i]
			mass.vx += mass.ax * this.dt
			mass.vy += mass.ay * this.dt
			mass.vz += mass.az * this.dt
		}
	}

	updateAcceleration() {
		for (let i = 0; i < this.masses.length; i++) {
			let ax = 0
			let ay = 0
			let az = 0

			let massI = this.masses[i]

			for (let j = 0; j < this.masses.length; j++) {
				if (i !== j) {
					const massJ = this.masses[j]
					const dx = massJ.x - massI.x
					const dy = massJ.y - massI.y
					const dz = massJ.z - massI.z
					const d = dx ** 2 + dy ** 2 + dz ** 2

					const f = (this.g * massJ.m) / (d * Math.sqrt(d + this.softeningConstant))

					ax += dx * f;
					ay += dy * f;
					az += dz * f;
				}
			}
			massI.ax = ax;
			massI.ay = ay;
			massI.az = az;
		}
		return this
	}


	position(node) {
		this.node = node

		this.widthNode = this.node.offsetWidth
		this.heightNode = this.node.offsetHeight

		this.topEdge = this.heightNode / 3
		this.leftEdge = this.widthNode / 3

		this.rightEdge = 2 * this.widthNode / 3
		this.bottomEdge = 2 * this.heightNode / 3

		this.closer = 1
		this.further = 10

		return this
	}

	random(min, max) {
		return Math.round(min + Math.random() * (max - min))
	}

	addRandomPoint(
			m0=1, m1=100, 
			x0=this.topEdge, x1=this.bottomEdge,
			y0=this.leftEdge, y1=this.rightEdge, 
			z0=this.closer, z1=this.further, 
			v0=-1e-6, v1=1e-4
		) {
		return {
			m:  this.random(m0, m1),
			x:  this.random(x0, x1),
			y:  this.random(y0, y1),
			z:  this.random(z0, z1),
			vx: this.random(v0, v1),
			vy: this.random(v0, v1),
			vz: this.random(v0, v1)
		}
	}

	createPoint(element, nameClass) {
		const block = document.createElement(element)
		block.className = nameClass
		return block
	}

	getRandomColor() {
		return `rgb(${this.random(0,255)}, ${this.random(0,255)}, ${this.random(0,255)})`
	}

	generate(n) {
		for (let i = 0; i < n; i++) {
			const point = this.createPoint('div', 'point')
			const randomColor = this.getRandomColor()

			point.style.backgroundColor = randomColor
			point.style.boxShadow = `0px 0px 10px 1px ${randomColor}`

			this.node.append(point)
			this.masses.push(this.addRandomPoint())
		}
		return this
	}

	getMasses() {
		return this.masses
	}

	animate(ms) {
		this.points = document.querySelectorAll('.point')
		this.startAnimate = setInterval(() => {
			for (let i = 0; i < this.points.length; i++) {
				const mass = this.masses[i]
				const point = this.points[i]

				point.style.top = mass.x + "px"
				point.style.left = mass.y + "px"

				point.style.width = point.style.height = (this.further - mass.z) / 20 + "px"

				point.style.zIndex = (this.further - mass.z)
				//point.style.filter = `brightness(${mass.z / 2}%) blur(${mass.z}px)`

			}
			this.updatePosition().updateAcceleration().updateVelocity()
		}, ms)
	}

	canvasPosition() {
		this.widthNode = this.node.width
		this.heightNode = this.node.height

		this.topEdge = this.heightNode / 3
		this.leftEdge = this.widthNode / 3

		this.rightEdge = 2 * this.widthNode / 3
		this.bottomEdge = 2 * this.heightNode / 3

		this.closer = 1
		this.further = 100

		return this
	}

	canvasInit(node, w, h) {
		this.node = node

		this.node.width = w
		this.node.height = h


		this.ctx = this.node.getContext('2d')

		this.canvasWidth = this.node.offsetWidth
		this.canvasHeight = this.node.offsetHeight

		return this
	}

	circle(left, top, diameter, color){
		this.ctx.beginPath()

		this.ctx.arc(left, top, Math.abs(diameter), 0, 2 * Math.PI, false)

		this.ctx.fillStyle = color
		this.ctx.fill()

		this.ctx.lineWidth = 1
		this.ctx.strokeStyle = color

		this.ctx.stroke()
	}

	clear() {
		this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
	}

	canvasGenerate(n) {
		for (let i = 0; i < n; i++) {
			const point = this.addRandomPoint()
			point.color = this.getRandomColor()
			this.masses.push(point)
		}
		return this
	}

	canvasAnimate(ms) {
		this.startAnimate = setInterval(() => {
			setTimeout(() => {
				for (let i = 0; i < this.masses.length; i++) {
					const mass = this.masses[i]
					this.circle(mass.y, mass.x, mass.z / 50, mass.color)
				}
				this.updatePosition().updateAcceleration().updateVelocity()
			}, ms)
			this.clear()
		}, ms)
	}


	setTime(n) {
		this.dt = n
	}

	getTime(n) {
		return this.dt
	}

	play() {
		this.node.remove()
		clearInterval(this.startAnimate)
		return this
	}
}

const b = document.body
const create = (el, nameClass, id) => {
	const block = document.createElement(el)
	block.className = nameClass
	b.prepend(block)
	return block
}


const g = 10e-14
const dt = 4e5
const softeningConstant = 0.001
const masses = []
const randomGalaxy = new Galaxy({ g, dt, softeningConstant, masses })

randomGalaxy.position(create('div', 'wrapper')).generate(50).animate(55)