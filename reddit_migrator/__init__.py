import configparser
import praw

config = configparser.ConfigParser()
config.read('config.ini')
reddit_app_id = config['Reddit']['AppId']
reddit_app_secret = config['Reddit']['AppSecret']


def authenticate(username, password):
    print('Authenticating %s' % username)
    reddit = praw.Reddit(client_id=reddit_app_id,
                         client_secret=reddit_app_secret,
                         user_agent='script',
                         password=password,
                         username=username)
    return reddit


def get_subreddits_of_user(username, password, omit_nsfw, nsfw_only):
    reddit = authenticate(username, password)
    print('Fetching subreddits of user')
    include_nsfw = (not omit_nsfw)
    print('Include NSFW: %s' % include_nsfw)
    print('Only NSFW: %s' % nsfw_only)

    subreddits = []
    for subreddit in reddit.user.subreddits():
        is_nsfw = subreddit.over18
        include = True

        if omit_nsfw and is_nsfw:
            include = False

        if not is_nsfw and nsfw_only:
            include = False

        if include:
            subreddits.append(subreddit)

    return subreddits
