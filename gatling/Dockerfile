FROM openjdk:8-alpine

RUN apk add maven

COPY /src/ /app/src/
COPY /pom.xml /app/pom.xml
WORKDIR /app/

RUN mvn clean initialize

ENTRYPOINT [ "mvn" ]
CMD [ "test" ]