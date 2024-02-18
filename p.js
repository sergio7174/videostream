<%- include ("includes/header") %>

<div class="container-fluid pb-0">
 <div class="video-block section-padding">
  <div class="row">
   <div class="col-md-8">
    <div class="single-video-left">
     
     <!----- container vodeo player -->
      <div class="single-video">
      <br>
      <br>
      <hr>
      <br>
     

      <% if (currentUser) { %> <!---- si hay una session - login complete-->

        <!-- show buttons to edit and delete actions -->
      <button class="btn btn-success"><a href="/edit?v=<%= video.watch %>" style="color: white">Edit Video</a></button>&nbsp&nbsp&nbsp&nbsp
      <button class="btn btn-danger"><a href="/delete-video?v=<%= video.watch %>" style="color: white">Erase Video</a></button>
      <br>
      <br>
      <br>
      <br>
      <% } %>
  
      <!----------------------- video player on page ---------------->
      <video
      id="videoPlayer"
      class="video-js"
      controls
      width="760"
      height="400"
      preload="auto"
      data-setup="{}"
      poster="<%= video.thumbnail.replace("public", ""); %>">
      <!---el replace en el filepath es para cuadrar la ruta, ya que el algoritmo
           esta diseñado para public/video y los archivos estaticos estan en la ruta
           por debajo de public/ -->
      <source src="<%= video.filePath.replace("public", ""); %>" type="video/mp4" />
      
        <source src="<%= video.filePath.replace("public", ""); %>" type="video/webm" />
          
        <!--<p class="vjs-no-js">
            To view this video please enable JavaScript, and consider upgrading to a
            web browser that
            <a href="https://videojs.com/html5-video-support/" target="_blank"
            >supports HTML5 video</a
            >
          </p> -->

        </video>

          <!------------------end block video player on page ---------------->



      </div>

      <div class="single-video-title box mb-3">
        <h2 id="videoTitleHeading">
         <%= video.title %>
       </h2>

       <p class="mb-0"><i class="fas fa-eye"></i> <%= video.views %> views</p>
</div>

<!------------- begining block single video author inf about author -->
<div class="single-video-author box mb-3">

<!-- Here the objects video and user from userController action get(video-page)
      are converter into req.body to pass throught the new action in userControllers it
    could be /do-comment -or reply , etc... -->

  <div class="float-right">

    <input type="hidden" id="videoId" value="<%= video._id %>">
    <input type="hidden" id="userId" value="<%= user._id %>">
    <input type="hidden" id="category" value="<%= video.category %>">
    <input type="hidden" id="videoTitle" value="<%= video.title %>">
    <input type="hidden" id="watch" value="<%= video.watch %>">
    <input type="hidden" id="filePath" value="<%= video.filePath %>">
    <input type="hidden" id="minutes" value="<%= video.minutes %>">
    <input type="hidden" id="seconds" value="<%= video.seconds %>">
    <input type="hidden" id="thumbnail" value="<%= video.thumbnail %>">

</div>


<img class="img-fluid" style="object-fit: cover;" src="<%= /*video.user.image*/ %>" onerror="this.src = 'public/img/user_placeholder.jpg'" alt="">




<!--
<p><a href="/channel?c=<%= video.id %>"><strong><%= video.firstName + " " + video.lastName %></strong></a> <span title="" data-placement="top" data-toggle="tooltip" data-original-title="Verified"><i class="fas fa-check-circle text-success"></i></span></p>
<small>Published on <%
var createdAt = new Date(video.createdAt);
var date = createdAt.getDate() + "";
%>
<%= date.padStart(2, "0") + " " + months[createdAt.getMonth()] + ", " + createdAt.getFullYear() %>
</small>




</div>
<!------------- end block single video author inf about author -->





<div class="single-video-info-content box mb-3">
  <h6>Category :</h6>
  <p><%= video.category %></p>
  <h6>Description :</h6>
  <p><%= video.description %></p>
  <h6>Tags :</h6>
  <p class="tags mb-0">
   
   <!----to order tag inf, take away spaces, and separate each other with , -->
    <%
   tags = video.tags.split(",");
   tags.forEach (function (tag) {
     tag = tag.trim();
     %>
   
   
     <span><%= tag %>,</span>
     <% }) %>
   </p>
 </div>

 <script type="text/javascript">
  function postComment() {
   var inputComment = document.getElementById("input-comment").value;

   var ajax = new XMLHttpRequest();
   ajax.open("POST", "/do-comment", true);
   ajax.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

   ajax.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
     var res = JSON.parse(this.resText);

     var html = "";
     html += '<div class="row">';
     html += '<div class="col-md-2">';
     html += '<img style="border-radius: 50%;" src="' + response.user.image + '" class="img-fluid" onerror="this.src = \'/img/user_placeholder.jpg\'">';
     html += '</div>';

     html += '<div class="col-md-10">';
     html += '<h3>' + res.user.firstName + ' ' + res.user.lastName + '</h3>';
     html += '<p>' + res.comment + '</p>';
     html += '</div>';
     html += '</div>';
     document.getElementById("comments").innerHTML = html + document.getElementById("comments").innerHTML;
     document.getElementById("input-comment").value = "";
   }
 };

 var videoId = document.getElementById("videoId").value;
 ajax.send("comment=" + inputComment + "&videoId=" + videoId);
}

function postReply(node) {
  var commentId = node.getAttribute("data-comment-id");
  var reply = node.previousElementSibling.querySelector("textarea").value;

  var ajax = new XMLHttpRequest();
  ajax.open("POST", "/do-reply", true);
  ajax.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  ajax.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var res = JSON.parse(this.resText);

      var html = "";
      html += '<div class="row">';
      html += '<div class="col-md-2">';
      html += '<img style="border-radius: 50%;" src="' + res.user.image + '" class="img-fluid" onerror="this.src = \'/img/user_placeholder.jpg\'">';
      html += '</div>';

      html += '<div class="col-md-10">';
      html += '<h3>' + res.user.firstName + ' ' + res.user.lastName + '</h3>';
      html += '<p>' + res.reply + '</p>';
      html += '</div>';
      html += '</div>';
      document.getElementById("replies").innerHTML = html + document.getElementById("replies").innerHTML;
      node.previousElementSibling.querySelector("textarea").value = "";
    }
  };

  ajax.send("commentId=" + commentId + "&reply=" + reply);
}

function createReplyNode(node) {
  var commentId = node.getAttribute("data-comment-id");
  var html = ""
  html += '<div class="row">';
  html += '<div class="col-sm-12">';
  html += '<div class="form-group">';
  html += '<label class="control-label">Write reply</label>';
  html += '<textarea class="form-control border-form-control" id="input-comment"></textarea>';
  html += '</div>';

  html += '<button type="button" class="btn btn-outline-secondary" data-comment-id="' + commentId + '" onclick="postReply(this);">Post</button>';
  html += '</div>';
  html += '</div>';
  node.innerHTML = html;
  node.removeAttribute("onclick");
  node.style.width = "100%";
}
</script>

<div class="single-video-info-content box mb-3">
  <h6>Comments :</h6>
  <% if (isLogin) { %>
  <div class="row">
    <div class="col-sm-12">
     <div class="form-group">
      <label class="control-label">Write comment</label>
      <textarea class="form-control border-form-control" id="input-comment"></textarea>
    </div>

    <button type="button" class="btn btn-outline-secondary" onclick="postComment();">Post</button>
  </div>
</div>
<% } %>  

<style type="text/css">
 #comments {
  margin-top: 20px;
}
#comments .row {
  margin-top: 20px;
}
#replies {
  max-height: 300px;
  overflow-y: scroll;
  overflow-x: hidden;
}
/* width */
#replies::-webkit-scrollbar {
 width: 10px;
}
/* Track */
#replies::-webkit-scrollbar-track {
 background: #f1f1f1;
}
/* Handle */
#replies::-webkit-scrollbar-thumb {
 background: #888;
}
/* Handle on hover */
#replies::-webkit-scrollbar-thumb:hover {
 background: #555;
}
</style>

<div id="comments">

  

  <% if (video.comments) { video.comments = video.comments.reverse(); video.comments.forEach(function (comment) { %>


    <div class="row" id="comment-<%= comment._id %>">
      <div class="col-md-2">
       <img style="width: 100px; border-radius: 50%;" src="<%= /*comment.user.image*/ %>" class="img-fluid" onerror="this.src = '/img/user_placeholder.jpg'">
     </div>
   
     <div class="col-md-10">
       <h3><%= video.firstName + " " + video.lastName  %></h3>
   
       <!---- The way to look for information it is in database (any), video.firstname, it is
       in main root of database, comment.comment it is at : root: comments - comment on video
       collection in database (any), so comment.comment it is inside comments - comment  -->
   
       <p><%=  comment.comment  %></p>
       <div id="replies" style="margin-top: 50px;">
        
        
         <% if (comment.replies) { comment.replies = comment.replies.reverse(); comment.replies.forEach(function (reply) { %>
         <div class="row">
           <div class="col-md-2">
            <img style="width: 100px; border-radius: 50%; height: 100px; object-fit: cover;" src="<%= /*comment.user.image*/ %>" class="img-fluid" onerror="this.src = '/img/user_placeholder.jpg'">
          </div>
   
          <div class="col-md-10">
           <h3><%= comment.author.firstName + " " + comment.author.lastName %></h3>
           <p><%= reply.reply %></p>
         </div>
       </div>
       <% }) } %>
     </div>
   
   
   
     <% if (isLogin) { %>
     <div style="float: right; cursor: pointer;" class="text-info" onclick="createReplyNode(this);" data-comment-id="<%= comment._id %>">
      Reply
    </div>
    <% } %>
   </div>
   </div>
   <% }) } %>



</div>
</div>

</div>
</div>

<div class="col-md-4">
  <div class="single-video-right">
   <div class="row">
    <div class="col-md-12" style="padding-left: 0px; padding-right: 0px;">
     <div class="adblock">
      <div class="img">
       Google AdSense<br>
       336 x 280
     </div>
   </div>
 </div>

<div id="related-videos" class="col-md-12">

</div>

</div>
</div>
</div>
</div>
</div>
</div>
<!-- /.container-fluid -->

<script type="text/javascript">
  var category = document.getElementById("category").value;
  var videoId = document.getElementById("videoId").value;

  $(function () {
    var ajax = new XMLHttpRequest();
    ajax.open("GET", "/get-related-videos?category=" + category + "&videoId=" + videoId, true);

    ajax.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
       var videos = JSON.parse(this.responseText);
       var html = "";

       for (var a = 0; a < videos.length; a++) {
         

      var createdAt = new Date(videos[a].createdAt);
      var date = createdAt.getDate() + "";
      date = date.padStart(2, "0") + " " + months[createdAt.getMonth()] + ", " + createdAt.getFullYear()

      html += '<div class="row">';
      html += '<div class="col-md-5">';
      html += '<a class="play-icon" href="watch?v=' + videos[a].watch + '"><i class="fas fa-play-circle"></i></a>';
      // html += '<a href="watch?v=' + videos[a].watch + '"><video style="width: 150px; height: 100px; object-fit: cover;" src="' + videos[a].filePath + '"></video></a>';
      html += '<a href="watch?v=' + videos[a].watch + '"><img style="width: 150px; height: 100px; object-fit: cover;" src="' + videos[a].thumbnail + '"></a>';
      html += '<div class="time" style="right: 5px; bottom: 12px;">' + videos[a].minutes + ":" + videos[a].seconds + '</div>';
      html += '</div>';

      html += '<div class="col-md-7">';
      html += '<div class="video-title">';
      html += '<a href="watch?v=' + videos[a].watch + '">' + videos[a].title + '</a>';
      html += '</div>';

      html += '<div class="video-page text-success">';
      html += videos[a].category + '  <a title="' + videos[a].title + '" data-placement="top" data-toggle="tooltip" href="javascript:void(0);" data-original-title="Verified"><i class="fas fa-check-circle text-success"></i></a>';
      html += '</div>';

      html += '<div class="video-view">';
      html += videos[a].views + ' views &nbsp;<i class="fas fa-calendar-alt"></i> ' + date;
      html += '</div>';
      html += '</div>';
      html += '</div>';
    }

    document.getElementById("related-videos").innerHTML = html;

    var videos = document.getElementById("related-videos").querySelectorAll("video");
    for (var a = 0; a < videos.length; a++) {
     videos[a].currentTime = 10;
   }
 }
};

ajax.send();
});
</script>

<%- include ("includes/footer") %>
