The zap.sh script can be ran using the official zap docker image owasp/zap2docker-stable

## Configuration

Along with standard ZAP* environment variables that control ZAP's behaviour,
the following environment variables are used by the script:

| Name | Meaning | Default |
|---|---|---|
| PATHS_FILE | The location of the file containing newline separated paths to open before running the active scan | ./paths.txt |
| EXCLUDE_FILE | The location of the file containing newline separated patterns to be excluded before running the active scan | ./excludes.txt |
| BASE_URL | The base url of the target | http://localhost:3000 |
| USE_EXISTING_PROXY | If set to a non-empty string, do not start a new zap proxy | \[empty string\] | 
| REPORT_STDOUT | If set to a non-empty string, print the report to stdout (as well as generate the report in `/zap/wrk`) | \[empty string\] |
| REPORT_FORMAT | Format of the output report (one of: xml, html, md) | md |

## Example

```bash
docker run -v $(pwd):/mount -e BASE_PATH='http://host.docker.internal:3000' -it owasp/zap2docker-stable /mount/zap.sh
```

> Note: host.docker.internal currently only works on MacOS