-- Dijalankan otomatis oleh image postgres saat volume database masih kosong
-- (lihat mount ./initdb di docker-compose.yml), supaya database storage ikut
-- terbuat di setiap mesin. Untuk volume yang sudah ada, lihat README bagian
-- "Troubleshooting Database".
CREATE DATABASE storage_simanis;
