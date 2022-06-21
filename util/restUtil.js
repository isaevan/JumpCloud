"use strict";

const axios = require ("axios");
const curlirize = require ("axios-curlirize");
const {expect}= require ("chai");


const restUtil = function (){

    let baseUrl = "http://127.0.0.1:8088/";

    let apiJsonConfig ={
        headers :  { 
            "":"application/json"} 
    };

    let correctHeaders = {
        headers :  { 
            "Accept":"application/json",
            "Content-Type":"application/x-www-form-urlencoded" } 
    };
    

    let apiUrlEncodedConfig ={
        headers :{
            "Content-Type":"aapplication/json"
        }
    };

    this.getCurlRequest = async function (url, config = correctHeaders){
        curlirize(axios);
        let res = await axios.get(baseUrl+ url, config);
        return res.data;
    };

    this.postCurlRequest = async function (url, data, config = correctHeaders  ){
        curlirize(axios);
        let res = await axios.post(baseUrl+ url, data, config);
        return res.data;
    };

    this.getRequest = async function (url, config=correctHeaders){
        return await axios.get(baseUrl+ url,config).catch(function (error){
            if(error.response){
                return error.response;
            }
        })
    };

    this.postRequest = async function (url, data, config= correctHeaders){
      return await axios.post (baseUrl+ url, data, config).catch(function (error){
    if(error.response){
        return error.response;
    }
})
    };

    this.multipleConnections = async function (jobIdentifier){
        await axios.all([
            axios.get(baseUrl + "hash/" + `${jobIdentifier-1}`), 
            axios.get(baseUrl + "hash/" + `${jobIdentifier-2}`),
            axios.get(baseUrl + "hash/" + `${jobIdentifier-3}`),
          ])
          .then(axios.spread((obj1, obj2, obj3) => {
            // All requests are now complete
            expect (obj1.status).to.equal(200, "Failed on first Request");
            expect (obj2.status).to.equal(200, "Failed on second Request");
            expect (obj3.status).to.equal(200, "Failed on third Request");
          }));
    };

    this.shutDownRequest = async function (){
      return await this.postCurlRequest ( "hash", "shutdown"," " ).catch(function (error){
        if(error.response){
            return error.response;
        }
    })
    };

};

module.exports = new restUtil();