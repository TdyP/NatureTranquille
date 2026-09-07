FROM node:24-alpine

# Install GDAL for ogr2ogr and ogrinfo
RUN apk add --no-cache gdal gdal-tools

WORKDIR /app

CMD ["sh", "-c", "npm install && npm run db:migrate && npm run dev"]
