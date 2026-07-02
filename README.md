# Personal website
##Build the Docker image 
Open a terminal window and navigate to the directory where your Dockerfile is located.
Run the following command to build the Docker image:
```
docker build -t my-image .
```

This will build the Docker image and tag it with the name my-image.

Run the Docker container
Once the image is built, you can run the Docker container using the following command:
```
docker run -p 3000:3000 my-image
```

This command will start the Docker container and map port 3000 in the container to port 3000 on your host machine. You can access the web server by visiting http://localhost:3000 in your web browser.

Stop the Docker container
To stop the running container, open a new terminal window and run the following command:

```
docker ps
```

This will list all running containers, along with their container ID, name, and status.

Identify the container ID or name of the running container you want to stop.

Once you have the container ID or name, run the following command to stop the container:

```
docker stop container-id-or-name
```

For example, if your container ID is abc123, you can stop the container by running:

```
docker stop abc123
```

This will gracefully stop the container and shut down the web server.