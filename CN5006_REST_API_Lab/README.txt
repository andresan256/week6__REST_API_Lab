CN5006 Express REST API Lab starter project

Files included:
- index.js: routes for the lab exercises
- Students.json: sample JSON data
- StudentInfo.html: student POST form
- PersonForm.html: employee MongoDB POST form
- .env.example: template for MongoDB Atlas connection settings

SETUP
1. Install Node.js.
2. Open this folder in VS Code and open Terminal.
3. Run: npm init -y
4. Run: npm install express mongoose dotenv
5. Copy .env.example to .env and put your own Atlas URI in MONGO_URI.
6. In package.json, you can add: "start": "node -r dotenv/config index.js"
7. Put your Week4Lab.js file in this same folder. It must export the functions used in your Week 4 lab.
8. Run: node -r dotenv/config index.js
9. Visit http://localhost:5000/

TEST URLS
http://localhost:5000/
http://localhost:5000/about
http://localhost:5000/users/33/books/123
http://localhost:5000/GetStudents
http://localhost:5000/GetStudent/1
http://localhost:5000/GetStudent/2
http://localhost:5000/GetStudent/3
http://localhost:5000/GetStudent/4  (expected 404 Student Not Found)
http://localhost:5000/studentinfo
http://localhost:5000/Showform
http://localhost:5000/persons
http://localhost:5000/persons/count
http://localhost:5000/persons/females-over-30

IMPORTANT
The MongoDB routes depend on your own Week4Lab.js and a valid MONGO_URI. The starter does not include Week4Lab.js because it was not part of the uploaded lab manual PDF. Do not paste database passwords into source code or upload them to GitHub. If a real password was included in any shared code, change it in Atlas.
