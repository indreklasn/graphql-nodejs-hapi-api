##### Medium: https://medium.com/@wesharehoodies/how-to-setup-a-powerful-api-with-nodejs-graphql-mongodb-hapi-and-swagger-e251ac189649?source=user_profile---------4-------------------
Slight modification from author for review purposes and to work with codeanywhere.

Modified to run on port 3000, open to the public and install based on Ubuntu.

## Setup on Ubuntu

### Install NodeJS
```bash
curl -sL https://deb.nodesource.com/setup_11.x | sudo -E bash -
sudo apt-get install -y nodejs
```
### Install mongoDb
```bash
sudo apt install -y mongodb
# check service status
sudo systemctl status mongodb
```

##### Mongo reference: https://www.digitalocean.com/community/tutorials/how-to-install-mongodb-on-ubuntu-18-04

### add npm packages
```bash
npm add hapi 
npm add nodemon
npm add mongoose
npm add apollo-server-hapi
npm add graphql
npm add inert
npm add vision hapi-swagger 
```

## to Run

```bash
  node index.js
```
