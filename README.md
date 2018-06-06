`python3 -m venv ./venv`  
`source venv/bin/activate`  
`pip install --editable .`  
`reddit_migrator --help`  

`reddit_migrator account_a migrate_and_unsubscribe --from_user_password=password_a --to_user_username=account_b --to_user_password=password_b --nsfw_only --save_passwords`  
`reddit_migrator account_a migrate_and_unsubscribe --to_user_username=account_b --nsfw_only --load_passwords`  
