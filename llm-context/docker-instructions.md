# Docker Instructions Reference

This document organizes Docker instructions into logical groups based on their functionality and usage patterns.

## 1. Image Configuration
Instructions that define the base image and overall image configuration:
- `FROM` - Specifies the base image to start building from
- `MAINTAINER` (deprecated) - Specifies the author of the image
- `LABEL` - Adds metadata to an image as key-value pairs
- `SHELL` - Sets the default shell for subsequent instructions
- `STOPSIGNAL` - Specifies the system call signal for stopping a container

## 2. Build Process
Instructions that control the build process and environment:
- `ARG` - Defines build-time variables
- `ENV` - Sets environment variables for both build and runtime
- `WORKDIR` - Sets the working directory for subsequent instructions
- `ONBUILD` - Specifies instructions to execute when the image is used as a base
- `HEALTHCHECK` - Configures how to check container health

## 3. File Operations
Instructions for managing files and directories:
- `COPY` - Copies files and directories from the build context into the image
- `ADD` - Copies files, directories, or remote URLs into the image (with additional features like extraction)
- `VOLUME` - Creates a mount point for external volumes

## 4. Execution Control
Instructions that control how commands are executed:
- `RUN` - Executes commands in a new layer on top of the current image
- `CMD` - Provides default arguments for the `ENTRYPOINT` or command to run when container starts
- `ENTRYPOINT` - Configures a container to run as an executable
- `USER` - Sets the user and group to use when running subsequent commands

## 5. Network Configuration
Instructions related to network settings:
- `EXPOSE` - Informs Docker that the container listens on specified network ports at runtime

## 6. Parser Directives
Special instructions that affect how the Dockerfile is processed:
- `# syntax=` - Specifies the Dockerfile syntax version
- `# escape=` - Sets the escape character
- `# check=` - Configures build checks

## 7. Deprecated/Obsolete
Instructions that are no longer recommended:
- `MAINTAINER` - Use `LABEL` instead for specifying maintainer information

## 8. Multi-stage Builds
Special patterns for multi-stage builds:
- Multiple `FROM` instructions with `AS` aliases
- `COPY --from` to copy files between build stages

## 9. Build Context and Secrets
Instructions for managing build context and sensitive data:
- `--ssh` - Mounts SSH agent sockets for accessing private repositories
- `--secret` - Mounts sensitive data during build without including it in the final image

## 10. Caching and Optimization
Instructions and patterns for optimizing build caching:
- Proper ordering of instructions to maximize cache hits
- Using `.dockerignore` to exclude unnecessary files from the build context
- Multi-stage builds to reduce final image size

## Best Practices
- Keep images small by cleaning up in the same layer where temporary files are created
- Use specific tags for base images (avoid `latest`)
- Sort multi-line arguments alphabetically for easier maintenance
- Use `COPY` instead of `ADD` unless you need the additional features of `ADD`
- Leverage build cache by placing frequently changing instructions at the end of the Dockerfile
