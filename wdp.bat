cd E:\CodeSpace\blogs\docs\.vuepress
scp -r E:\CodeSpace\blogs\docs\.vuepress\dist.zip root@101.200.175.79:/root/upload
ssh root@101.200.175.79 "rm -rf /www/wwwroot/www.brook-w.com/* && unzip /root/upload/dist.zip -d  /root/upload && mv /root/upload/dist/* /www/wwwroot/www.brook-w.com/ && rm -rf /root/upload/dist*"
