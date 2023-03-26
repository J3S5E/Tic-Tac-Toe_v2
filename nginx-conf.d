events {}
http {

    access_log off;

    server {
        listen       80;
        listen  [::]:80;
        server_name  localhost;

        location /api/ {
            proxy_pass http://server:3001/api/;
        }

        location / {
            proxy_pass http://client:3000/;
        }
        
    }

}