# Rescue Orion

This folder contains the source code for automated online Rescue Orion. There are two parts: `client/` and `server/`. They two directories are not linked together. They are to be configured and deployed separately.


## Environment Setup

There are some packages that need to be installed in for compiling, running, and testing the app (common for both client and server):
- [node](https://nodejs.org/en/download/) v8 or later
- [yarn](https://classic.yarnpkg.com/en/docs/install/#debian-stable)

This project relies heavily on web sockets, so be sure to install it in an environment where sockets are supported.

## Application Specific Stuff

Please refer to the two README.md files in `client/` and `server/` that are specific for the two applications.

## Ownership

The game concept is designed, developed, and owned by Eagle's Flight. They have the exclusive rights to its commercial usage. The implementation of the game is initially coded up by USC CSCI401 Fall 2020 semester Team 5 (Zhehao Lu, Tongyu Zhu, Chen Tang, and Yiqian Yang). The Experiential Learning Center (ELC) at USC Marshall School of Business is shared a copy at the end of the Fall 2020 semester for training and educational purposes. Both Eagle's Flight and ELC have the choice to continue development on top of the current project.
