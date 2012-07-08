<?php
/**
* Google Trends API PHP Library
* Version: 1.0
*
* Author: bbayer
*/
 
class GoogleTrendsAPI {
 
    private $trendsfeeduri='http://www.google.ca/trends/hottrends/atom/hourly';
 
    public function get_trends()
    {
        $c = curl_init($this->trendsfeeduri);
        curl_setopt($c, CURLOPT_RETURNTRANSFER, 1);
        $feeddata = curl_exec($c);
        curl_close($c);    
        return $this->parse_trend_feed($feeddata);
    }
 
 
    private function parse_trend_feed($data)    
    {
        preg_match_all('/.+?<a href=".+?">(.+?)<\/a>.+?/',$data,$matches);
        return $matches[1];
    }
}
?>