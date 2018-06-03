import click
import configparser
import requests
import praw

config = configparser.ConfigParser()
config.read('config.ini')
reddit_app_id=config['Reddit']['AppId']
reddit_app_secret=config['Reddit']['AppSecret']

def authenticate(username, password):
  click.echo('Authenticating %s' % username)
  reddit = praw.Reddit(client_id=reddit_app_id,
                      client_secret=reddit_app_secret,
                      user_agent='script',
                      password=password,
                      username=username)
  return reddit
  
def get_subreddits_of_user(username, password, omit_nsfw, nsfw_only):
  reddit = authenticate(username, password)
  click.echo('Fetching subreddits of user')
  include_nsfw=(not omit_nsfw)
  click.echo('Include NSFW: %s' % include_nsfw)
  click.echo('Only NSFW: %s' % nsfw_only)

  subreddits=[]
  for subreddit in reddit.user.subreddits():
    is_nsfw=subreddit.over18
    include=True

    if omit_nsfw and is_nsfw:
      include=False

    if not is_nsfw and nsfw_only:
      include=False

    if include:
      subreddits.append(subreddit)
  
  return subreddits

def print_subscriptions(username, password, omit_nsfw, nsfw_only):
  subreddits = get_subreddits_of_user(username, password, omit_nsfw, nsfw_only)
  for subrredit in subreddits:
    print(subrredit)

actions={
  'print_subscriptions': print_subscriptions
}

@click.command()
@click.option('--nsfw_only', is_flag=True)
@click.option('--omit_nsfw', is_flag=True)
@click.argument('from_user_username')
@click.option('--from_user_password', prompt=True, hide_input=True)
@click.argument('action', type=click.Choice(actions.keys()))
def cli(from_user_username, from_user_password, action, omit_nsfw, nsfw_only):
  """Reddit Migrator CLI"""
  click.echo("Reddit Migrator!")
  click.echo("From user: %s" % from_user_username)
  click.echo("Action: %s" % action)
  actions[action](from_user_username, from_user_password, omit_nsfw=omit_nsfw, nsfw_only=nsfw_only)
