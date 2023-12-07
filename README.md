# Backend Architecture
<img src='https://github.com/shaurair/project-notes/blob/main/doc/BackendArchitecture_note.png' width=80%>


- ### a. Users send HTTPS request to NGINX
  -  Users manage projects, join project discussions, upload files, etc.

- ### b. NGINX processes HTTPS and passes to express server and socket server. 

  -  **Express server** checks the requests above, decides control flow and sends response

  -  **Socket server** checks clients' connections and sends messages to update project discussions immediately.

- ### c. Express server connects to database and executes CRUD operations
  - see **Database Entiry Relationship Diagram** below

- ### d. Express server uploads files to AWS S3
  - files of projects or users' profile images

- ### e. Users get files through AWS CDN
  - Users get files from CloudFront to reduce latency

# Database Entiry Relationship Diagram
<img src='https://github.com/shaurair/project-notes/blob/main/doc/ErdColorCut.png' width=90%>

