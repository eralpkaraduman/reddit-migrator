`python3 -m venv ./venv`  
`source venv/bin/activate`  
`pip install --editable .`  
`reddit_migrator --help`  

# Usage

```
reddit_migrator account_a migrate_and_unsubscribe /  
--from_user_password=password_a /  
--to_user_username=account_b /  
--to_user_password=password_b  
```

It can save the passwords if you add;  
`--save-passwords`

And to load them next time add;  
`--load-passwords` 

```
reddit_migrator account_a migrate_and_unsubscribe /  
--to_user_username=account_b /  
--load_passwords  
```
