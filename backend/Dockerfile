FROM ghcr.io/puppeteer/puppeteer:22.15.0

RUN apt-get update && \
    apt-get install -y wget \
                       libx11-xcb1 \
                       libxcomposite1 \
                       libxdamage1 \
                       libxrandr2 \
                       libxss1 \
                       libxtst6 \
                       libnss3 \
                       libgtk-3-0 && \
    wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb && \
    dpkg -i google-chrome-stable_current_amd64.deb && \
    apt-get -f install -y

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

CMD ["node", "server.js"]