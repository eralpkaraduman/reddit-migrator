import setuptools

setuptools.setup(
  name='reddit_migrator',
  version='0.0.1',
  author='Eralp Karaduman',
  author_email='eralp@eralpkaraduman.com',
  description='Migrates reddit subscriptions from one account to another',
  packages=setuptools.find_packages(),
  install_requires=[
    'click'
  ],
  classifiers=(
    'License :: OSI Approved :: MIT License',
  ),
  entry_points = {
        'console_scripts': ['reddit_migrator=reddit_migrator.command_line:main'],
    }
)