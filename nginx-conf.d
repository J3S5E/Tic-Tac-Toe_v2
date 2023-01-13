events {}
http {

    access_log off;

    server {
        listen       80;
        listen  [::]:80;
        server_name  localhost;

        large_client_header_buffers 8 64k;

        location / {
            proxy_pass http://client:3000/;
        }
        
    }

}