#!/usr/bin/env bash

echo $PATH

set -euo pipefail

[ -n "${PATHS_FILE-}" ] || PATHS_FILE="./paths.txt"
[ -n "${EXCLUDE_FILE-}" ] || EXCLUDE_FILE="./exclude.txt"
[ -n "${BASE_URL-}" ] || BASE_URL="http://localhost:3000"
[ -n "${ZAP_API_KEY-}" ] || ZAP_API_KEY="$(openssl rand -base64 32)"
[ -n "${REPORT_STDOUT-}" ] || REPORT_STDOUT=""
[ -n "${REPORT_FORMAT-}" ] || REPORT_FORMAT="md"
[ -n "${USE_EXISTING_PROXY-}" ] || USE_EXISTING_PROXY=""

[ -z "${USE_EXISTING_PROXY}" ] && zap-cli start

while read URL_PATTERN; do
  [ -n "$URL_PATTERN" ] && zap-cli open-url "${BASE_URL}${URL_PATTERN}"
done < "$PATHS_FILE"

while read PATTERN; do
  [ -n "$PATTERN" ] && zap-cli exclude "${BASE_URL}${PATTERN}"
done < "$EXCLUDE_FILE"

zap-cli active-scan --scanners all --recursive "${BASE_URL}"

mkdir --parents /zap/wrk
REPORT_FILE='$(mktemp --tmpdir=/zap/wrk)'

zap-cli report --output "${REPORT_FILE}" --output-format "$REPORT_FORMAT"

echo "report located at: ${REPORT_FILE}" 1>&2

[ -n "${REPORT_STDOUT}" ] && cat "$REPORT_FILE"

[ -z "${USE_EXISTING_PROXY}" ] && zap-cli shutdown
