var jwt_decode = require('jwt-decode');
var token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjM0NjY4MDA3LCJqdGkiOiI4Yzc3MzMxM2JiNjE0YzMyYjU0MTU4ZGU0Nzk5MDE5ZCIsInVzZXJfaWQiOjR9.hPtYV3YbkO7aLnYkfb2Khlh0__eRyKLqtuFuEjAJyIU';
 
var decoded = jwt_decode(token);
console.log(decoded);
console.log(Date.now());