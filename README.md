## Gihub Issues Kanban Board

Built kanban board to manage the github issues from github repository url
This project was built with Create React App, Typescript, Dnd Kit[https://github.com/clauderic/dnd-kit].

## Requirements[https://noteplan.co/n/DCE673A3-AB38-4827-9CE6-60C7858D6EF7]

## Deveopment

Please run `npm start` in the root of the project after installing npm modules.

## Deployment

Deployed to the vercel[https://github-kanban.vercel.app/].

## Overview

- You can input github repo url and click `Load issues` button to load issues that is only open state.
- Added validation for github url only.
- After loading issues, they are sorted according to according the opened date.
- All States and Data are managed in the repo-context.
- Added DnD with DnD Kit library.
- It stores the status of repo issues in the browser local storage, so that it persist after reloading.
- It's loading stored and unique repo status when you input github url and reload.
