# QA Assignment-JumpCloud

Introduction
For this assignment, JumpCloud has implemented a password hashing application in Golang and have intentionally left bugs in it. The assignment is to write the test cases needed to test the application, execute the test cases and report the bugs.

Password hashing application stored in a public S3 bucket. You can get it in the following manner: *‘https://qa-broken-hashserve-jc.s3.amazonaws.com/broken-hashserve.tar’

Details
The following is the requirement specification that was used in building the password hashing application. It describes what the application should do. You can interact/test the application using curl.

● When launched, the application should wait for http connections.

● It should answer on the PORT specified in the PORT environment variable.

● It should support three endpoints:

○ A POST to /hash should accept a password. It should return a job identifier immediately. It should then wait 5 seconds and compute the password hash. The hashing algorithm should be SHA512.

$ curl -X POST -H "application/json" -d '{"password":"angrymonkey"}' http://127.0.0.1:8088/hash.

○ A GET to /hash should accept a job identifier. It should return the base64 encoded password hash for the corresponding POST request.

$ curl -H "application/json" http://127.0.0.1:8088/hash/1

○ A GET to /stats should accept no data. It should return a JSON data structure for the total hash requests since the server started and the average time of a hash request in milliseconds.

$ curl http://127.0.0.1:8088/stats

● The software should be able to process multiple connections simultaneously.

● The software should support a graceful shutdown request. Meaning, it should allow any in-flight password hashing to complete, reject any new requests, respond with a 200 and shutdown.

● No additional password requests should be allowed when shutdown is pending.

###Steps to run the test
1. $ npm install -g npm@latest
2. $ npm i protractor -g.  
3. $ npm install jasmine
4. $ npm install 
5. $ webdriver-manager start
6. $ webdriver-manager update 
7. Cmd to  run the tests: $ protractor conf/conf.js
