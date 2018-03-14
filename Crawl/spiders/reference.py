# -*- coding: utf-8 -*-
import scrapy
import time
import datetime
import pysolr

class ExampleSpider(scrapy.Spider):
    name = "refe"
    page_count=0
    arc_count=0
    solr = pysolr.Solr('http://localhost:8983/solr/it4853/', timeout=10)
    list_url=[]
    contents=[]
    def start_requests(self):
        start_url ='https://batdongsan.com.vn/nha-dat-cho-thue/p'
        start_page=1;
        stop_page=60;
        for current_page in range(start_page, stop_page):
            url=start_url+str(current_page);
            print(url)
            yield scrapy.Request(url=url, callback=self.parse_url)

            url=""
        # for url in urls:

        self.log("===="+str(self.list_url))


    def parse_url(self, response):
        # page = response.url.split("/")[-2]
        # ts=time.time()
        self.page_count+=1
        # st=datetime.datetime.fromtimestamp(ts).strftime('%Y-%m-%d %H:%M:%S')
        filename = 'refe-bds.c.v-thue-%s.html' % self.page_count
        text="";
        with open(filename, 'wb') as f:
            list_sub_url = response.css("a.product-avatar::attr(href)").extract()
            # url=""
            for sub_url in list_sub_url:
                # print("https://batdongsan.com.vn"+sub_url);
                if (sub_url!='javaScript:void(0)'):
                    std_url="https://batdongsan.com.vn"+sub_url;
                    text=text+std_url+"\n"
                    yield scrapy.Request(url=std_url, callback=self.parse_arc)
                    self.list_url.append(std_url);
            # solr.add(self.contents)
            # print ("---------->")
            # # time.sleep(3)
            # for i in range(1,10000):
            #     pass
            # print (self.contents)
            # print ("<----------")
            # f.write(text);

        self.log('Saved file %s' % filename)

    def parse_arc(self, response):
        self.arc_count+=1
        ts=str(time.time())+str(self.arc_count)
        text="";
        # with open(filename, 'wb') as f:
        list1=response.css("div.pm-desc::text").extract();
        title=response.css("title::text").extract()[0];

        for senc in list1:
            # print(senc.encode('utf-8'));
            text=text+senc+"\n";

        content={"id":ts,"content":text,"title":title}
        self.contents.append(content);

        if (self.arc_count % 10==0):
            self.solr.add(self.contents)
            self.contents=[]
            # print(self.contents)
        # print text
        # print (":::====::::")
        # print title
            # f.write(text);
            # text=""
        # self.log('Saved file ==%s' % filename)
