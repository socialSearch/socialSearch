echo git config --global user.email "caseyg1204@gmail.com"
echo git config --global user.name "Casey"
echo "Host heroku.com" >> ~/.ssh/config
echo "   StrictHostKeyChecking no" >> ~/.ssh/config
echo "   CheckHostIP no" >> ~/.ssh/config; 
echo "   UserKnownHostsFile=/dev/null" >> ~/.ssh/config;
if [[ $TRAVIS_PULL_REQUEST == "false" && $TRAVIS_BRANCH == "master" ]]
  then 
    echo gem install heroku
    echo heroku keys:clear
    echo yes | heroku keys:add
    echo grunt build
    echo yes | grunt buildcontrol:heroku
    echo heroku keys:clear
fi
if [[ $TRAVIS_PULL_REQUEST == "false" ]]
  then
    echo $TRAVIS_BRANCH
fi
echo
echo "...done."