---
title: Documentation
---

Automate allows to you to automate your deployments to remote Linux servers simply.
You can use Automate from your workstation or through an integration server like Travis or Gitlab-ci

# Installation 

You can download the latest version of Automate with the following command:

```bash
curl -LSs https://automatephp.github.io/automate/installer.php | php
```

The command will verify your PHP settings and launch the download in the current directory.

You will then be able to update Automate simply with the following command:

```bash
php automate.phar update
```

# Creating your configuration file

Foremost, you have to create a configuration file for Automate.
This file is generally located at the root of your project. The name of this file must be `.automate.yml`.

Here is an example file:

```YAML
repository: git@github.com:symfony/symfony-demo.git
platforms:
    development:
        default_branch: dev
        max_releases: 3
        servers:
            dev-exemple-front-01:
                host: dev.exemple.com
                user: automate
                password: %dev_password%
                path: /home/wwwroot/
                port: 22
    production:
        default_branch: master
        max_releases: 3
        servers:
            prod-exemple-front-01:
                host: prod-1.exemple.com
                user: automate
                password: %prod_password%
                path: /home/wwwroot/
            prod-exemple-front-02:
                host: prod-2.exemple.com
                user: automate
                password: %prod_password%
                path: /home/wwwroot/
shared_files:
    - app/config/parameters.yml
shared_folders:
    - app/data
pre_deploy:
    - "php -v"
on_deploy:
    - "composer install"
    - "setfacl -R -m u:www-data:rwX -m u:`whoami`:rwX var"
post_deploy:
    - "php bin/console doctrine:schema:update --force"
    only: eddv-exemple-front-01                     
    - "php bin/console doctrine:cache:clear-result"
```

## Configuration

### repository

```YAML
repository: git@github.com:symfony/symfony-demo.git
```

The Git repository URL to be deployed. If you use a repository in https you can use a variable with the notation %variable_name% for the password 

Sample : 
```YAML
repository: https://user:%git_password%@exemple.com
```

### platforms

The list of platforms.
You can configure several platforms.
A project must have at least one platform. 

```YAML
platforms:
    production:
        default_branch: master # The default branch to be launched if no branch is specified during the deployement
        max_releases: 1        # The number of releases to be kept on remote servers.
        servers:
            prod-exemple-front-01:
                host: prod-1.exemple.com   # The domain name or the server's IP
                user: automate             # The SSH user to be used for the deployment
                password: %prod_password%  # Read more below in "The SSH password" section 
                path: /home/wwwroot/       # The path on the remote server
                port : 22                  # The SSH port (default:22)    
            prod-exemple-front-02:
                host: prod-2.exemple.com
                user: automate
                password: %prod_password%
                path: /home/wwwroot/
```

**The SSH password** 

You can use a variable with the notation %variable_name% 
If one variable is detected Automate will search for the value in an environment variable « AUTOMATE__variable_name » 
If the environment variable does not exist, Automate will ask you to provide your password upon each deployment through the console.


### shared_files

```YAML
shared_files:
    - app/config/parameters.yml
    - app/config/config.yml
    - ... 
```

The list of files to be shared with releases. 
For example : parameters files,..

### shared_folders

```YAML
shared_files:
    - app/data
    - ... 
```
The list of folders to be shared between releases.
For example : uploaded images,..

### pre_deploy

The list of commands to be launched on remote servers **after downloading sources** and **before** setting up shared folders and files.

### on_deploy

The list of commands to be launched on remote servers **before deployment**.

### post_deploy

The list of commands to be launched on remote servers **after deployment**.

**Option** : Possibility to execute only one command just to one remote server with :

```YAML
post_deploy:
    - "php bin/console doctrine:schema:update --force"
    only: eddv-exemple-front-01                     
    - "php bin/console doctrine:cache:clear-result"
```
                  
# Server Configuration

Automate will create the following directory structure on the remote server:

```BASH
/your/project/path
|--releases
|  |--20160513120631
|  |  |--config
|  |  |  |--parameters.yml --> /your/project/path/shared/app/config/parameters.yml
|
|--shared_files
|  |  |--config
|  |  |  |--parameters.yml #the real file is here
|
|--current -> /your/project/path/releases/20150513120631
```

This is the schema of all your project's architecture
You have to target your domain name in the folder `/your/project/path/current/.`

Each deployment will create a new subdirectory in the releases directory. Once the deployment is finished, a symlink named "current" will indicate the new version. 

# Launching a Deployment

## From your desktop

The following command allows you to launch the deployment on the remote server(s)

```bash
php automate.phar deploy development master
```

```bash
php automate.phar deploy ‹platform› [gitref] -c [path_of_config_file]
```

 - **platform**

The target platform name (e.g. development)

 - **gitref (optional)**

The branch, the tag, or the commit to be deployed.
By default Automate will use the « default_branch » in the configuration file

 - **-c [path_of_config_file] (optional)**

By default, Automate will search for the file `.automate.yml` in the current directory. You can specify it with the option ` -c /path/to/.automate.yml `
      
## Automatically from your Gitlab or Travis environment      

It's possible directly in Gitlab or Travis only to lunch automatically Automate after each `push` or `merge request` 
For this, just add the file `.gitlab-ci.yml` in the root path of your project. 

```YAML
stages:
  - ...
  - deploy
  
deploy:development:
  stage: deploy
  image: "php"                                  #Use the good Docker container image you need 
  only:
    - master
  script:
    - "php automate.phar deploy development"   #Lunch the job ! 
  environment:
    name: development
    url: http://prod-1.exemple.com
```

# Notification plugins
## Gitlab notification

To receive a notification `success` or `failed` after each deployment in your "Gitlab Trigger Job", you can easely add this sample in your `.automate.yml` file : 

```YAML

```

```YAML
deploy_from_remote:
  stage: deploy
  environment:
    name: "$ENVIRONMENT_NAME"
  script:
    - if [ -n "${DEPLOY_FAILED_MSG}" ]; then echo "$DEPLOY_FAILED_MSG";exit 1; fi
    - if [ -n "${DEPLOY_SUCCESS_MSG}" ]; then echo "$DEPLOY_SUCCESS_MSG";exit 0; fi
```
## Plugin Slack

## Plugin Cache

```YAML
plugins:
    cache_tool:
        opcache: true
        apcu: false
        apc: false
```