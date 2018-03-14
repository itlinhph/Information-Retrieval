# -*- coding: utf-8 -*-
import scrapy


class ExampleSpider(scrapy.Spider):
    name = "quotes"

    def start_requests(self):
        urls = [
            'https://batdongsan.com.vn/cho-thue-nha-tro-phong-tro-duong-le-van-sy-phuong-12-1/cao-cap-danh-ban-than-thien-cach-q3-pr14942322',
            # 'http://quotes.toscrape.com/page/2/',
        ]
        for url in urls:
            yield scrapy.Request(url=url, callback=self.parse)

    def parse(self, response):
        page = response.url.split("/")[-2]
        filename = 'quotes-%s.html' % page
        text="";
        with open(filename, 'wb') as f:
            list1=response.css("div.pm-desc::text").extract();
            for senc in list1:
                # print(senc.encode('utf-8'));
                text=text+senc.encode('utf-8')+"\n";
            f.write(text);
            text=""
        self.log('Saved file %s' % filename)
