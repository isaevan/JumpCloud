"use strict";

const {expect} = require("chai");
const restUtil = require ("../util/restUtil");
const wget = require('wget');
const crypto= require ("crypto")


describe("Verufy app suports three endpoints: ",function(){

let response, hashCode, encodedPassword, jobIdentifier, getStats;

 // Corresponding tests related to  TestResult page
it ("should verify application supports three endpoints.", async function (){
// Send POST request and get job identifier
jobIdentifier = await restUtil.postRequest("hash", '{"password":"angrymonkey"}');
expect( jobIdentifier.status).to.equal(200, `Post request failed with stausCode= ${jobIdentifier.status} and statusText: ${jobIdentifier.statusText}`);

// Get base64 encoded password hash
encodedPassword = await restUtil.getRequest( "hash/"+ jobIdentifier.data );
expect( encodedPassword.status).to.equal(200, `Get request failed with stausCode= ${encodedPassword.status} and statusText: ${encodedPassword.statusText}`);
expect(encodedPassword.data).to.not.be.empty;

// Get the stats info
getStats = await restUtil.getRequest("stats");
console.log("getStats:", getStats);
expect(getStats.status).to.equal(200, `Get request failed with stausCode= ${getStats.status} and statusText: ${getStats.statusText}`);
expect(getStats.data).to.not.be.empty;

});

it ("should verify hashing algorithm is SHA512.", async function (){
       
// Send POST request and get job identifier
jobIdentifier = await restUtil.postCurlRequest("hash",  '{"password":"angrymonkey"}');

// Get base64 encoded password hash
encodedPassword = await restUtil.getCurlRequest( "hash/"+ jobIdentifier );
    
// Convert password string to SHA-512 algorithm hash in encoded with Base64 (output bytes)
hashCode = crypto.createHash('sha512').update("angrymonkey").digest("base64"); //returns NN0PAKtieayiTY8/Qd53AeMzHkbvZDdwYYiDnwtDdv/FIWvcy1sKCb7qi7Nu8Q8Cd/MqjQeyCI0pWKDGp74A1g==
 console.log( "hashCode: ",  hashCode);

// Verify SHA 512 algorithm
expect(encodedPassword).to.equal(hashCode, `Expected algorithm is not in SHA 512.`);
});

it("should verify POST request to  “/hash” endpoint with incorrect value parameters are not allowed.", async function (){
//// Send POST request and expect to get "Bad Request'" message with status code 400

// jobIdentifier = await restUtil.postRequest("hash", '{" ":"angrymonkey1"}');
// expect( jobIdentifier.status).to.equal(400, `Post request failed with statusCode= ${jobIdentifier.status} and statusText: ${jobIdentifier.statusText}`);

// jobIdentifier = await restUtil.postRequest("hash", '{"p-d ":"angrymonkey1"}');
// expect( jobIdentifier.status).to.equal(400, `Post request failed with statusCode= ${jobIdentifier.status} and statusText: ${jobIdentifier.statusText}`);

// jobIdentifier = await restUtil.postRequest("hash", '{" ":" "}');
// expect( jobIdentifier.status).to.equal(400, `Post request failed with statusCode= ${jobIdentifier.status} and statusText: ${jobIdentifier.statusText}`);

// jobIdentifier = await restUtil.postRequest("hash", '{" ":null}');
// expect( jobIdentifier.status).to.equal(400, `Post request failed with statusCode= ${jobIdentifier.status} and statusText: ${jobIdentifier.statusText}`);

// jobIdentifier = await restUtil.postRequest("hash", '{"%$^#^":"angrymonkey"}');
// expect( jobIdentifier.status).to.equal(400, `Post request failed with statusCode= ${jobIdentifier.status} and statusText: ${jobIdentifier.statusText}`);
            
jobIdentifier = await restUtil.postRequest("hash", '{null:"angrymonkey"}');
expect( jobIdentifier.status).to.equal(400, `Post request failed with statusCode= ${jobIdentifier.status} and statusText: ${jobIdentifier.statusText}`);

jobIdentifier = await restUtil.postRequest("hash", '{234:"angrymonkey"}');
 expect( jobIdentifier.status).to.equal(400, `Post request failed with statusCode= ${jobIdentifier.status} and statusText: ${jobIdentifier.statusText}`);
        
 });

it ("should verify a GET request to '/stats' endpoint should accept no data." , async function (){
               
// Get the stats info
getStats = await restUtil.postRequest("stats", {"password":"angrymonkey"});
console.log("getStats:", getStats);
expect(getStats.status).to.equal(400, `Get request failed with stausCode= ${getStats.status} and statusText: ${getStats.statusText}`);
            
});

it ("should verify a GET request to '/stats' increment totalRequest value." , async function (){

 // Get the stats info to check totalRequests
let totalRequests = await restUtil.getRequest("stats");
console.log("totalRequest:", totalRequests.data["TotalRequests"]);
expect(totalRequests.status).to.equal(200, `Get request failed with stausCode= ${totalRequests.status} and statusText: ${totalRequests.statusText}`);

// // Send some requests
jobIdentifier = await restUtil.postRequest("hash", '{"password":"angrymonkey"}');
expect( jobIdentifier.status).to.equal(200, `Post request failed with stausCode= ${jobIdentifier.status} and statusText: ${jobIdentifier.statusText}`);

encodedPassword = await restUtil.getRequest( "hash/"+ jobIdentifier.data );
expect( encodedPassword.status).to.equal(200, `Get request failed with stausCode= ${encodedPassword.status} and statusText: ${encodedPassword.statusText}`);


// Get the stats info
getStats = await restUtil.getRequest("stats");
console.log("getStats.data:",getStats.data)
expect(getStats.status).to.equal(200, `Get request failed with stausCode= ${getStats.status} and statusText: ${getStats.statusText}`);
expect(totalRequests.data["TotalRequests"]+1).to.equal(getStats.data["TotalRequests"])

});

it("should verify software able to process multiple connections simultaneously.", async function (){

jobIdentifier = await restUtil.postRequest("hash", '{"password":"angrymonkey"}');
console.log("jobIdentifier:", jobIdentifier.data)
 expect( jobIdentifier.status).to.equal(200, `Post request failed with stausCode= ${jobIdentifier.status} and statusText: ${jobIdentifier.statusText}`);
      
await restUtil.multipleConnections( jobIdentifier.data );

});

it("should verify POST request to  “/hash” endpoint  without Header name.", async function(){

// Send POST request and get job identifier
jobIdentifier = await restUtil.postCurlRequest("hash", '{"password":"angrymonkey"}',{headers:{"":"application/json"}});
console.log("response: ", jobIdentifier); 

//todo add assertions based on is defect or not
});

it("should verify GET request to “/hash” endpoint without Header name.", async function(){

// Send POST request and get job identifier
jobIdentifier = await restUtil.postCurlRequest("hash", '{"password":"angrymonkey"}');

 // Get base64 encoded password hash
 encodedPassword = await restUtil.getCurlRequest( "hash/" + jobIdentifier, {headers:{"":"application/json"}});
 console.log("encodedPassword: ", encodedPassword);

});

it("should verify GET request to “/hash” endpoint doesn't allowed unexistent jobIdentifier.", async function(){

// Send POST request and get job identifier
jobIdentifier = await restUtil.postCurlRequest("hash", '{"password":"angrymonkey"}');
    
 // Get base64 encoded password hash
 encodedPassword = await restUtil.getCurlRequest( "hash/" + jobIdentifier+10);
 console.log("encodedPassword: ", encodedPassword);
    
 });



it("should verify shutdown request.", async function (){
response = await restUtil.shutDownRequest();
console.log("response:", response)
expect(response.data ).to.equal(200,  "ShutDown is not completed.");

// Verify after software shutdown rejects any new requests
getStats = await restUtil.getRequest("stats");
console.log("getStats.data:",getStats.data)
expect(getStats.status).to.equal(200, `Get request failed with stausCode= ${getStats.status} and statusText: ${getStats.statusText}`);

});
 
});



