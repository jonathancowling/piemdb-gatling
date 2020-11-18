The `./zap.sh` script can be ran using the official zap docker image owasp/zap2docker-stable.
The script is a wrapper for [zap-cli](https://github.com/Grunny/zap-cli) to simplify attacking a set of endpoints on a given host.

## Configuration

Along with [zap-cli's ZAP_* environment variables](https://github.com/Grunny/zap-cli#usage) that control the underlying zap-cli commands,
the following environment variables are used by the script:

| Name | Meaning | Default |
|---|---|---|
| PATHS_FILE | The location of the file containing newline separated paths to open before running the active scan | /mount/paths.txt |
| EXCLUDE_FILE | The location of the file containing newline separated patterns to be excluded before running the active scan | /mount/excludes.txt |
| BASE_URL | The base url of the target | http://localhost:3000 |
| USE_EXISTING_PROXY | If set to a non-empty string, do not start a new zap proxy | \[empty string\] | 
| REPORT_STDOUT | If set to a non-empty string, print the report to stdout (as well as generate the report in `/zap/wrk`) | \[empty string\] |
| REPORT_FORMAT | Format of the output report (one of: xml, html, md) | md |
| DEBUG | If set to a non-empty string, output will be more verbose | \[empty string\] |

> Note: the PATHS_FILE and EXCLUDE_FILE should end in newlines,
> and a GET request will be made to all URLs in the PATHS_FILE even if they're in the EXCLUDE_FILE
> however, they won't be included in ZAPs active scan

## Examples

### Run a scan of the default endpoints

```bash
docker run -v "$(pwd):/mount" \
           -e 'BASE_URL=http://host.docker.internal:3000' \
           owasp/zap2docker-stable /mount/zap.sh
```

> Note: host.docker.internal currently only works on MacOS as a way to access the external host the docker container is running on

### Use a different set of paths and exclude files

```bash
docker run -v '/path/to/paths.txt:/mount2/paths.txt' \
           -e 'PATHS_FILE=/mount2/paths.txt' \
           -v '/path/to/exclude.txt:/mount2/exclude.txt' \
           -e 'EXCLUDE_FILE=/mount2/exclude.txt' \
           -v "$(pwd):/mount" \
           -e 'BASE_URL=http://host.docker.internal:3000' \
           owasp/zap2docker-stable /mount/zap.sh
```

### Print report to stdout

```bash
docker run -v "$(pwd):/mount" \
           -e 'BASE_URL=http://host.docker.internal:3000' \
           -e 'REPORT_STDOUT=y' \
           owasp/zap2docker-stable /mount/zap.sh
```

### Use an external ZAP instance

```bash
docker run -v "$(pwd):/mount" \
           -e 'ZAP_URL=http://host.docker.internal' \
           -e 'ZAP_PORT=8080'
           -e 'BASE_URL=http://localhost:3000' \
           -e 'USE_EXISTING_PROXY=y' \
           owasp/zap2docker-stable /mount/zap.sh
```

> Note: BASE_URL is the url the proxy uses to access the target,
> so if the proxy is external to docker then a different url is required

## Limitations with HTTPS

Currently, this script doesn't support https.
This is because additional certificates need to be trusted.

To use https you need to:
1. Setup an external ZAP instance
2. Download and install the instance's self signed certificate into the container
  e.g. `sudo cp my.crt /usr/local/share/ca-certificates/ && sudo update-ca-certificates`
3. Ensure the following environment variable is set `REQUESTS_CA_BUNDLE='/etc/ssl/certs/ca-certificates.crt'`
4. Execute the script configured to use the external zap instance
