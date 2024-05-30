# Composer-enabled Drupal template

This is Pantheon's recommended starting point for forking new [Drupal](https://www.drupal.org/) upstreams
that work with the Platform's Integrated Composer build process. It is also the
Platform's standard Drupal 10 upstream.

Unlike with earlier Pantheon upstreams, files such as Drupal Core that you are
unlikely to adjust while building sites are not in the main branch of the
repository. Instead, they are referenced as dependencies that are installed by
Composer.

For more information and detailed installation guides, please visit the
Integrated Composer Pantheon documentation: https://pantheon.io/docs/integrated-composer

# Origin template for Drupal 10 projects

This project template provides a kickstart theme and config for our base website setup including a Circle CI workflow.

## Requirements

- [Git](https://git-scm.com/downloads)
- [Composer](https://getcomposer.org/download/)
- [Docker](https://docs.docker.com/engine/installation/)
- [Lando](https://lando.dev/)

## 1. Setting up [Origin Drop 10](https://github.com/origindesign/origin-drop-10)

Clone this repository into a local folder [name-of-project]
````
git clone git@github.com:origindesign/origin-drop-10.git [name-of-project]
````

## 2. Setting Up Pantheon

- Create new Drupal 10 site on Pantheon - [name-of-project]
- Don't install Drupal, instead switch site to git mode ready for accepting the code base from the Circle CI build step


## 3. Setting up Lando

From the root of the project, delete the existing .lando.yml and rename:
````
.lando.txt to .lando.yml
````
Update .lando.yml config
- Replace [jobcode] (lines 1 and 21) with the 3 letter Origin job code for the project, this will determine your lando sites local URL: https://[jobcode].lndo.site
- Replace [pantheon-machine-name] with the Pantheon machine name for your site, this should be [name-of-project] from above
- Replace [pantheon-id] with the numeric Pantheon ID. This can be retrieved from the dashboard URL

Start lando, this will also run a composer install
```shell
lando start
```
- Visit lando URL https://[jobcode].lndo.site and install Drupal using existing configuration 'Origin Drop'.

- Rename files to setup for local development with services and settings to turn off caching and add lando database config
```shell
Rename /web/sites/development.services.yml.txt to development.services.yml
Rename /web/sites/default/settings.local.php.txt to settings.local.php
```

## 5. Pushing to Github

- Remove git files
- Create an empty github repository with [name-of-project]. This should ideally match the [pantheon-machine-name]

From the root of your local project:
```shell
rm -rf .git 
git init
git add -A .
git commit -m "Initializing repo on Github"
git remote add origin git@github.com:origindesign/[name-of-project].git
git push -u origin master
```
- In order to use config manager, you need to sync the database with Pantheon before pushing anything else. From the root of the project:
```shell
lando push --database=dev
```
- This way, the local and the dev site are using the same UUID so we can use config manager
- If drush fails because of permission errors, skip this and continue through the next steps to push your first commit, let circle build a new version of Drush to push to Pantheon, then revisit this step after.

## 6. Configuring Circle CI

In Circle CI, create a new project based on your Github new repo. In the environment variables enter the following:
- TERMINUS_SITE: The machine name of the Pantheon site that will be used to test your site [pantheon-machine-name]

These additional environment variables will be added through a context origin-pantheon-git set in /.circleci/config.yml

- TERMINUS_TOKEN: The Terminus Machine token
- GITHUB_TOKEN: Used by CircleCI to post comments on pull requests.
- GIT_EMAIL: Used to configure the git user’s email address for commits we make.

Then in the SSH permissions, enter your SSH key and launch a build. The build will:
- Pull the repo from github
- Build an artifact
- Run the test set on either the dev environment, or within a new multidev if a branch is pushed
