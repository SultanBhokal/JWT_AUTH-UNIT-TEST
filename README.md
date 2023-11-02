# JWT_AUTH-UNIT-TEST
using node express ts . created a server which provide api to register user , login , update user profile. All the validation and verification is done .
Following are the api url for localhost.

1) localhost:3000/api/users/register
2) localhost:3000/api/users/login
3) localhost:3000/api/users/refresh
4) localhost:3000/api/users/update/email
5) localhost:3000/api/users/update/password
6) localhost:3000/api/users/update/username


#To install dependancy please run npm i . or yarn

Please add .env file outside src and please add following variable inside .env to run project .
1)NODE_ENV= 
(make NODE_ENV=test , for running npm test .
npm run dev)
2)MONGODB_URI = your atlas mongodb or local url for mongodb connection


