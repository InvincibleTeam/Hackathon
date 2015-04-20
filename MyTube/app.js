

$(document).ready(function(){
  var Token;
  var nextToken;
  var prevToken;
  var inputStored;
  var RequestParams;
  var VideoId;
  var Page=1;
  var inputStored;
  var visible=true;
  var s=[];
  var recent;
    $(".Prev").hide();
    $(".Next").hide();
  document.getElementById("head").innerHTML="<table width=\"100%\" border=\"0\"><tr><td aling=\"left\"><div id=\"signout\" align=\"center\"><h2>welcome "+sessionStorage.getItem("username1")+"</h2></div></td><td align=\"right\"><h2 class='QueryTitle'><div id=\"out\" align=\"center\"><a class=\"btn btn-sm btn-warning\" href='signout'>sign out</a><div></h2></td></tr>";
    load_recent();

//When search button is clicked, it will validate if the input is empty, if not it grabs the val() and runs the Access function
  $("#submit").click(function(e){

    Page=1;
    Token='';

    $(".Logo").attr("src","loader.gif");
    $(".Columns").remove();

    e.preventDefault();

    if($("#input").val()=='' || $("#input").val()==" "){
      inputStored="Most Viewed Youtube";
    }else{
      inputStored=$("#input").val();
    }
    Access();

    $("#loader").css('display','block');
    $(".Prev").show();
    $(".Next").show();

    //posting search and user to database
    $.ajax( { url: "https://api.mongolab.com/api/1/databases/group3/collections/recent?apiKey=5gq1g1JubzqFIgdxCK8oDJ6-ec1wyTI5",
		  data: JSON.stringify( { "user" :sessionStorage.getItem("username1"),"s":inputStored} ),
		  type: "POST",
		  contentType: "application/json" } );
    if(recent<10)
    {
      document.getElementById("recent").innerHTML="<h4 class='QueryTitle'><a href='"+inputStored+"'>"+inputStored+"</a></h4>"+document.getElementById("recent").innerHTML;
      recent++;
    }
    else
    {
      var temp=document.getElementById("recent").innerHTML;

      var n = temp.lastIndexOf("<h4");
      //alert(n);
      temp=temp.substring(0,n);
      //alert(temp);
      document.getElementById("recent").innerHTML="<h4 class='QueryTitle'><a href='"+inputStored+"'>"+inputStored+"</a></h4>"+temp;
    }
  });

//if Next is clicked, adds the nextToken to Token to retrieve the next result set
  $(".Next").click(function(){
    Page++;

    //removes all the current videos
    $(".Columns").remove();
    
    Token=nextToken;

    $(".Logo").attr("src","loader.gif");
    
    //runs AJAX again to retrieve the next page token
    Access();
    
    $("#loader").css('display','block');
  });

  //if Prev is clicked, adds the prevToken to Token to retrieve the previous result set
  $(".Prev").click(function(){
    Page--;
    
    if(Page<=0){

      swal({   title: "You reached the beginning of the page!",   text: "can't go back further ", type: "info",  timer: 2450,   showConfirmButton: false });
      
      Page=1;
    }else{
      $(".Logo").attr("src","loader.gif");
      
      $(".Columns").remove();
      
      Token=prevToken;
      
      Access();
      
      $("#loader").css('display','block');
    }
  });

  //if the query title link is clicked, it will load the video on top of the page
  $(".Wrapper").on('click','.QueryTitle a',function(e){
		e.preventDefault();
		
		VideoId=$(this).attr('href');
		
		$("iframe#ClickedVid").remove();

		$(".Video").slideDown('slow').append("<iframe id='ClickedVid' width='980' height='560' src='http://www.youtube.com/embed/"+VideoId+"?autoplay=1' frameborder='0' allowfullscreen></iframe>");
		//alert("You can hide this video by pressing 'Ctrl' on your keyboard");
		$(window.opera ? 'html' : 'html, body').animate({ scrollTop: 180, }, 200);
  });
  $(".header").on('click','.QueryTitle a',function(e){
		e.preventDefault();
    if(localStorage.chkbx){  localStorage.chkbx ='';}

    window.location.href="Login.html";
  });

   $(".se").on('click','.QueryTitle a',function(e){
		e.preventDefault();
		
		var s=$(this).attr('href');


    Page=1;
    Token='';

    $(".Logo").attr("src","loader.gif");
    $(".Columns").remove();

    e.preventDefault();


      inputStored=$(this).attr('href');

    Access();

    $("#loader").css('display','block');
    $(".Prev").show();
    $(".Next").show();
    
    //posting search and user to database

  });
  //When user presses ESC on keyboard, it will hide the video
  $(document).keyup(function(e){
    if(e.keyCode==27){
      if(visible==true)
      {
      $(".Video").fadeOut('slow');
      visible=false;
      }
      else
      {
        $(".Video").show('slow');
        visible=true;
      }
    }
  });


  //Retrieves the data and append them onto the page
  function Clone(Title,Description,Img,Published,Channel,videoID,channelID){
    var $img="<br><img class='ColumnsImg' src='"+Img+"'/>";
    var $h2="<h2 class='QueryTitle'><a href='"+videoID+"'>"+Title+"</a></h2>";
    var $descr="<p class='Description'>"+Description+"</p>";
    var $publish="<p class='Published'>Uploaded on: "+Published.substring(0,10)+"</p>";
    var $Channel="<p class='Channel'>Channel Name: <a href='http://www.youtube.com/channel/"+channelID+"?autoplay=1' target='_blank'>"+Channel+"</a></p>";

    $(".Wrapper").append("<div align='center' class='Columns grid_4 clearfix'><div class='QueryBox'><h2 class='QueryTitle'><a href='"+videoID+"'>"+$img+"</a></div><div class='QueryInfo'>"+$h2+$Channel+$publish+$descr+"<hr width='720'><br></div></div>");
    $(".Navigation").fadeIn("slow");
  }

//This function runs the AJAX to retrieve 20 results when users enter a query string, retrieves the nextPage Token
  function Access(){
    RequestParams={maxResults:20,
	 	   pageToken:Token,
		   order:"relevance",
		   q: inputStored,
		   type: "video",
		   videoType: "any",
		   key:"AIzaSyCJz_BaT38FwqrY5IjQ4fwE5t-z7f6PLjw" }
		   
    var AJAX=$.ajax({url:"https://www.googleapis.com/youtube/v3/search?part=snippet",
		     data: RequestParams,
		     dataType:"jsonp",
		     type:"GET"
		   }).done(function(data){
		   	    $(".Logo").attr("src","youtube.png");
			    $(".feedback").text("There are "+data.items.length+" queries for "+"'"+inputStored+"'"+" on this page");

			    nextToken=data.nextPageToken;
			    prevToken=data.prevPageToken;
			    
			    $.each(data.items,function(index, value){
			      Clone(value.snippet.title,value.snippet.description,value.snippet.thumbnails.medium.url,value.snippet.publishedAt,value.snippet.channelTitle,value.id.videoId,value.snippet.channelId);
			    });
		   }).fail(function(jqXHR, error, errorThrown){
		            $('.feedback').append(error);
	           });
  }
  function load_recent()
  {

    $.get("https://api.mongolab.com/api/1/databases/group3/collections/recent?s={%27_id%27:-1}&q={%27user%27:%27"+sessionStorage.getItem("username1")+"%27}&apiKey=5gq1g1JubzqFIgdxCK8oDJ6-ec1wyTI5", function(data, status){

          recent=data.length;
          if(recent>10)
           recent=10;
          for( var i=0;i<recent;i++)
          {

             document.getElementById("recent").innerHTML+=" <h4 class='QueryTitle'><a href='"+data[i].s+"'>"+data[i].s+"</a></h4>";
          }

        });
  // document.getElementById("recent").innerHTML="test";

  }
});



