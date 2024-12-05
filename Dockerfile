# Gunakan Node.js versi 20 sebagai base image
FROM node:20.18.1

# Tentukan working directory di dalam container
WORKDIR /usr/src/app

# Set environment variables (PORT dan MODEL_URL)
ENV PORT 9000
ENV MODEL_URL 'https://storage.googleapis.com/model-storage-rivan/model.json'

# Salin package.json dan package-lock.json untuk cache instalasi dependency
COPY package*.json ./

# Install dependencies
RUN npm install

# Salin semua file proyek ke dalam container
COPY . .

# Expose port yang digunakan aplikasi (disesuaikan dengan Cloud Run)
EXPOSE 9000

# Tentukan command untuk menjalankan aplikasi
CMD ["npm", "run", "start"]
