# REDDIT MIGRATOR

An CLI Utility for copying or moving reddit subreddit subscriptions from one to another  

# Installation

$`python3 -m venv ./venv`  
$`source venv/bin/activate`  
$`pip install --editable .`  

# Creating the Reddit app

go to: [reddit.com/prefs/apps](https://www.reddit.com/prefs/apps/)  
And create a script app with similar settings to this screenshot:  
  
  
![screenshot](https://github.com/eralpkaraduman/reddit-migrator/raw/master/creating-reddit-script-app.png)

create config.ini file in reddit_migrator folder with credentials `reddit_migrator/config.ini`  
```
[Reddit]
AppId=Q13UuMnxcKrXBw
AppSecret=FOntQqMrmA4mxFXqLabbBt5u-sg
```

# Usage

`reddit_migrator --help`  
example;  
```bash
reddit_migrator FROM_USER_NAME migrate_and_unsubscribe \
--from_user_password=FROM_USER_PASSWORD \
--to_user_username=TO_USER_NAME \
--to_user_password=TO_USER_PASSWORD \
--nsfw_only
```
(Replace the parts written in ALL_CAPS with your own)

It can save the passwords if you add;  
`--save-passwords`

And to load them next time add;  
`--load-passwords` 

```
reddit_migrator account_a migrate_and_unsubscribe \  
--to_user_username=account_b \  
--load_passwords  
```
