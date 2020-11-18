#!/usr/bin/env bash

set -Eeuo pipefail

function on_exit() {
  LAST_COMMAND_EXIT_CODE=$?
  [ -z "${USE_EXISTING_PROXY}" ] && [ "${PROXY_ALREADY_RUNNING}" -ne "0" ] && zap-cli shutdown >&2
  exit $LAST_COMMAND_EXIT_CODE
}

trap on_exit EXIT

export ZAP_PATH
export ZAP_PORT
export ZAP_URL
export ZAP_API_KEY
export ZAP_LOG_PATH

ERROR="\e[91m[ERROR]\e[0m          "
tty > /dev/null || ERROR="[ERROR]          "

[ -n "${PATHS_FILE-}" ] || PATHS_FILE="/mount/paths.txt"
[ -n "${EXCLUDE_FILE-}" ] || EXCLUDE_FILE="/mount/exclude.txt"
[ -n "${BASE_URL-}" ] || BASE_URL="http://localhost:3000"
[ -n "${ZAP_API_KEY-}" ] || ZAP_API_KEY="$(openssl rand -base64 32)"
[ -n "${ZAP_URL-}" ] || ZAP_URL="http://localhost"
[ -n "${ZAP_PORT-}" ] || ZAP_PORT="8080"
[ -n "${ZAP_PATH-}" ] || ZAP_PATH="/zap"
[ -n "${ZAP_LOG_PATH-}" ] || ZAP_LOG_PATH="/zap"
[ -n "${REPORT_STDOUT-}" ] || REPORT_STDOUT=""
[ -n "${REPORT_FORMAT-}" ] || REPORT_FORMAT="md"
[ -n "${USE_EXISTING_PROXY-}" ] || USE_EXISTING_PROXY=""
[ -n "${DEBUG-}" ] || DEBUG=""

# `zap-cli status` doesn't work in this case for external zap instances
# this is because it doen't proxy a request to http://zap via $ZAP_URL (it instead tries to call it directly)
# instead we can cURL the endpoint `zap-cli status` sends its request to and proxy
PROXY_ALREADY_RUNNING=0
curl --proxy "$ZAP_URL:$ZAP_PORT?apiKey=$ZAP_API_KEY" http://zap/ &>/dev/null || PROXY_ALREADY_RUNNING=$?
[ -z "$USE_EXISTING_PROXY" ] && [ "$PROXY_ALREADY_RUNNING" -eq "0" ] && echo -e "$ERROR proxy already running" >&2 && exit 1
[ -n "$USE_EXISTING_PROXY" ] && [ "$PROXY_ALREADY_RUNNING" -ne "0" ] && echo -e "$ERROR proxy not running" >&2 && exit 1

ZAP_EXTRA_FLAGS=""
[ -n "$DEBUG" ] && ZAP_EXTRA_FLAGS="--verbose"
[ -z "$USE_EXISTING_PROXY" ] && zap-cli $ZAP_EXTRA_FLAGS start --start-options "-config api.key=$ZAP_API_KEY" >&2
unset ZAP_EXTRA_FLAGS

zap-cli session new

while read URL_PATTERN; do
  [ -n "$URL_PATTERN" ] && zap-cli open-url "${BASE_URL}${URL_PATTERN}" >&2
done < <( sed '/^$/d; /^\s*#/d' "$PATHS_FILE" )

while read PATTERN; do
  [ -n "$PATTERN" ] && zap-cli exclude "${BASE_URL}${PATTERN}" >&2
done < <( sed '/^$/d; /^\s*#/d' "$EXCLUDE_FILE" )

zap-cli active-scan --scanners all --recursive "${BASE_URL}" >&2

mkdir --parents /zap/wrk
REPORT_FILE="$(mktemp --tmpdir=/zap/wrk --suffix ".$REPORT_FORMAT")"

zap-cli report --output "${REPORT_FILE}" --output-format "$REPORT_FORMAT" >&2

[ -n "${REPORT_STDOUT}" ] && cat "$REPORT_FILE"
