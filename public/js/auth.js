<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>PHP with JavaScript?</title>
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js"></script>
<div id="fb-root"></div>
<script src="jquery.js"></script>
<script src="http://connect.facebook.net/en_US/all.js"></script>
<?php
 $cache_expire = 60*60*24*365;
 header("Pragma: public");
 header("Cache-Control: max-age=".$cache_expire);
 header('Expires: ' . gmdate('D, d M Y H:i:s', time()+$cache_expire) . ' GMT');
 ?>
<script src="http://connect.facebook.net/en_US/all.js"></script>
(function(d){
     var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement('script'); js.id = id; js.async = true;
     js.src = "//connect.facebook.net/en_US/all.js";
     ref.parentNode.insertBefore(js, ref);
   }(document));
   FB.init({appId: "599475513463359", status: true, cookie: true})
   
   FB.login(function(response){
   if (response.authResponse) { //if the user has logged in successfully
      console.log('You are now logged in');
	  function Redirect(){
	     window.location="http://localhost:8888/upload.html";
		 }
   } else { //problem with logging in
      console.log('User cancelled login or did not fully authorize.');
   }
 }, {scope: 'user_about_me,user_activities,user_birthday});
 
 FB.api({ method: 'fql.query', query: 'SELECT publish_stream, read_friendlists FROM permissions WHERE uid=me()' }, function(resp) {
    for(var key in resp[0]) {
        if(resp[0][key] === "1"){
          console.log(key +' -available');
        }else{
            console.log(key+ ' not available');
      }
  }
});

FB.api('/me/friends', {fields: 'id,first_name,last_name,username'}, function(response){

  for(var x in obj.data){
  var field = obj.data[x];
  
  var id = field['id'];
  var firstname = field['first_name'];
  var lastname = field['last_name'];
  var username = field['username'];
  
  console.log("first_name: " + firstname + "\nlast_name: " + lastname + "\nid: " + id + "\nusername: " + username);
  }
});         