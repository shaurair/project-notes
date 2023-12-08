## Catalog

## 🔖 Catalog
* [Main Features](#main-features)
* [Backend Architecture](#Backend-Architecture)

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

# Database Entiry Relationship Diagram
<img src='https://github.com/shaurair/project-notes/blob/main/doc/ErdColorCut.png' width=90%>

