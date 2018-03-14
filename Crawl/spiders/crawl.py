# -*- coding: utf-8 -*-
import scrapy
import time
import datetime
import pysolr
class ExampleSpider(scrapy.Spider):
    name = "vnexpress"
    solr = pysolr.Solr('http://localhost:8983/solr/nhom8/', timeout=10)
    arc_count=0
    contents=[]
    listurl=[]
    # wget --mirror --convert-links --adjust-extension --page-requisites http://vietnamnet.vn/ -c

    def start_requests(self):
        url1="https://vnexpress.net/tin-tuc/thoi-su/"
        url2="https://vnexpress.net/tin-tuc/the-gioi/"
        url3="https://kinhdoanh.vnexpress.net/"
        url4="https://giaitri.vnexpress.net/"
        url5="https://thethao.vnexpress.net/"
        self.listurl.append(url1)
        self.listurl.append(url2)
        self.listurl.append(url3)
        self.listurl.append(url4)
        self.listurl.append(url5)
        for url in listurl:
            yield scrapy.Request(url=url, callback=self.parse_url)
    def parse_url(self, response):
        list_url = response.css("h3.title_news a::attr(href)").extract()
        list_next_url = response.css("div.pagination a::attr(href)").extract()
        for next_url in list_next_url:
            if(next_url not in self.listurl):
                self.listurl.append(next_url)
        del list_url[1::2]
        time.sleep(5)
        for sub_url in list_url:
            if(self.arc_count<2000):
                yield scrapy.Request(url=sub_url, callback=self.parse_arc)
            else:
                pass

    def parse_arc(self, response):
        self.arc_count+=1
        ts=str(time.time())

        url=response.url

        title = response.css("h1.title_news_detail::text").extract()
        if(len(title)!=0):
            title = title[0]

            text=""
            article=response.css("article.content_detail p")
            for p in article:
                t1=p.css("p::text").extract()
                for txt in t1:
                    text=text+txt
                sp1=p.css("span::text").extract()
                for txt in sp1:
                    text=text+txt

            content={"id":ts,"origin":"8","url":url,"title":title,"content":text}
            self.solr.add(self.content)
        else:
            pass