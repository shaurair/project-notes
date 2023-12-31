# Project Notes
- Website URL: https://projects.shaurair.online/
- Test account / password: test@test.com / test123

## Catalog
* [Main Feature](#Main-Feature)
* [Backend Architecture](#Backend-Architecture)
* [Database Entiry Relationship Diagram](#Database-Entiry-Relationship-Diagram)
* [Technique Summary](#Technique-Summary)

## Main Feature
- Track, update, create, comment, and upload files for projects
- Search for specific project using keyword
- Notifications of project deadline and someone's reply
- Real-time discussions about projects
- Privately record personal note for each project
- Manage personal profile, create teams and manage team members
- Restricted project access to owners, reviewers, creators, and relevant team members

### Feature showcase
- **Projects / personal notes management**
<img src='https://github.com/shaurair/project-notes/blob/main/public/images/demo.gif' width=60%>

- **Web notification**
<img src='https://github.com/shaurair/project-notes/blob/main/doc/Web-notification.png' width=60%>

- **Real-time discussion**
<img src='https://github.com/shaurair/project-notes/blob/main/doc/real-time-discussion.gif' width=60%>

- **File management**
<img src='https://github.com/shaurair/project-notes/blob/main/doc/upload-file.gif' width=60%>

- **Create / search project**
<img src='https://github.com/shaurair/project-notes/blob/main/doc/create-search.gif' width=60%>

- **Team management**
<img src='https://github.com/shaurair/project-notes/blob/main/doc/team.gif' width=60%>

- **Permission management**
<img src='https://github.com/shaurair/project-notes/blob/main/doc/permission_2.gif' width=60%>

## Backend Architecture
<img src='https://github.com/shaurair/project-notes/blob/main/doc/BackendArchitecture_note.png' width=80%>


- ### a. Users send HTTPS requests to NGINX
  -  Users manage projects, join project discussions, upload files, etc.

- ### b. NGINX processes HTTPS and passes to express server and socket.io server. 

  -  Express server handles request processing and response generation.

  -  Socket.io server manages clients' connections and facilitates real-time update for project discussions.

- ### c. Express server connects to database and executes CRUD operations
  - Member information, project details (contents, comments, files), and notifications

- ### d. Express server uploads files to AWS S3
  - Files upload for projects or users' profile images

- ### e. Users get files through AWS CDN
  - Users download files from AWS CDN to reduce latency

## Database Entiry Relationship Diagram
- Database structure follows normalization rules.
<img src='https://github.com/shaurair/project-notes/blob/main/doc/ErdColorCut.png' width=80%>

## Technique Summary
### Front-end
- HTML
- CSS
- Javascript
### Back-end
- Express (Node.js)
- RESTful API
- Socket.IO
- Unit test (Jest)
### Database
- MySQL
### Infrastructure
- DNS
- SSL
- NGINX
- AWS EC2
- AWS S3 + CloudFront
- AWS RDS (MySQL)
