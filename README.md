[![Coverage Status](https://coveralls.io/repos/socialSearch/socialSearch/badge.png)](https://coveralls.io/r/socialSearch/socialSearch)
[![Build Status](https://travis-ci.org/socialSearch/socialSearch.svg?branch=master)](https://travis-ci.org/socialSearch/socialSearch)

# socialSearch  

Beautifully search twitter, instagram, and facebook

## Team

  Huy Pham  
  Justin Cruz  
  Casey Garland  

## Table of Contents

1. [Usage](#Usage)
1. [Requirements](#requirements)
1. [Development](#development)
    1. [Installing Dependencies](#installing-dependencies)
    1. [Tasks](#tasks)
1. [Team](#team)
1. [Contributing](#contributing)

## Usage

This application is configured to use Travis-CI for continuous integration, Coveralls.IO for code coverage, and Heroku for hosting. 


#### API Registration
To use this application you will need to register for API access to Twitter and Instagram.

#### Local Environment Variables
Once that is complete rename local.sample.env.js to local.env.js and add the correct api keys.

#### Travis-CI Environment Variables
You will also need to add these variables to Travis-CI as environment variables. In addition, add NODE_ENV = production, and HEROKU_API_KEY='your api key' to Travis. 

#### .travis.yml
Add your information to lines 12 and 13

#### Gruntfile.js
Add your remote heroku git repo to line 385
remote: 'git@heroku.com:socialsearchd.git'







## Requirements

- Node 0.10.x

## Development


### Installing Dependencies

From within the root directory:

```sh
sudo npm install -g bower
npm install
bower install
```

### Roadmap

View the project roadmap [here](https://github.com/socialSearch/socialSearch/issues)


## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.
