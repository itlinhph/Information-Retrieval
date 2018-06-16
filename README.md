Retrieval-Infomation
=======================
Intro:
----------------
- Website Search Engine with Solr  
- Import data: nhom8_export.json
  + ~/solr/bin/solr start
  + ~/solr/bin/solr create -c IT4853
- Go: localhost:8983 and import data 
> + Readmore at http://lucene.apache.org/solr/guide/7_3/solr-tutorial.html 

Config
-----------------------
Go: Core Selector --> IT4853 --> Schema --> Add copy field:
- Sorce: *
- Destination: _text_
==> Add CopyField

Run
-----------------------
Open index.html and enjoy it. :)

Contact
-----------------------
Copyright by LinhPhan 
Contact me: https://fb.com/deluxe.psk

Video demo: https://youtu.be/lPHcQ3DFoSc
