from os import path
import distutils.dir_util
# import pathlib
import configparser
import click
import reddit_migrator

home = path.expanduser("~")
session_config_dir = path.join(home, '.reddit_migrator')
session_config_file_path = path.join(session_config_dir, 'session.ini')

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
@click.option('--from_user_password', prompt=False, hide_input=True)
@click.argument('action', type=click.Choice(actions.keys()))
@click.option('--save_password', is_flag=True)
@click.option('--load_password', is_flag=True)
def cli(from_user_username, from_user_password, action, omit_nsfw, nsfw_only, save_password, load_password):
  """Reddit Migrator CLI"""
  click.echo("Reddit Migrator!")
  click.echo("From user: %s" % from_user_username)
  click.echo("Action: %s" % action)

  if load_password:
    from_user_password = session_load_password(from_user_username)
  else:
    if not from_user_password:
      raise Exception('--from_user_password=PASSWORD is required')
    if save_password:
      session_save(from_user_username, from_user_password)

  actions[action](from_user_username, from_user_password, omit_nsfw=omit_nsfw, nsfw_only=nsfw_only)

def session_save(username, password):
  session_config = session_load()
  click.echo("Saving password...")
  passwords_section = 'Passwords'
  if not session_config.has_section(passwords_section):
    session_config.add_section(passwords_section)

  session_config.set(passwords_section, username, password)
  distutils.dir_util.mkpath(session_config_dir)
  fo = open(session_config_file_path, 'w')
  session_config.write(fo)
  fo.close()

def session_load():
  click.echo("Loading session storage (%s)" % session_config_file_path)
  config = configparser.ConfigParser()
  config.read(session_config_file_path)
  return config

def session_load_password(username):
  session_config = session_load()
  return session_config.get('Passwords', username)