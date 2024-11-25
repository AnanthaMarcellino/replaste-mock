Langkah-langkah deploy ke GCP

Bikin database nya
Setelah selesai bikin database, jalankan
	gcloud sql instances patch db-replaste --authorized-networks=0.0.0.0/0 --quiet

Masuk kedalam Mysql dengan perintah
	mysql -u root -p -h your_db_ip_public

Bikin database didalam mysql
	CREATE DATABASE replaste;
	USE replaste;

	CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    reset_token VARCHAR(255),
    reset_token_expiry DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
	);

	CREATE TABLE user_images (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
	);

Masuk kedalam folder replaste, lalu jalankan
	gcloud builds submit --tag gcr.io/my-firstproject-441503/replaste-mock #replaste-mock diganti namanya sesuai dengan nama folder nya

Lalu deploy ke cloud run
	gcloud run deploy replaste-mock \
--image gcr.io/my-firstproject-441503/replaste-mock \
--platform managed \
--region asia-southeast2 \
--allow-unauthenticated \
--set-env-vars="\
DB_HOST=34.101.149.62,\
DB_USER=root,\
DB_PASS=123,\
DB_NAME=replaste,\
JWT_SECRET=b7d7e1f0a2c4e6g8i0k2m4o6q8s0u2w4y6a8c0e2g4i6k8m0,\
EMAIL_HOST=smtp.gmail.com,\
EMAIL_PORT=587,\
EMAIL_USER=ananthamarcellino@gmail.com,\
EMAIL_PASS=tprn quix lhls jtts,\
GOOGLE_CLOUD_PROJECT=my-firstproject-441503,\
GOOGLE_CLOUD_BUCKET=replaste_bucket,\
GOOGLE_CLOUD_KEYFILE=./key.json" \
--timeout=300

test pakai postman
	Method POST
	https://replaste-mock-781968692382.asia-southeast2.run.app/auth/login
		Body: raw
		{
    	"email": "masbro.am88@gmail.com",
    	"password": "ubahpassword"
		}
	
	Method POST
	https://replaste-mock-781968692382.asia-southeast2.run.app/auth/register
		Body: raw
		{
    	"email": "masbro.am88@gmail.com",
    	"password": "ubahpassword",
    	"full_name": "123"
		}
	
	Method POST
	https://replaste-mock-781968692382.asia-southeast2.run.app/auth/request-reset
		Body: raw
		{
    	"email": "masbro.am88@gmail.com"
		}
	
	Method POST
	https://replaste-mock-781968692382.asia-southeast2.run.app/auth/reset/{token}
		Body: raw
		{
    	"password": "123"
		}

	Method POST
	https://replaste-mock-781968692382.asia-southeast2.run.app/auth/upload
		Body: form-data:
		image: pilih file
		userId: 1
	
	Method GET
	https://replaste-mock-781968692382.asia-southeast2.run.app/auth/my-images/1