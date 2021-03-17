//queue 6
		if ((message.content.startsWith("!red") || message.content.startsWith("!green") || message.content.startsWith("!orange")) && processing === true && q5locked === true) {
			q6locked = true; console.log("q6 locked")
			console.log('Message: ' + message.content + ' is about to go into the queue 6 waiting loop. Processing var was ' + processing)
			do {
				console.log('One loop in queue 6')
				await delay(1000)
			} while (q5locked === true && processing === true)
			await delay(200)
			q6locked = false; console.log("q6 unlocked")
		}

		console.log(message.content + 'has just passed between q6 and q5')

		//queue 5
		if ((message.content.startsWith("!red") || message.content.startsWith("!green") || message.content.startsWith("!orange")) && processing === true && q4locked === true) {
			q5locked = true; console.log("q5 locked")
			console.log('Message: ' + message.content + ' is about to go into the queue 5 waiting loop. Processing var was ' + processing)
			do {
				console.log('One loop in queue 5')
				await delay(1000)
			} while (q4locked === true && processing === true)
			await delay(200)
			q5locked = false; console.log("q5 unlocked")
		}

		console.log(message.content + 'has just passed between q5 and q4')

		//queue 4
		if ((message.content.startsWith("!red") || message.content.startsWith("!green") || message.content.startsWith("!orange")) && processing === true && q3locked === true) {
			q4locked = true; console.log("q4 locked")
			console.log('Message: ' + message.content + ' is about to go into the queue 4 waiting loop. Processing var was ' + processing)
			do {
				console.log('One loop in queue 4')
				await delay(1000)
			} while (q3locked === true && processing === true)
			await delay(200)
			q4locked = false; console.log("q4 unlocked")
		}

		console.log(message.content + 'has just passed between q4 and q3')

		//queue 3
		if ((message.content.startsWith("!red") || message.content.startsWith("!green") || message.content.startsWith("!orange")) && processing === true && q2locked === true) {
			q3locked = true; console.log("q3 locked")
			console.log('Message: ' + message.content + ' is about to go into the queue 3 waiting loop. Processing var was ' + processing)
			do {
				console.log('One loop in queue 3')
				await delay(1000)
			} while (q2locked === true && processing === true)
			await delay(200)
			q3locked = false; console.log("q3 unlocked")
		}

		console.log(message.content + 'has just passed between q3 and q2')

		//queue 2
		if ((message.content.startsWith("!red") || message.content.startsWith("!green") || message.content.startsWith("!orange")) && processing === true && q1locked === true) {
			q2locked = true; console.log("q2 locked")
			console.log('Message: ' + message.content + ' is about to go into the queue 2 waiting loop. Processing var was ' + processing)
			do {
				console.log('One loop in queue 2')
				await delay(1000)
			} while (q1locked === true && processing === true)
			await delay(200)
			q2locked = false; console.log("q2 unlocked")
		}

		console.log(message.content + 'has just passed between q2 and q1')

		//queue 1
		if ((message.content.startsWith("!red") || message.content.startsWith("!green") || message.content.startsWith("!orange")) && processing === true && q0locked === true) {
			q1locked = true; console.log("q1 locked")
			console.log('Message: ' + message.content + ' is about to go into the queue 1 waiting loop. Processing var was ' + processing)
			do {
				console.log('One loop in queue 1')
				await delay(1000)
			} while (q0locked === true && processing === true)
			await delay(200)
			q1locked = false; console.log("q1 unlocked")
		}

		console.log(message.content + 'has just passed between q1 and q0')

