#!/bin/bash
# Specifies the interpreter for the script (Bash shell).

# This script runs during building the sandbox template
# and makes sure the Next.js app is (1) running and (2) the `/` page is compiled

# Define a function named ping_server to check if the web server is ready.
function ping_server() {
	counter=0
	# Initialize a counter to keep track of attempts.

	response=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000")
	# Try to get the HTTP status code from http://localhost:3000.
	# -s: Silences curl's progress output.
	# -o /dev/null: Discards the page content.
	# -w "%{http_code}": Prints only the HTTP status code.

	while [[ ${response} -ne 200 ]]; do
	# Loop continues as long as the server does not return a 200 (OK) status.
			let counter++
			# Increase the counter for each check.

			if  (( counter % 20 == 0 )); then
								# Every 20 attempts, print a message to the console.
								echo "Waiting for server to start..."
								# Inform the user that the script is waiting.
								sleep 0.1
								# Pause for a short moment before checking again.
						fi

			response=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000")
			# Check the server's status again inside the loop.
	done
	# The loop stops once the server returns a 200 OK status.
}

ping_server &
# Run the ping_server function in the background.
# This allows the script to continue to the next command immediately.

cd /home/user && npx next dev --turbopack
# Change the current directory to /home/user.
# Then, start the Next.js development server using npx, with the --turbopack option for faster builds.
