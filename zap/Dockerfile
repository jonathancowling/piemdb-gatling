FROM owasp/zap2docker-stable

COPY /zap.sh /app/zap.sh
COPY /exclude.txt /paths.txt /mount/

ENTRYPOINT [ "/app/zap.sh" ]
