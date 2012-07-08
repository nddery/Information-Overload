<?php
// inlcude GoogleTrendsAPI
include 'GoogleTrendsAPI.php';
// instantiate it and get the trends
$trends = new GoogleTrendsAPI();
$keywords = $trends->get_trends(); // returns an array
// json encode it and echo the keywords for AJAX to grab
echo json_encode($keywords);
exit();
