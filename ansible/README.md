Dependecies:
  - Ansible
  - Python > 2.6, with boto, boto3, and botocore (pip install boto etc.)
  - Set up AWS credentials on the command line AWS=PROFILE=sts 

When first setting up ansible make sure you create a directory named Keys 
ansible 
  Inventory/
  Roles/
  Keys/
  something.yml

WARNING!⚠️ You should git ignore the Keys directory or else the private key will be exposed to github ⚠️WARNING!

The directories that set up the ec2 parameters are group_vars/all/main.yml (used for terminate-ec2-instance.yml) and in Roles/create-ec2-instances/vars/main.yml it contains the parameters needed to create an ec2.

To create an ec2 instance use the following command:

``` ansible-playbook create-ec2.yml -i inventory ```

To terminate an ec2 use the following command: 

```ansible-playbook terminate-ec2-instance.yml -i inventory```

On any command if you wanna see ansible output errors or successes run a command with this flag -vvv:

```ansible-playbook -vvv create-ec2.yml -i inventory ```
```ansible-playbook -vvv terminate-ec2-instance.yml -i inventory```
