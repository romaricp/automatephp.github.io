---
title: Documentation
---

Automate allows you to automate your deployments to remote Linux servers simply.
You can use Automate from your workstation or through an integration server like Travis or Gitlab-ci

# Installing Automate

You can download the latest version of Automate with the following command:


```bash
curl -LSs https://automatephp.github.io/automate/installer.php | php
```

The command will verify your PHP settings and launch the download in the current directory.

You will then be able to update Automate simply with the following command:

```bash
php automate.phar update
```


# Creating Your Configuration File

First and foremost, you have to create a configuration file for Automate.
This file is generally located at the root of your project. The name of this file must be ".automate.yml".

Here is an example file:

```yaml
repository: git@github.com:symfony/symfony-demo.git
platforms:
    development:
        default_branch: master
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
    - "setfacl -dR -m u:www-data:rwX -m u:`whoami`:rwX var"
post_deploy:
    - "php bin/console doctrine:schema:update --force"
    only: eddv-exemple-front-01                     
    - "php bin/console doctrine:cache:clear-result"
```

## Configuration

### repository


The Git repository URL to be deployed. If you use a repository in https you can use a variable with the notation %variable_name% for the password 
Example : https://user:%git_password%@exemple.com

### platforms

The list of platforms.
You can configure several platforms.
A project must have at least one platform.

### shared_files

The list of folders to be shared with releases. For example, uploaded images, logs,…

### shared_folders

The list of files to be shared between releases.

### pre_deploy

The list of commands to be launched on remote servers right after downloading sources and before setting up shared folders and files

### on_deploy

The list of commands to be launched on remote servers right before deployment.

### post_deploy

The list of commands to be launched on remote servers after deployment.

Option : Possibility to execute only one command just to one remote server with :

only: eddv-exemple-front-01
- "php bin/console doctrine:cache:clear-result"
                  
## Platform

### default_branch

The default branch to be launched if no branch is specified during deployed.

### max_releases

The number of releases to be kept on remote servers.

### servers

The list of servers. If the platform contains several servers, the deployment will be carried out simultaneously on the all the servers. 
A platform must have at least one server.

## Server

# host

The domain name or the server's IP

# user

The SSH user to be used for the deployment
# password

The SSH password. 

You can use a variable with the notation %variable_name% 
If one variable is detected Automate will search for the value in an environment variable « AUTOMATE__variable_name » 
If the environment variable does not exist, Automate will ask you to provide your password upon each deployment through the console.

# path

The path on the remote server

#port

The SSH port (defaul 22)    

# Server Configuration

Automate will create the following directory structure on the remote server:

```bash
/your/project/path
|--releases
|  |--20160513120631
|--shared
|  |--...
|--current -> /your/project/path/releases/20150513120631
```
          
Each deployment will create a new subdirectory in the releases directory. Once the deployment is finished, a symlink named "current" will indicate the new version.

# Launching a Deployment

The following command allows you to launch the deployment on the remote server(s)

```bash
php automate.phar deploy ‹platform› [gitref]
```

### platform

The target platform name (e.g. development)

### gitref (optional)

The branch, the tag, or the commit to be deployed.
By default Automate will use the « default_branch » in the configuration file


By default, Automate will search for the file « .automate.yml » in the current directory. You can specify it with the option « -c /path/to/.automate.yml »      