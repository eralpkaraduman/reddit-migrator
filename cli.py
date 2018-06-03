import click
import reddit_migrator

def print_subscriptions(username, password, omit_nsfw, nsfw_only):
  subreddits = reddit_migrator.get_subreddits_of_user(username, password, omit_nsfw, nsfw_only)
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
def main(from_user_username, from_user_password, action, omit_nsfw, nsfw_only):
  """Reddit Migrator CLI"""
  click.echo("Reddit Migrator!")
  click.echo("From user: %s" % from_user_username)
  click.echo("Action: %s" % action)
  actions[action](from_user_username, from_user_password, omit_nsfw=omit_nsfw, nsfw_only=nsfw_only)
