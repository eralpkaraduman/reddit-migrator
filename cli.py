from os import path
import distutils.dir_util
import configparser
import click
import reddit_migrator

home = path.expanduser("~")
session_config_dir = path.join(home, '.reddit_migrator')
session_config_file_path = path.join(session_config_dir, 'session.ini')


def print_subscriptions(options):
    subreddits = reddit_migrator.get_subreddits_of_user(
        options['from_user_username'],
        options['from_user_password'],
        options['omit_nsfw'],
        options['nsfw_only']
    )
    for subrredit in subreddits:
        print(subrredit)


def migrate_subscriptions(options):
    from_user_username = options['from_user_username']
    from_user_password = options['from_user_password']
    to_user_username = options['to_user_username']
    to_user_password = options['to_user_password']
    omit_nsfw = options['omit_nsfw']
    nsfw_only = options['nsfw_only']

    if not from_user_password:
        raise Exception('--from_user_password=PASSWORD is required')

    if not to_user_username:
        raise Exception('--to_user_username=USERNAME is required')

    if not to_user_password:
        raise Exception('--to_user_password=PASSWORD is required')

    subreddits_to_migrate = reddit_migrator.get_subreddits_of_user(
        from_user_username,
        from_user_password,
        omit_nsfw,
        nsfw_only
    )

    reddit_migrator.subscribe_subbreddits_to_user(
        to_user_username,
        to_user_password,
        subreddits_to_migrate
    )


def unsubscribe_all(options):
    from_user_username = options['from_user_username']
    from_user_password = options['from_user_password']
    omit_nsfw = options['omit_nsfw']
    nsfw_only = options['nsfw_only']
    
    subreddits = reddit_migrator.get_subreddits_of_user(from_user_username, from_user_password, omit_nsfw, nsfw_only)
    reddit_migrator.unsubscribe_user_from_subreddits(from_user_username, from_user_password, subreddits)
    
def migrate_subscriptions_then_unsubscribe(options):
    migrate_subscriptions(options)
    unsubscribe_all(options)


actions = {
    'list': print_subscriptions,
    'migrate': migrate_subscriptions,
    'unsubscribe': unsubscribe_all,
    'migrate_and_unsubscribe': migrate_subscriptions_then_unsubscribe,
}


@click.command()
@click.option('--nsfw_only', is_flag=True)
@click.option('--omit_nsfw', is_flag=True)
@click.argument('from_user_username')
@click.option('--from_user_password', prompt=False, hide_input=True)
@click.argument('action', type=click.Choice(actions.keys()))
@click.option('--save_passwords', is_flag=True)
@click.option('--load_passwords', is_flag=True)
@click.option('--to_user_username', type=click.STRING)
@click.option('--to_user_password', type=click.STRING)
def cli(
        from_user_username,
        from_user_password,
        action,
        omit_nsfw,
        nsfw_only,
        save_passwords,
        load_passwords,
        to_user_username,
        to_user_password):
    """Reddit Migrator CLI"""
    click.echo("Reddit Migrator!")
    click.echo("From user: %s" % from_user_username)
    click.echo("Action: %s" % action)

    if not from_user_password and not load_passwords:
        raise Exception('--from_user_password=PASSWORD is required')

    if to_user_username and not to_user_password and not load_passwords:
        raise Exception('--to_user_password=PASSWORD is required')

    if load_passwords:
        from_user_password = session_load_password(from_user_username)
        if to_user_username:
            to_user_password = session_load_password(to_user_username)

    if save_passwords:
        session_save_password(from_user_username, from_user_password)
        if to_user_username and to_user_password:
            session_save_password(to_user_username, to_user_password)

    actions[action]({
        'from_user_username': from_user_username,
        'from_user_password': from_user_password,
        'omit_nsfw': omit_nsfw,
        'nsfw_only': nsfw_only,
        'to_user_username': to_user_username,
        'to_user_password': to_user_password
    })


def session_save_password(username, password):
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
