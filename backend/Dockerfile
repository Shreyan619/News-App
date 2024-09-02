FROM ghcr.io/puppeteer/puppeteer:22.15.0

RUN apt-get update && apt-get install -y \
  wget \
  libx11-xcb1 \
  libxcomposite1 \
  libxdamage1 \
  libxrandr2 \
  libxss1 \
  libxtst6 \
  libnss3 \
  libgtk-3-0 \
  --no-install-recommends \
  && rm -rf /var/lib/apt/lists/* \
  && wget https://chromium.cypress.io/Chrome-linux64.zip \
  && unzip Chrome-linux64.zip -d /usr/local/bin/ \
  && rm Chrome-linux64.zip

ENV PUPPETEER_EXECUTABLE_PATH=/usr/local/bin/chrome-linux/chrome

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

CMD ["node", "server.js"]