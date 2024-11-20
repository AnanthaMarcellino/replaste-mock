.env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=your_db
JWT_SECRET=development_secret (bisa diganti kalo mau)
PORT=3000 (bisa diubah)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=ananthamarcellino@gmail.com (Bisa diubah pake email sendiri)
EMAIL_PASS=tprn quix lhls jtts (Bisa di ubah pake app password pribadi, plis jangan di share app password gw)

Langkah-Langkah
1. npm install
2. bikin database nama bebas
SQL: CREATE TABLE `users` (
  `id` int NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `reset_token` varchar(255) DEFAULT NULL,
  `reset_token_expiry` datetime DEFAULT NULL
)

## Eksekusi setelah bikin table users
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;
COMMIT;

3. npm run start
4. test pake method POST dan GET
	## Disarankan pake gmail pribadi untuk test reset password
	POST localhost:{port}/auth/register
		body: raw
			{
    			"email": "{email}",
    			"password": "{password}",
			"full_name": "{nama}"
			}

	POST localhost:{port}/auth/login
		body: raw
			{
    			"email": "{email}",
    			"password": "{password}"
			}

	GET localhost:{port}/auth/profile
		header:
		key: Authorization
		value: Bearer {token}

	POST localhost:{port}/password/request-reset
		body: raw
			{
    			"email": "{email}"
			}

	## Cek token baru di gmail
	POST localhost:{port}/password/reset/{token}
		body: raw
			{
    			"password": "{password baru}"
			}