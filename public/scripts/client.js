/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

function tweetSubmitHandlet(e) {
  e.preventDefault();
  let errorMessage ='';
  const data = $(e.target).serialize();
  if (data && data.length > 5 && data.length <= 145) {
    $.ajax({
      url: '/tweets',
      method: 'POST',
      data: data,
      success:(successData)=>{
        e.target.reset();
        addNewTweetToContainer(successData.tweet);
      }
    });
  } else if (data.length > 145){
    errorMessage = 'Tweet content is too long';
  }
  else {
    errorMessage = 'Tweet is not present';
  }

  showNewTweetErrorMessage(errorMessage);
}

function showNewTweetErrorMessage(message){
  if(message.length){
    $('.new-tweet-error').text(message).slideDown();
  } else {
    $('.new-tweet-error').slideUp();
  }
}

function renderTweets(tweets) {
  const $container = $('#tweets-container');
  $container.empty();
  for (let tweet of tweets) {
    addNewTweetToContainer(tweet);
  }
}

function addNewTweetToContainer(tweetData){
  const $container = $('#tweets-container');
  let $tweetElm = createTweetElement(tweetData);
  $container.prepend($tweetElm);
}
function createTweetElement2(tweetData) {
  const markup = `<article class="tweet-container">
    <header class="tweet-header">
     <span class="tweet-user">
       <img src="${tweetData.user.avatars}" class="tweet-user-image"></img>
       <span class="tweet-user-name">${tweetData.user.name}</span>
     </span>
     <span class="tweet-user-handle">${tweetData.user.handle}</span>

   </header>
   <div class="tweet-body">${tweetData.content.text}</div>
   <footer class="tweet-footer">
     <span>${timeago.format(tweetData.created_at)}</span>
     <span class="tweet-icon-group">
       <i class="fas fa-flag"></i>
       <i class="fas fa-retweet"></i>
       <i class="fas fa-heart"></i>
     </span>
   </footer>
 </article>`;

  return $(markup);
}
function createTweetElement(tweetData) {
  const $tweet = $('<article>', {
    class: "tweet-container"
  });

  const $tweetHeader = $(`<header class="tweet-header">
    <span class="tweet-user">
      <img class="tweet-user-image"></img>
      <span class="tweet-user-name"></span>
    </span>
    <span class="tweet-user-handle"></span>
    </header>`);

  $tweetHeader.find('.tweet-user-handle')
    .text(tweetData.user.handle);

  $tweetHeader.find('.tweet-user-name')
    .text(tweetData.user.name);

  $tweetHeader.find('img')
    .attr('src', tweetData.user.avatars);

  const $tweetBody = $('<div>', {
    class: "tweet-body",
  }).text(tweetData.content.text);

  const $tweetFooter = $(`<footer class="tweet-footer">
    <span class="tweet-creation-time"></span>
    <span class="tweet-icon-group">
      <i class="fas fa-flag"></i>
      <i class="fas fa-retweet"></i>
      <i class="fas fa-heart"></i>
    </span>
  </footer>`);

  $tweetFooter.find('.tweet-creation-time')
    .text(timeago.format(tweetData.created_at));

  $tweet.append($tweetHeader);
  $tweet.append($tweetBody);
  $tweet.append($tweetFooter);

  return $tweet;

}

function loadTweets() {
  $.ajax('http://localhost:8080/tweets', { method: 'GET' })
    .then((data) => {
      renderTweets(data);
    });
}



$(() => {
  
  loadTweets();
  const $counter = $('.new-tweet .counter').text(140);
  $('#tweet-text').on("input", (e)=>{
    const len = 140 - e.target.value.length;
    let color = ''; 
    if(len<0){
      color = 'red';
    }
    $counter.text(len).css({color:color});
  });
});

