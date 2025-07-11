# You can use most Debian-based base images
FROM node:21-slim

# Install necessary system packages
# Update package list, install curl, then clean up apt cache to keep image size small
RUN apt-get update && apt-get install -y curl && apt-get clean && rm -rf /var/lib/apt/lists/*

# Copy the compile script into the container's root directory
COPY compile_page.sh /compile_page.sh
# Make the compile script executable
RUN chmod +x /compile_page.sh

# Install JavaScript dependencies and customize the application sandbox
# Set the working directory for subsequent instructions
WORKDIR /home/user/nextjs-app

# Create a new Next.js application in the current working directory
RUN npx --yes create-next-app@15.3.2 . --yes

# Initialize shadcn/ui for the Next.js project with a neutral theme, forcing overwrite of existing config
RUN npx --yes shadcn@latest init --yes -b neutral --force
# Add all available shadcn/ui components to the project
RUN npx --yes shadcn@latest add --all --yes

# Move the Next.js app contents from the temporary nextjs-app directory to the user's home directory
# Then, remove the now empty nextjs-app directory
RUN mv /home/user/nextjs-app/* /home/user/ && rm -rf /home/user/nextjs-app
