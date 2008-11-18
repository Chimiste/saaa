ant dist
rem adt -certificate -cn saaa 2048-RSA dist/xiaobaihe.pfx 77261
rem adt -package -storetype pkcs12 -keystore xiaobaihe.pfx -storepass 77261 dist/xiaobaihe.air application.xml  index.html lib/* styles/* icons/* images/* html/*.html