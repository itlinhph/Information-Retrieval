# Retrieval-Infomation
Website Search Engine with Solr  
Import data: nhom8_export.json
~/solr/bin/solr start
~/solr/bin/solr create -c IT4853
Go: localhost:8983 and import data (Readmore at docs of Solr)
-----------------------
Go: Core Selector --> IT4853 --> Schema --> Add copy field:
- Sorce: *
- destination: _text_
==> Add CopyField
-----------------------
Open index.html and enjoy it. :)
-----------------------
Doc create by: linkpp