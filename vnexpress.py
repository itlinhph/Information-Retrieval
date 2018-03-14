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

    def start_requests(self):
        url1="https://vnexpress.net/tin-tuc/thoi-su/"
        url2="https://vnexpress.net/tin-tuc/the-gioi/"
        url3="https://kinhdoanh.vnexpress.net/"
        url4="https://giaitri.vnexpress.net/"
        url5="https://thethao.vnexpress.net/"
        listurl=[]
        listurl.append(url1)
        listurl.append(url2)
        listurl.append(url3)
        listurl.append(url4)
        listurl.append(url5)
        for page in range(1,11):
            url=url1+"page/"+str(page)+".html"
            listurl.append(url)
            url=url2+"page/"+str(page)+".html"
            listurl.append(url)
            url=url3+"page/"+str(page)+".html"
            listurl.append(url)
            url=url4+"page/"+str(page)+".html"
            listurl.append(url)
            url=url5+"page/"+str(page)+".html"
            listurl.append(url)
            pass
        for url in listurl:
            yield scrapy.Request(url=url, callback=self.parse_url)
    def parse_url(self, response):
        list_url = response.css("h3.title_news a::attr(href)").extract()
        del list_url[1::2]
        # print (list_url)
        time.sleep(5)
        for sub_url in list_url:
            if(self.arc_count<2000):
                yield scrapy.Request(url=sub_url, callback=self.parse_arc)
            else:
                pass
        # yield scrapy.Request(url=list_url[0], callback=self.parse_arc)

    def parse_arc(self, response):
        self.arc_count+=1
        ts=str(time.time())+str(self.arc_count)

        url=response.url

        title = response.css("h1.title_news_detail::text").extract()

        print("======>")
        # pr
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
            self.contents.append(content);
            if (self.arc_count % 10==0):
                self.solr.add(self.contents)
                self.contents=[]
        else:
            pass
        # print("text===========>")
        # print (text)
        # print("text===========>")
