# Backend Architecture
<img src='https://github.com/shaurair/project-notes/blob/main/doc/BackendArchitecture_note.png' width=80%>


- a. Users send HTTPS request to NGINX

- b. NGINX processes HTTPS and passes to express server and socket server. 

- -  Express server handles control flow and sends response.

- -  Socket server checks clients' connections and receives / sends messages.

- c. Express server connects to database and executes CRUD operations

- d. Express server uploads files to AWS S3

- e. Users get files through AWS CDN

# Database Entiry Relationship Diagram
<img src='https://github.com/shaurair/project-notes/blob/main/doc/ErdColorCut.png' width=90%>

