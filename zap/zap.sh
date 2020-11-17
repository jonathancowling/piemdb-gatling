#!/usr/bin/env bash

set -Eeuo pipefail

function on_exit() {
  LAST_COMMAND_EXIT_CODE=$?
  [ -z "${USE_EXISTING_PROXY}" ] && zap-cli shutdown >&2
  exit $LAST_COMMAND_EXIT_CODE
}

trap on_exit SIGINT EXIT

[ -n "${PATHS_FILE-}" ] || PATHS_FILE="./paths.txt"
[ -n "${EXCLUDE_FILE-}" ] || EXCLUDE_FILE="./exclude.txt"
[ -n "${BASE_URL-}" ] || BASE_URL="http://localhost:3000"
[ -n "${ZAP_API_KEY-}" ] || export ZAP_API_KEY="$(openssl rand -base64 32)"
[ -n "${REPORT_STDOUT-}" ] || REPORT_STDOUT=""
[ -n "${REPORT_FORMAT-}" ] || REPORT_FORMAT="md"
zap-cli status >&2 && USE_EXISTING_PROXY="yes"
[ -n "${USE_EXISTING_PROXY-}" ] || USE_EXISTING_PROXY=""

[ -z "${USE_EXISTING_PROXY}" ] && zap-cli start --start-options "-config api.key=$ZAP_API_KEY" >&2
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
