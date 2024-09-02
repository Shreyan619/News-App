FROM ghcr.io/puppeteer/puppeteer:22.15.0

RUN apt-get update && apt-get install -y \
  wget \
  unzip \
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
  && wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb \
  && dpkg -i google-chrome-stable_current_amd64.deb \
  && apt-get -f install -y \
  && rm google-chrome-stable_current_amd64.deb

  RUN which google-chrome || true

# ENV PUPPETEER_EXECUTABLE_PATH=/usr/local/bin/chrome-linux/chrome

WORKDIR /.

COPY package*.json ./
RUN npm install

COPY . .

CMD ["node", "server.js"]
